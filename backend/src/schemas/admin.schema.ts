import { z } from "zod";
import { ADMIN_AREAS } from "../models/enums";
import { emailSchema, passwordSchema } from "./common.schema";

/** Staff roles an admin can "work as"; they decide which department lists the admin. */
export const BASE_ROLES = ["doctor", "receptionist", "pathologist", "accounts"] as const;

export const adminAssignmentsSchema = z.object({
  assignments: z
    .array(z.object({ area: z.enum(ADMIN_AREAS), notes: z.string().max(500).optional() }))
    .min(1)
    .refine((a) => new Set(a.map((x) => x.area)).size === a.length, "Duplicate areas"),
});

/**
 * Promote / change work. `baseRole` (the admin's profession) is optional here: promotion fills it from the
 * user's previous role and omitting it on update leaves it unchanged. It can never be cleared.
 */
export const updateAdminWorkSchema = adminAssignmentsSchema.extend({
  baseRole: z.enum(BASE_ROLES).optional(),
});

export const createAdminSchema = adminAssignmentsSchema.extend({
  /** Required: the profession decides which department lists the admin ("Doctor, Admin"). */
  baseRole: z.enum(BASE_ROLES),
  email: emailSchema,
  password: passwordSchema,
  fullName: z.string().min(2).max(255),
  phone: z.string().max(32).optional(),
});

export const demoteAdminSchema = z.object({
  role: z.enum(["receptionist", "pathologist", "accounts", "patient"]),
});
