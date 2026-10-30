import { z } from "zod";
import { SPECIALTIES } from "@/config/roles.config";

export const bookAppointmentValidator = z.object({
  specialty: z.enum(SPECIALTIES),
  preferredDoctorId: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Select a date"),
  reason: z.string().max(500).optional(),
});
