"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs } from "@/components/ui/tabs";
import { useAttendanceCalendar } from "@/hooks/use-attendance-calendar";
import { currentMonth, monthTitle, shiftMonth } from "@/utils/calendar.util";
import { todayLocal } from "@/utils/format-duty.util";
import { getErrorMessage } from "@/utils/get-error-message.util";
import { CalendarDayDetail } from "./calendar-day-detail";
import { CalendarGrid } from "./calendar-grid";
import { CalendarList } from "./calendar-list";
import { CalendarSummary } from "./calendar-summary";

type View = "calendar" | "list";

interface AttendanceCalendarProps {
  /** A staff member's id (managers). Omit for the signed-in user's own calendar. */
  userId?: string;
  /** Smaller cells for the dashboard. */
  compact?: boolean;
}

/** Month calendar of attendance with month navigation, a day-by-day list, a summary and day details. */
export function AttendanceCalendar({ userId, compact }: AttendanceCalendarProps) {
  const today = todayLocal();
  const [month, setMonth] = useState(currentMonth);
  const [view, setView] = useState<View>("calendar");
  const [selected, setSelected] = useState<string | null>(today);
  const { data, isLoading, error } = useAttendanceCalendar(month, userId);

  const goTo = (m: string) => {
    setMonth(m);
    setSelected(m === currentMonth() ? today : null);
  };
  const day = data?.days.find((d) => d.date === selected) ?? null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" size="sm" aria-label="Previous month" onClick={() => goTo(shiftMonth(month, -1))}>
          <ChevronLeft className="size-4" />
        </Button>
        <h3 className="min-w-40 text-center text-base font-semibold text-slate-900 sm:text-lg">{monthTitle(month)}</h3>
        <Button variant="secondary" size="sm" aria-label="Next month" onClick={() => goTo(shiftMonth(month, 1))}>
          <ChevronRight className="size-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => goTo(currentMonth())} disabled={month === currentMonth()}>
          Today
        </Button>
        <Input
          type="month"
          value={month}
          onChange={(e) => e.target.value && goTo(e.target.value)}
          className="h-8 w-40 text-xs"
          aria-label="Jump to month"
        />
        <div className="ml-auto">
          <Tabs
            options={[
              { value: "calendar", label: "Calendar" },
              { value: "list", label: "Day list" },
            ]}
            value={view}
            onChange={setView}
          />
        </div>
      </div>

      {error ? (
        <Alert tone="error">{getErrorMessage(error)}</Alert>
      ) : isLoading || !data ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <>
          <CalendarSummary summary={data.summary} />
          {view === "calendar" ? (
            <div className={compact ? "space-y-4" : "grid gap-6 lg:grid-cols-[1fr_20rem]"}>
              <CalendarGrid days={data.days} today={today} selected={selected} onSelect={setSelected} compact={compact} />
              <CalendarDayDetail day={day} duty={data.duty} />
            </div>
          ) : (
            <CalendarList days={data.days} duty={data.duty} today={today} />
          )}
        </>
      )}
    </div>
  );
}
