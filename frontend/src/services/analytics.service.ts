import type {
  AttendanceCalendar,
  DoctorAnalytics,
  GroupBy,
  PatientAnalytics,
  RevenueAnalytics,
} from "@/types/analytics.types";
import { apiRequest } from "./api-client";

export interface DateRange {
  from: string;
  to: string;
  groupBy: GroupBy;
}

export const analyticsService = {
  patients: (r: DateRange) => apiRequest<PatientAnalytics>("/analytics/patients", { query: { ...r } }),
  revenue: (r: DateRange) => apiRequest<RevenueAnalytics>("/analytics/revenue", { query: { ...r } }),
  doctors: (r: Pick<DateRange, "from" | "to">) => apiRequest<DoctorAnalytics>("/analytics/doctors", { query: { ...r } }),

  /** Own calendar, or a staff member's when `userId` is given (managers). */
  attendanceCalendar: (month: string, today: string, userId?: string) =>
    apiRequest<AttendanceCalendar>("/analytics/attendance-calendar", { query: { month, today, userId } }),
};
