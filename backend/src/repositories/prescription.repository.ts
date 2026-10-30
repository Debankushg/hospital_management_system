import { asc, eq, inArray } from "drizzle-orm";
import { db } from "../db";
import { prescriptions } from "../models";
import type { DbExecutor } from "../types/db.types";
import type { Prescription } from "../types/domain.types";

/** Metadata safe to return to clients (never the stored file name). */
const publicShape = {
  id: prescriptions.id,
  appointmentId: prescriptions.appointmentId,
  doctorId: prescriptions.doctorId,
  fileName: prescriptions.fileName,
  sizeBytes: prescriptions.sizeBytes,
  createdAt: prescriptions.createdAt,
};

export const prescriptionRepository = {
  async create(values: typeof prescriptions.$inferInsert, ex: DbExecutor = db): Promise<Prescription> {
    const [row] = await ex.insert(prescriptions).values(values).returning();
    return row;
  },

  async findById(id: string, ex: DbExecutor = db): Promise<Prescription | undefined> {
    const [row] = await ex.select().from(prescriptions).where(eq(prescriptions.id, id));
    return row;
  },

  async delete(id: string, ex: DbExecutor = db) {
    await ex.delete(prescriptions).where(eq(prescriptions.id, id));
  },

  listByAppointmentIds(ids: string[], ex: DbExecutor = db) {
    if (!ids.length) return Promise.resolve([]);
    return ex
      .select(publicShape)
      .from(prescriptions)
      .where(inArray(prescriptions.appointmentId, ids))
      .orderBy(asc(prescriptions.createdAt));
  },

  /**
   * Stored file names of a patient's prescriptions, to clean up the disk when the patient is deleted
   * (their rows cascade). A deleted doctor's prescriptions are kept: they belong to the patient.
   */
  async storedNamesForPatient(patientId: string, ex: DbExecutor = db): Promise<string[]> {
    const rows = await ex
      .select({ storedName: prescriptions.storedName })
      .from(prescriptions)
      .where(eq(prescriptions.patientId, patientId));
    return rows.map((r) => r.storedName);
  },
};
