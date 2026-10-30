import { z } from "zod";

export const emailValidator = z.email("Enter a valid email");

/** Same rules as the backend password policy. */
export const passwordValidator = z
  .string()
  .min(10, "At least 10 characters")
  .max(128)
  .regex(/[a-z]/, "Needs a lowercase letter")
  .regex(/[A-Z]/, "Needs an uppercase letter")
  .regex(/[0-9]/, "Needs a digit")
  .regex(/[^A-Za-z0-9]/, "Needs a symbol");

export const totpCodeValidator = z.string().regex(/^\d{6}$/, "Enter the 6-digit code");

export const fullNameValidator = z.string().min(2, "Enter the full name").max(255);

/** Optional text input: empty string is allowed (it is stripped before sending). */
export const optionalText = (max: number) => z.string().max(max).optional();
