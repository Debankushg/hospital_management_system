import { z } from "zod";
import { ADMIN_AREAS, BASE_ROLES } from "@/config/roles.config";
import { emailValidator, fullNameValidator, optionalText, passwordValidator } from "./common.validator";

/** The admin's profession. "" (nothing chosen yet) fails validation. */
const baseRoleValidator = z.enum(BASE_ROLES, { error: "Select what this admin works as" });

export const assignmentsValidator = z
  .array(z.object({ area: z.enum(ADMIN_AREAS), notes: z.string().max(500).optional() }))
  .min(1, "Select at least one work area");

export const createAdminValidator = z.object({
  fullName: fullNameValidator,
  email: emailValidator,
  password: passwordValidator,
  phone: optionalText(32),
  baseRole: baseRoleValidator,
  assignments: assignmentsValidator,
});

export const promoteUserValidator = z.object({
  userId: z.string().min(1, "Select a user"),
  /** Only needed for users who are not already doctors / receptionists / pathologists / accounts staff. */
  baseRole: z.union([z.literal(""), z.enum(BASE_ROLES)]).optional(),
  assignments: assignmentsValidator,
});

export const updateAssignmentsValidator = z.object({ baseRole: baseRoleValidator, assignments: assignmentsValidator });
