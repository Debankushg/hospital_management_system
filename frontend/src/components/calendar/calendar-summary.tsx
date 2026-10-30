import type { AttendanceCalendar } from "@/types/analytics.types";
import type { AttendanceStatus } from "@/types/attendance.types";
import { cn } from "@/utils/cn";
import { STATUS_STYLE, statusLabel } from "./calendar-styles";

/** Month totals as a row of coloured chips (also works as the legend). */
export function CalendarSummary({ summary }: { summary: AttendanceCalendar["summary"] }) {
  const items: { status: AttendanceStatus; value: number }[] = [
    { status: "present", value: summary.present },
    { status: "late", value: summary.late },
    { status: "half_day", value: summary.halfDay },
    { status: "absent", value: summary.absent },
    { status: "on_leave", value: summary.onLeave },
  ];

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Month summary">
      {items.map(({ status, value }) => (
        <li
          key={status}
          className={cn("flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm", STATUS_STYLE[status].cell)}
        >
          <span className={cn("size-2 rounded-full", STATUS_STYLE[status].dot)} />
          {statusLabel(status)}
          <strong className="font-semibold">{value}</strong>
        </li>
      ))}
      {summary.unmarked !== null && (
        <li className="flex items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-sm text-slate-600">
          <span className="size-2 rounded-full bg-slate-300" />
          Not marked
          <strong className="font-semibold">{summary.unmarked}</strong>
        </li>
      )}
    </ul>
  );
}
