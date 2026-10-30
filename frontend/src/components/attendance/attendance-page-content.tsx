"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Toolbar } from "@/components/layout/toolbar";
import { Input } from "@/components/ui/input";
import { QueryState } from "@/components/ui/query-state";
import { useAttendanceSheet } from "@/hooks/use-attendance-sheet";
import { useMarkAttendance } from "@/hooks/use-mark-attendance";
import { todayLocal } from "@/utils/format-duty.util";
import { AttendanceSheet } from "./attendance-sheet";

export function AttendancePageContent() {
  const [date, setDate] = useState(todayLocal);
  const sheet = useAttendanceSheet(date);
  const mark = useMarkAttendance();

  return (
    <>
      <PageHeader
        title="Attendance"
        description="Mark attendance for the staff in your departments. Each change is saved immediately."
      />
      <Toolbar>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          Date
          <Input
            type="date"
            value={date}
            max={todayLocal()}
            onChange={(e) => e.target.value && setDate(e.target.value)}
            className="w-44"
          />
        </label>
      </Toolbar>
      <QueryState isLoading={sheet.isLoading} error={sheet.error}>
        <AttendanceSheet
          entries={sheet.data?.entries ?? []}
          disabled={mark.isPending}
          onMark={(userId, status) => mark.mutate({ userId, date, status })}
        />
      </QueryState>
    </>
  );
}
