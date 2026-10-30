import { date, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./user.model";

export const patientProfiles = pgTable("patient_profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  dateOfBirth: date("date_of_birth"),
  gender: varchar("gender", { length: 16 }),
  bloodGroup: varchar("blood_group", { length: 4 }),
  address: text("address"),
});
