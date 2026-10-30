import { z } from "zod";
import { fullNameValidator, optionalText } from "./common.validator";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

/** "" means "clear this field". */
export const editPatientValidator = z.object({
  fullName: fullNameValidator,
  phone: optionalText(32),
  dateOfBirth: z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")]).optional(),
  gender: z.enum(["", "male", "female", "other"]).optional(),
  bloodGroup: z.enum(["", ...BLOOD_GROUPS]).optional(),
  address: optionalText(500),
});
