import { and, asc, count, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "../db";
import { appointments, doctorProfiles, users } from "../models";
import type { DbExecutor } from "../types/db.types";
import type { Appointment, AppointmentStatus } from "../types/domain.types";
import { likePattern } from "../utils/pagination.util";

const requestedDoctor = alias(users, "requested_doctor");
const assignedDoctor = alias(users, "assigned_doctor");

/** Appointment joined with the patient and doctors' names. */
const listShape = {
  id: appointments.id,
  specialty: appointments.specialty,
  date: appointments.appointmentDate,
  reason: appointments.reason,
  status: appointments.status,
  note: appointments.note,
  createdAt: appointments.createdAt,
  handledAt: appointments.handledAt,
  checkedAt: appointments.checkedAt,
  prescriptionCount: sql<number>`(select count(*)::int from prescriptions p where p.appointment_id = ${appointments.id})`,
  consultationFee: sql<string | null>`coalesce(${appointments.checkedFee}, ${doctorProfiles.consultationFee})`,
  patientId: appointments.patientId,
  patientName: users.fullName,
  patientEmail: users.email,
  patientPhone: users.phone,
  requestedDoctorId: appointments.requestedDoctorId,
  requestedDoctorName: requestedDoctor.fullName,
  doctorId: appointments.doctorId,
  doctorName: assignedDoctor.fullName,
};

type ListSort = "created_desc" | "date_asc" | "date_desc" | "checked_desc";

interface ListFilter {
  patientId?: string;
  doctorId?: string;
  status?: AppointmentStatus;
  statuses?: AppointmentStatus[];
  sort?: ListSort;
  date?: string;
  search?: string;
  /** Checked visits only: has a paid Stripe payment (or not). */
  paid?: boolean;
  limit: number;
  offset: number;
}

export const appointmentRepository = {
  async create(values: typeof appointments.$inferInsert, ex: DbExecutor = db): Promise<Appointment> {
    const [row] = await ex.insert(appointments).values(values).returning();
    return row;
  },

  async findById(id: string, ex: DbExecutor = db): Promise<Appointment | undefined> {
    const [row] = await ex.select().from(appointments).where(eq(appointments.id, id));
    return row;
  },

  async update(id: string, values: Partial<typeof appointments.$inferInsert>, ex: DbExecutor = db) {
    const [row] = await ex
      .update(appointments)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();
    return row;
  },

  async list(f: ListFilter, ex: DbExecutor = db) {
    const pattern = f.search ? likePattern(f.search) : undefined;
    const where = and(
      f.patientId ? eq(appointments.patientId, f.patientId) : undefined,
      f.doctorId ? eq(appointments.doctorId, f.doctorId) : undefined,
      f.status ? eq(appointments.status, f.status) : undefined,
      f.statuses ? inArray(appointments.status, f.statuses) : undefined,
      f.date ? eq(appointments.appointmentDate, f.date) : undefined,
      pattern ? or(ilike(users.fullName, pattern), ilike(users.email, pattern)) : undefined,
      f.paid === undefined
        ? undefined
        : f.paid
          ? sql`exists (select 1 from payments p where p.appointment_id = ${appointments.id} and p.status = 'paid')`
          : sql`not exists (select 1 from payments p where p.appointment_id = ${appointments.id} and p.status = 'paid')`,
    );
    const base = ex
      .select(listShape)
      .from(appointments)
      .innerJoin(users, eq(users.id, appointments.patientId))
      .leftJoin(requestedDoctor, eq(requestedDoctor.id, appointments.requestedDoctorId))
      .leftJoin(assignedDoctor, eq(assignedDoctor.id, appointments.doctorId))
      .leftJoin(doctorProfiles, eq(doctorProfiles.userId, appointments.doctorId))
      .where(where);

    const order = {
      created_desc: [desc(appointments.createdAt), desc(appointments.id)],
      date_asc: [asc(appointments.appointmentDate), asc(appointments.createdAt), asc(appointments.id)],
      date_desc: [desc(appointments.appointmentDate), desc(appointments.createdAt), desc(appointments.id)],
      checked_desc: [desc(appointments.checkedAt), desc(appointments.id)],
    }[f.sort ?? "created_desc"];
    const rows = await base.orderBy(...order).limit(f.limit).offset(f.offset);
    const [{ total }] = await ex
      .select({ total: count() })
      .from(appointments)
      .innerJoin(users, eq(users.id, appointments.patientId))
      .where(where);
    return { rows, total };
  },

  /** True if the doctor has an approved/checked appointment with this patient (a care relationship). */
  async doctorTreatsPatient(doctorId: string, patientId: string, ex: DbExecutor = db): Promise<boolean> {
    const [row] = await ex
      .select({ id: appointments.id })
      .from(appointments)
      .where(
        and(
          eq(appointments.doctorId, doctorId),
          eq(appointments.patientId, patientId),
          inArray(appointments.status, ["approved", "checked"]),
        ),
      )
      .limit(1);
    return !!row;
  },

  /** Number of approved/checked appointments per doctor on a date (workload hint for the receptionist). */
  async countApprovedByDoctors(doctorIds: string[], date: string, ex: DbExecutor = db) {
    if (!doctorIds.length) return new Map<string, number>();
    const rows = await ex
      .select({ doctorId: appointments.doctorId, n: count() })
      .from(appointments)
      .where(
        and(
          inArray(appointments.doctorId, doctorIds),
          eq(appointments.appointmentDate, date),
          inArray(appointments.status, ["approved", "checked"]),
        ),
      )
      .groupBy(appointments.doctorId);
    return new Map(rows.map((r) => [r.doctorId as string, r.n]));
  },
};
