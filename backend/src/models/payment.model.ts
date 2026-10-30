import { numeric, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { appointments } from "./appointment.model";
import { paymentStatusEnum } from "./enums";
import { users } from "./user.model";

/** A Stripe Checkout payment for a checked visit. Card details never reach this server. */
export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  appointmentId: uuid("appointment_id")
    .notNull()
    .references(() => appointments.id, { onDelete: "cascade" }),
  patientId: uuid("patient_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull(),
  status: paymentStatusEnum("status").notNull().default("pending"),
  stripeSessionId: varchar("stripe_session_id", { length: 255 }).notNull().unique(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  /** Staff member who started the payment. */
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
