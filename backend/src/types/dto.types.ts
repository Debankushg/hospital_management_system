import type { z } from "zod";
import type { adminAssignmentsSchema, createAdminSchema, updateAdminWorkSchema } from "../schemas/admin.schema";
import type { loginSchema, mfaLoginSchema, registerSchema } from "../schemas/auth.schema";
import type { markAttendanceSchema } from "../schemas/attendance.schema";
import type { dutyScheduleSchema } from "../schemas/duty.schema";
import type { createLeaveSchema, leaveQuerySchema, requestLeaveSchema, reviewLeaveSchema } from "../schemas/leave.schema";
import type {
  appointmentListQuerySchema,
  approveAppointmentSchema,
  availabilityQuerySchema,
  createAppointmentSchema,
} from "../schemas/appointment.schema";
import type { analyticsQuerySchema, attendanceCalendarQuerySchema } from "../schemas/analytics.schema";
import type { checkedVisitsQuerySchema, doctorPatientsQuerySchema } from "../schemas/consultation.schema";
import type { receivablesQuerySchema, startCheckoutSchema, syncPaymentSchema } from "../schemas/payment.schema";
import type { patientListQuerySchema, updatePatientSchema } from "../schemas/patient.schema";
import type { createUserSchema } from "../schemas/user.schema";

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type MfaLoginInput = z.infer<typeof mfaLoginSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type AssignmentInput = z.infer<typeof adminAssignmentsSchema>["assignments"];

export type DutyScheduleInput = z.infer<typeof dutyScheduleSchema>;
export type MarkAttendanceInput = z.infer<typeof markAttendanceSchema>;
export type CreateLeaveInput = z.infer<typeof createLeaveSchema>;
export type LeaveQuery = z.infer<typeof leaveQuerySchema>;
export type RequestLeaveInput = z.infer<typeof requestLeaveSchema>;
export type ReviewLeaveInput = z.infer<typeof reviewLeaveSchema>;

export type PatientListQuery = z.infer<typeof patientListQuerySchema>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type AppointmentListQuery = z.infer<typeof appointmentListQuerySchema>;
export type AvailabilityQuery = z.infer<typeof availabilityQuerySchema>;
export type ApproveAppointmentInput = z.infer<typeof approveAppointmentSchema>;
export type UpdateAdminWorkInput = z.infer<typeof updateAdminWorkSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
export type DoctorPatientsQuery = z.infer<typeof doctorPatientsQuerySchema>;
export type CheckedVisitsQuery = z.infer<typeof checkedVisitsQuerySchema>;
export type AnalyticsQuery = z.infer<typeof analyticsQuerySchema>;
export type AttendanceCalendarQuery = z.infer<typeof attendanceCalendarQuerySchema>;
export type StartCheckoutInput = z.infer<typeof startCheckoutSchema>;
export type SyncPaymentInput = z.infer<typeof syncPaymentSchema>;
export type ReceivablesQuery = z.infer<typeof receivablesQuerySchema>;
