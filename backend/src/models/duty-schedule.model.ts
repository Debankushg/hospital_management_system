import { integer, pgTable, time, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./user.model";

/** One weekly duty schedule per staff member. */
export const dutySchedules = pgTable("duty_schedules", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  /** 0 = Sunday … 6 = Saturday */
  workDays: integer("work_days").array().notNull(),
  updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
