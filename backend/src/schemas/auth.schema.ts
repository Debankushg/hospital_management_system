import { z } from "zod";
import { emailSchema, passwordSchema, totpCodeSchema } from "./common.schema";

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: z.string().min(2).max(255),
  phone: z.string().max(32).optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
  address: z.string().max(500).optional(),
});

export const loginSchema = z.object({ email: emailSchema, password: z.string().min(1) });

export const mfaCodeSchema = z.object({ code: totpCodeSchema });

export const mfaLoginSchema = z
  .object({
    code: totpCodeSchema.optional(),
    recoveryCode: z.string().min(5).max(20).optional(),
  })
  .refine((v) => !!v.code !== !!v.recoveryCode, "Provide exactly one of code or recoveryCode");

export const mfaDisableSchema = z.object({ password: z.string().min(1), code: totpCodeSchema });
