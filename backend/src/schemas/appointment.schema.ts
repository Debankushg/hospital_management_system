import { z } from "zod";
import { APPOINTMENT_STATUSES, SPECIALTIES } from "../models/enums";
import { isoDateSchema } from "./attendance.schema";
import { paginationQuerySchema } from "./pagination.schema";

export const createAppointmentSchema = z.object({
  /** Required when a receptionist books for a patient; ignored for patients (they book for themselves). */
  patientId: z.string().uuid().optional(),
  specialty: z.enum(SPECIALTIES),
  preferredDoctorId: z.string().uuid().optional(),
  date: isoDateSchema,
  reason: z.string().max(500).optional(),
});

export const appointmentListQuerySchema = paginationQuerySchema.extend({
  status: z.enum(APPOINTMENT_STATUSES).optional(),
  date: isoDateSchema.optional(),
});

export const availabilityQuerySchema = z.object({ specialty: z.enum(SPECIALTIES), date: isoDateSchema });

export const approveAppointmentSchema = z.object({
  doctorId: z.string().uuid(),
  note: z.string().max(500).optional(),
});

export const rejectAppointmentSchema = z.object({ note: z.string().max(500).optional() });
