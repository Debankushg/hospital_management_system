import { z } from "zod";
import {
  emailValidator,
  fullNameValidator,
  optionalText,
  passwordValidator,
  totpCodeValidator,
} from "./common.validator";

export const loginValidator = z.object({
  email: emailValidator,
  password: z.string().min(1, "Enter your password"),
});

export const registerValidator = z
  .object({
    fullName: fullNameValidator,
    email: emailValidator,
    password: passwordValidator,
    confirmPassword: z.string(),
    phone: optionalText(32),
    dateOfBirth: z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")]).optional(),
    gender: z.enum(["", "male", "female", "other"]).optional(),
    bloodGroup: z.enum(["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
    address: optionalText(500),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const mfaCodeValidator = z.object({ code: totpCodeValidator });

/** Login step 2: either an authenticator code or a recovery code. */
export const mfaVerifyValidator = z.object({
  code: z.string().min(5, "Enter your code").max(20),
});

export const mfaDisableValidator = z.object({
  password: z.string().min(1, "Enter your password"),
  code: totpCodeValidator,
});
