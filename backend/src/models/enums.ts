import { pgEnum } from "drizzle-orm/pg-core";

export const ROLES = [
  "super_admin",
  "admin",
  "doctor",
  "receptionist",
  "pathologist",
  "accounts",
  "patient",
] as const;

export const SPECIALTIES = [
  "opd",
  "gynecologist",
  "cardiologist",
  "ent",
  "dermatologist",
  "pediatrician",
] as const;

/** Work areas a super admin can hand to an admin. */
export const ADMIN_AREAS = [
  "doctor_management",
  "reception_management",
  "pathology_management",
  "accounts_management",
  "patient_management",
] as const;

export const ATTENDANCE_STATUSES = ["present", "absent", "late", "half_day", "on_leave"] as const;

export const LEAVE_TYPES = ["sick", "casual", "annual", "unpaid", "other"] as const;

export const LEAVE_STATUSES = ["pending", "approved", "rejected"] as const;

export const APPOINTMENT_STATUSES = ["requested", "approved", "checked", "rejected", "cancelled"] as const;

export const PAYMENT_STATUSES = ["pending", "paid", "expired"] as const;

export const roleEnum = pgEnum("role", ROLES);
export const specialtyEnum = pgEnum("specialty", SPECIALTIES);
export const adminAreaEnum = pgEnum("admin_area", ADMIN_AREAS);
export const attendanceStatusEnum = pgEnum("attendance_status", ATTENDANCE_STATUSES);
export const leaveTypeEnum = pgEnum("leave_type", LEAVE_TYPES);
export const leaveStatusEnum = pgEnum("leave_status", LEAVE_STATUSES);
export const appointmentStatusEnum = pgEnum("appointment_status", APPOINTMENT_STATUSES);
export const paymentStatusEnum = pgEnum("payment_status", PAYMENT_STATUSES);
