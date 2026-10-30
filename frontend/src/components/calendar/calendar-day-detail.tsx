import { CalendarDays } from "lucide-react";
import { LEAVE_LABELS } from "@/config/hr.config";
import type { CalendarDay } from "@/types/analytics.types";
import type { Duty } from "@/types/department.types";
import { longDate } from "@/utils/calendar.util";
import { AttendanceStatusBadge } from "./attendance-status-badge";
import { effectiveStatus } from "./calendar-styles";

/** Details of the selected day: date, weekday, status, note, leave and duty hours. */
export function CalendarDayDetail({ day, duty }: { day: CalendarDay | null; duty: Duty | null }) {
  if (!day) {
    return (
      <div className="flex h-full min-h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">
        <CalendarDays className="size-6 text-slate-300" />
        Select a day to see its details.
      </div>
    );
  }
  const status = effectiveStatus(day);

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-5">
      <p className="text-base font-semibold text-slate-900">{longDate(day.date)}</p>
      <dl className="space-y-2.5 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-slate-500">Attendance</dt>
          <dd>{status ? <AttendanceStatusBadge status={status} /> : <span className="text-slate-400">Not marked</span>}</dd>
        </div>
        {day.leaveType && (
          <div className="flex items-center justify-between gap-3">
            <dt className="text-slate-500">Leave</dt>
            <dd className="font-medium text-slate-900">{LEAVE_LABELS[day.leaveType]}</dd>
          </div>
        )}
        <div className="flex items-center justify-between gap-3">
          <dt className="text-slate-500">Duty</dt>
          <dd className="font-medium text-slate-900">
            {day.isWorkDay === null ? "No schedule set" : day.isWorkDay && duty ? `${duty.startTime} – ${duty.endTime}` : "Day off"}
          </dd>
        </div>
        {day.notes && (
          <div>
            <dt className="text-slate-500">Note</dt>
            <dd className="mt-0.5 text-slate-900">{day.notes}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
