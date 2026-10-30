import { date, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { leaveStatusEnum, leaveTypeEnum } from "./enums";
import { users } from "./user.model";

export const leaveRecords = pgTable("leave_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  leaveType: leaveTypeEnum("leave_type").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  reason: text("reason"),
  /** Admin-recorded leave is approved immediately; staff requests start as pending. */
  status: leaveStatusEnum("status").notNull().default("approved"),
  reviewedBy: uuid("reviewed_by").references(() => users.id, { onDelete: "set null" }),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  reviewNote: text("review_note"),
  recordedBy: uuid("recorded_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
