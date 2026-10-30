import { db } from "../db";
import {
  appointmentRepository,
  patientProfileRepository,
  patientRepository,
  prescriptionRepository,
  userRepository,
} from "../repositories";
import { deletePrescriptionFiles } from "../utils/file-storage.util";
import type { PatientListQuery, UpdatePatientInput } from "../types/dto.types";
import { HttpError } from "../utils/http-error.util";
import { offsetOf, toPage } from "../utils/pagination.util";
import { toPatientView } from "../utils/patient.mapper";

export const patientService = {
  async list(q: PatientListQuery) {
    const { rows, total } = await patientRepository.search({
      search: q.search,
      sortBy: q.sortBy,
      order: q.order,
      limit: q.pageSize,
      offset: offsetOf(q.page, q.pageSize),
    });
    return toPage(
      rows.map((r) => toPatientView(r.user, r.profile)),
      total,
      q.page,
      q.pageSize,
    );
  },

  /** Full patient details with their latest appointments. */
  async get(id: string) {
    const row = await patientRepository.findById(id);
    if (!row) throw new HttpError(404, "Patient not found");
    const { rows } = await appointmentRepository.list({ patientId: id, limit: 50, offset: 0 });
    return { patient: toPatientView(row.user, row.profile), appointments: rows };
  },

  /** Edit a patient's details (all reception staff). Email and password are not editable here. */
  async update(id: string, input: UpdatePatientInput) {
    if (!(await patientRepository.findById(id))) throw new HttpError(404, "Patient not found");
    const { fullName, phone, ...profile } = input;

    await db.transaction(async (tx) => {
      if (fullName !== undefined || phone !== undefined) {
        await userRepository.update(id, { fullName, phone }, tx);
      }
      if (Object.keys(profile).length) await patientProfileRepository.upsert(id, profile, tx);
    });

    const row = (await patientRepository.findById(id))!;
    return toPatientView(row.user, row.profile);
  },

  /** Permanently deletes the patient with their profile and appointments (reception admin / super admin). */
  async remove(id: string) {
    if (!(await patientRepository.findById(id))) throw new HttpError(404, "Patient not found");
    const files = await prescriptionRepository.storedNamesForPatient(id);
    await userRepository.delete(id);
    await deletePrescriptionFiles(files);
  },
};
