import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { ADMIN_AREAS, PAYMENT_STATUSES, APPOINTMENT_STATUSES, ATTENDANCE_STATUSES, LEAVE_STATUSES, LEAVE_TYPES, ROLES, SPECIALTIES } from "../models/enums";
import type { adminAssignments } from "../models/admin-assignment.model";
import type { appointments } from "../models/appointment.model";
import type { attendanceRecords } from "../models/attendance-record.model";
import type { dutySchedules } from "../models/duty-schedule.model";
import type { leaveRecords } from "../models/leave-record.model";
import type { payments } from "../models/payment.model";
import type { prescriptions } from "../models/prescription.model";
import type { users } from "../models/user.model";

export type Role = (typeof ROLES)[number];
export type Specialty = (typeof SPECIALTIES)[number];
export type AdminArea = (typeof ADMIN_AREAS)[number];

export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];
export type Appointment = InferSelectModel<typeof appointments>;
export type Payment = InferSelectModel<typeof payments>;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export type Prescription = InferSelectModel<typeof prescriptions>;
export type LeaveStatus = (typeof LEAVE_STATUSES)[number];
export type LeaveType = (typeof LEAVE_TYPES)[number];

export type DutySchedule = InferSelectModel<typeof dutySchedules>;
export type AttendanceRecord = InferSelectModel<typeof attendanceRecords>;
export type LeaveRecord = InferSelectModel<typeof leaveRecords>;

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type AdminAssignment = InferSelectModel<typeof adminAssignments>;

/** User fields that are safe to return from the API. */
export interface PublicUser {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: Role;
  /** Admins only: the staff role they work as. */
  baseRole: Role | null;
  isActive: boolean;
  mfaEnabled: boolean;
  createdAt: Date;
}

/**
 * mfa_pending : password OK, must submit TOTP/recovery code
 * mfa_setup   : password OK, staff account that must enrol MFA before anything else
 * full        : fully authenticated
 */
export type TokenStage = "mfa_pending" | "mfa_setup" | "full";
