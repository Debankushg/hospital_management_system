import { z } from "zod";
import { ROLES, SPECIALTIES } from "../models/enums";
import { emailSchema, passwordSchema } from "./common.schema";

/** Roles that admins/super admins may create through POST /users (admins have their own endpoint). */
export const CREATABLE_ROLES = ["doctor", "receptionist", "pathologist", "accounts", "patient"] as const;

export const createUserSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    fullName: z.string().min(2).max(255),
    phone: z.string().max(32).optional(),
    role: z.enum(CREATABLE_ROLES),
    specialty: z.enum(SPECIALTIES).optional(),
    licenseNo: z.string().min(3).max(64).optional(),
    consultationFee: z.number().nonnegative().optional(),
  })
  .refine((v) => v.role !== "doctor" || (v.specialty && v.licenseNo), {
    message: "specialty and licenseNo are required for doctors",
    path: ["specialty"],
  });

export const listUsersQuerySchema = z.object({ role: z.enum(ROLES).optional() });

export const setActiveSchema = z.object({ isActive: z.boolean() });

export const doctorQuerySchema = z.object({ specialty: z.enum(SPECIALTIES).optional() });
