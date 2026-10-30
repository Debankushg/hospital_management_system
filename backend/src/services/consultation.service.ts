import {
  appointmentRepository,
  doctorProfileRepository,
  patientRepository,
  prescriptionRepository,
} from "../repositories";
import type { User } from "../types/domain.types";
import type { CheckedVisitsQuery, DoctorPatientsQuery } from "../types/dto.types";
import { deletePrescriptionFiles, isPdf, safeFileName, savePrescriptionFile } from "../utils/file-storage.util";
import { HttpError } from "../utils/http-error.util";
import { permissionService } from "./permission.service";
import { offsetOf, toPage } from "../utils/pagination.util";
import { toPatientView } from "../utils/patient.mapper";

export const MAX_PRESCRIPTION_BYTES = 5 * 1024 * 1024;
const MAX_PRESCRIPTIONS_PER_VISIT = 5;

/** The doctor's own appointment, or 404 (we do not reveal other doctors' appointments). */
async function ownAppointment(actor: User, id: string) {
  const appt = await appointmentRepository.findById(id);
  if (!appt || appt.doctorId !== actor.id || (appt.status !== "approved" && appt.status !== "checked")) {
    throw new HttpError(404, "Appointment not found");
  }
  return appt;
}

const groupBy = <T extends { appointmentId: string }>(items: T[]) => {
  const map = new Map<string, T[]>();
  for (const i of items) map.set(i.appointmentId, [...(map.get(i.appointmentId) ?? []), i]);
  return map;
};

export const consultationService = {
  /** Patients assigned to this doctor (approved = still to see, checked = done). */
  async listPatients(actor: User, q: DoctorPatientsQuery) {
    const { rows, total } = await appointmentRepository.list({
      doctorId: actor.id,
      statuses: q.status ? [q.status] : ["approved", "checked"],
      date: q.date,
      search: q.search,
      sort: "date_asc",
      limit: q.pageSize,
      offset: offsetOf(q.page, q.pageSize),
    });
    return toPage(rows, total, q.page, q.pageSize);
  },

  /** Full picture for one assigned patient: details, this visit's prescriptions and visit history. */
  async detail(actor: User, id: string) {
    const appt = await ownAppointment(actor, id);
    const patient = await patientRepository.findById(appt.patientId);
    if (!patient) throw new HttpError(404, "Patient not found");

    const { rows } = await appointmentRepository.list({
      patientId: appt.patientId,
      statuses: ["approved", "checked"],
      sort: "date_desc",
      limit: 50,
      offset: 0,
    });
    const prescriptions = groupBy(await prescriptionRepository.listByAppointmentIds(rows.map((r) => r.id)));
    const withRx = rows.map((r) => ({ ...r, prescriptions: prescriptions.get(r.id) ?? [] }));

    return {
      appointment: withRx.find((r) => r.id === id)!,
      patient: toPatientView(patient.user, patient.profile),
      history: withRx.filter((r) => r.id !== id),
    };
  },

  async addPrescription(actor: User, id: string, file: unknown, rawName: string | undefined) {
    const appt = await ownAppointment(actor, id);
    if (!Buffer.isBuffer(file) || file.length === 0) {
      throw new HttpError(415, "Send the PDF as the request body with Content-Type: application/pdf");
    }
    if (file.length > MAX_PRESCRIPTION_BYTES) throw new HttpError(413, "File too large (max 5 MB)");
    if (!isPdf(file)) throw new HttpError(400, "Only PDF files are allowed");
    const existing = await prescriptionRepository.listByAppointmentIds([id]);
    if (existing.length >= MAX_PRESCRIPTIONS_PER_VISIT) {
      throw new HttpError(409, `At most ${MAX_PRESCRIPTIONS_PER_VISIT} prescriptions per visit`);
    }

    const storedName = await savePrescriptionFile(file);
    const row = await prescriptionRepository.create({
      appointmentId: appt.id,
      patientId: appt.patientId,
      doctorId: actor.id,
      fileName: safeFileName(rawName),
      storedName,
      sizeBytes: file.length,
    });
    const { storedName: _hidden, patientId: _p, ...publicRow } = row;
    return publicRow;
  },

  /** Marks the patient as checked: the visit then shows up for reception and accounts. */
  async check(actor: User, id: string) {
    const appt = await ownAppointment(actor, id);
    if (appt.status === "checked") throw new HttpError(409, "Patient is already marked as checked");
    const profile = await doctorProfileRepository.findByUser(actor.id);
    return appointmentRepository.update(id, {
      status: "checked",
      checkedAt: new Date(),
      checkedBy: actor.id,
      checkedFee: profile?.consultationFee ?? null,
    });
  },

  /**
   * Checked patients, newest first: shared with reception and accounts. Reception also gets the prescription
   * metadata (to open the PDFs); accounts only sees how many are attached.
   */
  async listChecked(actor: User, q: CheckedVisitsQuery) {
    const { rows, total } = await appointmentRepository.list({
      status: "checked",
      date: q.date,
      search: q.search,
      sort: "checked_desc",
      limit: q.pageSize,
      offset: offsetOf(q.page, q.pageSize),
    });
    const canOpenFiles = await permissionService.canUseReception(actor);
    const rx = canOpenFiles ? await prescriptionRepository.listByAppointmentIds(rows.map((r) => r.id)) : [];
    const items = rows.map((r) => ({ ...r, prescriptions: rx.filter((p) => p.appointmentId === r.id) }));
    return toPage(items, total, q.page, q.pageSize);
  },

  /** Removes a prescription (the doctor who uploaded it). */
  async removePrescription(actor: User, prescriptionId: string) {
    const rx = await prescriptionRepository.findById(prescriptionId);
    if (!rx || rx.doctorId !== actor.id) throw new HttpError(404, "Prescription not found");
    await prescriptionRepository.delete(prescriptionId);
    await deletePrescriptionFiles([rx.storedName]);
  },
};
