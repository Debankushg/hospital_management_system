import { ATTENDANCE_LABELS } from "@/config/hr.config";
import type { AttendanceStatus } from "@/types/attendance.types";
import type { CalendarDay } from "@/types/analytics.types";

/** Tint classes use the theme-aware families (they invert in dark mode). */
export const STATUS_STYLE: Record<AttendanceStatus, { cell: string; dot: string; badge: "green" | "amber" | "purple" | "red" | "teal" }> = {
  present: { cell: "border-emerald-200 bg-emerald-50 text-emerald-700", dot: "bg-emerald-500", badge: "green" },
  late: { cell: "border-amber-200 bg-amber-50 text-amber-700", dot: "bg-amber-500", badge: "amber" },
  half_day: { cell: "border-violet-200 bg-violet-50 text-violet-700", dot: "bg-violet-500", badge: "purple" },
  absent: { cell: "border-red-200 bg-red-50 text-red-700", dot: "bg-red-500", badge: "red" },
  on_leave: { cell: "border-brand-200 bg-brand-50 text-brand-ink", dot: "bg-brand-500", badge: "teal" },
};

/** What to show for a day: its marked status, otherwise approved leave. */
export function effectiveStatus(day: CalendarDay): AttendanceStatus | null {
  return day.status ?? (day.leaveType ? "on_leave" : null);
}

export const statusLabel = (s: AttendanceStatus) => ATTENDANCE_LABELS[s];
