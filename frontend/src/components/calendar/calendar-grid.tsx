import type { CalendarDay } from "@/types/analytics.types";
import { cn } from "@/utils/cn";
import { weekdayName } from "@/utils/calendar.util";
import { effectiveStatus, STATUS_STYLE, statusLabel } from "./calendar-styles";

interface CalendarGridProps {
  days: CalendarDay[];
  today: string;
  selected: string | null;
  onSelect: (date: string) => void;
  compact?: boolean;
}

/** Sunday-first month grid. Each day shows its date, its status and whether it is a duty day. */
export function CalendarGrid({ days, today, selected, onSelect, compact }: CalendarGridProps) {
  const leading = days[0]?.weekday ?? 0;

  return (
    <div>
      <div className="mb-1 grid grid-cols-7 gap-1.5 text-center text-xs font-medium uppercase tracking-wide text-slate-500">
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="py-1">
            {weekdayName(i, "short")}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: leading }, (_, i) => (
          <div key={`blank-${i}`} aria-hidden />
        ))}
        {days.map((d) => {
          const status = effectiveStatus(d);
          const isToday = d.date === today;
          const isFuture = d.date > today;
          const off = d.isWorkDay === false && !status;
          const unmarked = !status && !isFuture && d.isWorkDay === true;

          return (
            <button
              key={d.date}
              onClick={() => onSelect(d.date)}
              aria-label={`${d.date}${status ? `, ${statusLabel(status)}` : ""}`}
              aria-pressed={selected === d.date}
              className={cn(
                "relative flex flex-col items-start justify-between rounded-lg border p-1.5 text-left transition",
                compact ? "h-14 sm:h-16" : "h-[4.5rem] sm:h-24 sm:p-2",
                status
                  ? STATUS_STYLE[status].cell
                  : off
                    ? "border-transparent bg-slate-100/70 text-slate-400"
                    : unmarked
                      ? "border-dashed border-slate-300 text-slate-500"
                      : "border-slate-200 text-slate-500",
                isFuture && !status && "opacity-60",
                "hover:border-brand-400",
                isToday && "ring-2 ring-brand-500 shadow-[0_0_16px_-3px_var(--glow)]",
                selected === d.date && "outline-2 outline-offset-1 outline-brand-400",
              )}
            >
              <span className={cn("text-sm font-semibold", isToday && "text-brand-ink")}>{new Date(`${d.date}T00:00:00`).getDate()}</span>
              <span className="w-full truncate text-[10px] font-medium leading-tight sm:text-xs">
                {status ? statusLabel(status) : off ? "Off" : unmarked ? "Not marked" : ""}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
