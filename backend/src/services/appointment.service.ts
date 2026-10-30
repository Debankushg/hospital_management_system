import { appointmentRepository, patientRepository, prescriptionRepository } from "../repositories";
import type { User } from "../types/domain.types";
import type {
  AppointmentListQuery,
  ApproveAppointmentInput,
  AvailabilityQuery,
  CreateAppointmentInput,
} from "../types/dto.types";
import { HttpError } from "../utils/http-error.util";
import { offsetOf, toPage } from "../utils/pagination.util";
import { doctorAvailabilityService } from "./doctor-availability.service";
import { permissionService } from "./permission.service";

/** Earliest date any timezone could currently be on (UTC-12), so "today" is never rejected. */
const earliestAllowedDate = () => new Date(Date.now() - 12 * 3_600_000).toISOString().slice(0, 10);

async function loadOrFail(id: string) {
  const appt = await appointmentRepository.findById(id);
  if (!appt) throw new HttpError(404, "Appointment not found");
  return appt;
}

export const appointmentService = {
  /** Patients book for themselves; receptionists/super admin book on behalf of a patient. */
  async create(actor: User, input: CreateAppointmentInput) {
    let patientId = actor.id;
    if (actor.role !== "patient") {
      if (!input.patientId) throw new HttpError(400, "patientId is required");
      if (!(await patientRepository.findById(input.patientId))) throw new HttpError(404, "Patient not found");
      patientId = input.patientId;
    }
    if (input.date < earliestAllowedDate()) throw new HttpError(400, "The appointment date cannot be in the past");

    if (input.preferredDoctorId) {
      const doctors = await doctorAvailabilityService.forDate(input.specialty, input.date);
      if (!doctors.some((d) => d.id === input.preferredDoctorId)) {
        throw new HttpError(400, "Preferred doctor does not match the required specialty");
      }
    }

    return appointmentRepository.create({
      patientId,
      specialty: input.specialty,
      requestedDoctorId: input.preferredDoctorId,
      appointmentDate: input.date,
      reason: input.reason,
      createdBy: actor.id,
    });
  },

  /** The patient's own appointments, each with its prescriptions (PDF metadata). */
  async mine(actor: User) {
    const { rows } = await appointmentRepository.list({ patientId: actor.id, limit: 100, offset: 0 });
    const rx = await prescriptionRepository.listByAppointmentIds(rows.map((r) => r.id));
    return rows.map((r) => ({ ...r, prescriptions: rx.filter((p) => p.appointmentId === r.id) }));
  },

  async list(q: AppointmentListQuery) {
    const { rows, total } = await appointmentRepository.list({
      status: q.status,
      date: q.date,
      search: q.search,
      limit: q.pageSize,
      offset: offsetOf(q.page, q.pageSize),
    });
    return toPage(rows, total, q.page, q.pageSize);
  },

  availability(q: AvailabilityQuery) {
    return doctorAvailabilityService.forDate(q.specialty, q.date);
  },

  /**
   * Assign a doctor and approve. The doctor must match the patient's required specialty and be
   * available that day. An already approved appointment can be re-assigned (e.g. doctor became absent).
   */
  async approve(actor: User, id: string, input: ApproveAppointmentInput) {
    const appt = await loadOrFail(id);
    if (appt.status !== "requested" && appt.status !== "approved") {
      throw new HttpError(409, `Appointment is already ${appt.status}`);
    }

    const doctors = await doctorAvailabilityService.forDate(appt.specialty, appt.appointmentDate);
    const doctor = doctors.find((d) => d.id === input.doctorId);
    if (!doctor) throw new HttpError(400, "Doctor does not match the patient's required specialty");
    if (!doctor.available) {
      throw new HttpError(409, `Dr. ${doctor.fullName} is not available on this date (${doctor.reason})`);
    }

    return appointmentRepository.update(id, {
      doctorId: doctor.id,
      status: "approved",
      note: input.note ?? null,
      handledBy: actor.id,
      handledAt: new Date(),
    });
  },

  async reject(actor: User, id: string, note?: string) {
    const appt = await loadOrFail(id);
    if (appt.status !== "requested") throw new HttpError(409, `Appointment is already ${appt.status}`);
    return appointmentRepository.update(id, {
      status: "rejected",
      note: note ?? null,
      handledBy: actor.id,
      handledAt: new Date(),
    });
  },

  /** Patients cancel their own; receptionists / super admin cancel any. */
  async cancel(actor: User, id: string) {
    const appt = await loadOrFail(id);
    if (appt.patientId !== actor.id && !(await permissionService.canUseReception(actor))) {
      throw new HttpError(403, "You can only cancel your own appointments");
    }
    if (appt.status !== "requested" && appt.status !== "approved") {
      throw new HttpError(409, `Appointment is already ${appt.status}`);
    }
    return appointmentRepository.update(id, { status: "cancelled" });
  },
};
