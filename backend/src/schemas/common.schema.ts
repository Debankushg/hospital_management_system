import { z } from "zod";

export const emailSchema = z.string().email();

export const passwordSchema = z
  .string()
  .min(10, "at least 10 characters")
  .max(128)
  .regex(/[a-z]/, "needs a lowercase letter")
  .regex(/[A-Z]/, "needs an uppercase letter")
  .regex(/[0-9]/, "needs a digit")
  .regex(/[^A-Za-z0-9]/, "needs a symbol");

export const totpCodeSchema = z.string().regex(/^\d{6}$/, "must be a 6-digit code");

export const userIdParamSchema = z.object({ userId: z.string().uuid() });
export const idParamSchema = z.object({ id: z.string().uuid() });
