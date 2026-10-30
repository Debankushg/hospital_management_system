import { numeric, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { specialtyEnum } from "./enums";
import { users } from "./user.model";

export const doctorProfiles = pgTable("doctor_profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  specialty: specialtyEnum("specialty").notNull(),
  licenseNo: varchar("license_no", { length: 64 }).notNull().unique(),
  consultationFee: numeric("consultation_fee", { precision: 10, scale: 2 }),
});
