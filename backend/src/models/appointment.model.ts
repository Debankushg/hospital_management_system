import { date, index, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { appointmentStatusEnum, specialtyEnum } from "./enums";
import { users } from "./user.model";

/** A patient's request for treatment on a date; a receptionist assigns a doctor and approves it. */
export const appointments = pgTable(
  "appointments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    patientId: uuid("patient_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /** The patient's requirement, e.g. OPD or cardiologist. */
    specialty: specialtyEnum("specialty").notNull(),
    requestedDoctorId: uuid("requested_doctor_id").references(() => users.id, { onDelete: "set null" }),
    /** Doctor assigned by the receptionist. */
    doctorId: uuid("doctor_id").references(() => users.id, { onDelete: "set null" }),
    appointmentDate: date("appointment_date").notNull(),
    reason: text("reason"),
    status: appointmentStatusEnum("status").notNull().default("requested"),
    /** Receptionist's note when approving / rejecting. */
    note: text("note"),
    handledBy: uuid("handled_by").references(() => users.id, { onDelete: "set null" }),
    handledAt: timestamp("handled_at", { withTimezone: true }),
    /** Set when the doctor marks the patient as checked (consultation done). */
    checkedAt: timestamp("checked_at", { withTimezone: true }),
    /** Doctor's consultation fee at the moment the patient was checked: revenue history stays stable. */
    checkedFee: numeric("checked_fee", { precision: 10, scale: 2 }),
    checkedBy: uuid("checked_by").references(() => users.id, { onDelete: "set null" }),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ statusDateIdx: index("appointments_status_date_idx").on(t.status, t.appointmentDate) }),
);
