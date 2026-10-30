import { date, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { attendanceStatusEnum } from "./enums";
import { users } from "./user.model";

export const attendanceRecords = pgTable(
  "attendance_records",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    status: attendanceStatusEnum("status").notNull(),
    notes: text("notes"),
    markedBy: uuid("marked_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ uniq: unique().on(t.userId, t.date) }),
);
