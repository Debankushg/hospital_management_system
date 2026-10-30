"use client";

import { ArrowRight, CalendarDays } from "lucide-react";
import Link from "next/link";
import { AttendanceCalendar } from "@/components/calendar/attendance-calendar";
import { ROUTES } from "@/config/routes.config";

/** The signed-in staff member's own attendance calendar, right on the dashboard. */
export function MyAttendanceCard() {
  return (
    <section className="rounded-xl border border-slate-200 bg-surface p-5 shadow-card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-ink shadow-[0_0_18px_-6px_var(--glow)] ring-1 ring-brand-200">
            <CalendarDays className="size-5" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-slate-900">My attendance</h2>
            <p className="text-sm text-slate-500">Date, day and month at a glance</p>
          </div>
        </div>
        <Link href={ROUTES.attendanceCalendar} className="inline-flex items-center gap-1 text-sm font-medium text-brand-ink hover:underline">
          Open full calendar
          <ArrowRight className="size-4" />
        </Link>
      </div>
      <AttendanceCalendar compact />
    </section>
  );
}
