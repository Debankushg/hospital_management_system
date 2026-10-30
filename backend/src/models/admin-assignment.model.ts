import { pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { adminAreaEnum } from "./enums";
import { users } from "./user.model";

export const adminAssignments = pgTable(
  "admin_assignments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    adminId: uuid("admin_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    area: adminAreaEnum("area").notNull(),
    notes: text("notes"),
    assignedBy: uuid("assigned_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  // One admin per department: an area can belong to only one admin at a time.
  (t) => ({ uniq: unique().on(t.adminId, t.area), oneAdminPerArea: unique("admin_assignments_area_unique").on(t.area) }),
);
