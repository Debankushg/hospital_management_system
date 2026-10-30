import {
  appointmentListQuerySchema,
  approveAppointmentSchema,
  availabilityQuerySchema,
  createAppointmentSchema,
  rejectAppointmentSchema,
} from "../schemas/appointment.schema";
import { validate } from "./validate";

export const validateCreateAppointment = validate(createAppointmentSchema);
export const validateAppointmentListQuery = validate(appointmentListQuerySchema, "query");
export const validateAvailabilityQuery = validate(availabilityQuerySchema, "query");
export const validateApproveAppointment = validate(approveAppointmentSchema);
export const validateRejectAppointment = validate(rejectAppointmentSchema);
