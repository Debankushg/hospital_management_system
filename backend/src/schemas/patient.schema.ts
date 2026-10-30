import { z } from "zod";
import { paginationQuerySchema } from "./pagination.schema";

export const patientListQuerySchema = paginationQuerySchema.extend({
  sortBy: z.enum(["name", "joined"]).default("name"),
  order: z.enum(["asc", "desc"]).default("asc"),
});

export const updatePatientSchema = z
  .object({
    fullName: z.string().min(2).max(255).optional(),
    phone: z.string().max(32).nullable().optional(),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD").nullable().optional(),
    gender: z.enum(["male", "female", "other"]).nullable().optional(),
    bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).nullable().optional(),
    address: z.string().max(500).nullable().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, "Provide at least one field to update");
