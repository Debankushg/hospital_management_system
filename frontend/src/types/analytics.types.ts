import type { AttendanceStatus } from "./attendance.types";
import type { LeaveType } from "./leave.types";
import type { PublicUser } from "./user.types";
import type { Duty } from "./department.types";

export type GroupBy = "day" | "month";

export interface PatientBucket {
  bucket: string;
  requested: number;
  approved: number;
  checked: number;
  cancelled: number;
  newPatients: number;
}

export interface PatientAnalytics {
  groupBy: GroupBy;
  series: PatientBucket[];
  totals: { totalPatients: number; newPatients: number; appointments: number; checked: number; pending: number };
}

export interface RevenueAnalytics {
  groupBy: GroupBy;
  series: { bucket: string; collected: number; pending: number; revenue: number; visits: number }[];
  bySpecialty: { specialty: string; revenue: number; visits: number }[];
  totals: {
    collected: number;
    pending: number;
    /** collected + pending */
    revenue: number;
    visits: number;
    averagePerVisit: number;
    /** 0..1 */
    collectionRate: number;
  };
}

export interface DoctorWorkload {
  doctorId: string;
  doctorName: string;
  specialty: string;
  checked: number;
  unchecked: number;
}

export interface DoctorAnalytics {
  doctors: DoctorWorkload[];
  totals: { checked: number; unchecked: number };
}

export interface CalendarDay {
  date: string;
  /** 0 = Sunday … 6 = Saturday */
  weekday: number;
  status: AttendanceStatus | null;
  notes: string | null;
  leaveType: LeaveType | null;
  /** null when no duty schedule is set */
  isWorkDay: boolean | null;
}

export interface AttendanceCalendar {
  month: string;
  user: PublicUser;
  duty: Duty | null;
  days: CalendarDay[];
  summary: { present: number; late: number; halfDay: number; absent: number; onLeave: number; unmarked: number | null };
}
