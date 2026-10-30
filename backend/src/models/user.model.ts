import { boolean, integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { roleEnum } from "./enums";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 32 }),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull().default("patient"),
  /**
   * For admins: the staff role they work as (doctor, receptionist…), shown as "Doctor, Admin".
   * Set automatically on promotion; null for admins created without one.
   */
  baseRole: roleEnum("base_role"),
  isActive: boolean("is_active").notNull().default(true),

  mfaEnabled: boolean("mfa_enabled").notNull().default(false),
  /** AES-256-GCM encrypted TOTP secret (iv:tag:ciphertext, hex). */
  mfaSecretEnc: text("mfa_secret_enc"),

  failedAttempts: integer("failed_attempts").notNull().default(0),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),

  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
