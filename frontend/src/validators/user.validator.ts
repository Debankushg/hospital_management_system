import { z } from "zod";
import { CREATABLE_ROLES, SPECIALTIES } from "@/config/roles.config";
import { emailValidator, fullNameValidator, optionalText, passwordValidator } from "./common.validator";

export const createUserValidator = z
  .object({
    fullName: fullNameValidator,
    email: emailValidator,
    password: passwordValidator,
    phone: optionalText(32),
    role: z.enum(CREATABLE_ROLES),
    specialty: z.union([z.literal(""), z.enum(SPECIALTIES)]).optional(),
    licenseNo: optionalText(64),
    consultationFee: z.union([z.literal(""), z.string().regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount")]).optional(),
  })
  .superRefine((v, ctx) => {
    if (v.role !== "doctor") return;
    if (!v.specialty) ctx.addIssue({ code: "custom", path: ["specialty"], message: "Select a specialty" });
    if (!v.licenseNo || v.licenseNo.length < 3) {
      ctx.addIssue({ code: "custom", path: ["licenseNo"], message: "Enter the license number" });
    }
  });
