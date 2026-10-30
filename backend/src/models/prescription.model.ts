import { integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { appointments } from "./appointment.model";
import { users } from "./user.model";

/** A PDF prescription attached by the doctor to an appointment. The file lives in UPLOAD_DIR. */
export const prescriptions = pgTable("prescriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  appointmentId: uuid("appointment_id")
    .notNull()
    .references(() => appointments.id, { onDelete: "cascade" }),
  patientId: uuid("patient_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  doctorId: uuid("doctor_id").references(() => users.id, { onDelete: "set null" }),
  /** Original file name shown to users. */
  fileName: varchar("file_name", { length: 255 }).notNull(),
  /** Generated name on disk. */
  storedName: varchar("stored_name", { length: 100 }).notNull().unique(),
  sizeBytes: integer("size_bytes").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
