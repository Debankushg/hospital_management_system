"use client";

import { CalendarDays } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Toolbar } from "@/components/layout/toolbar";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { ROLE_LABELS } from "@/config/roles.config";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useStaff } from "@/hooks/use-staff";
import { AttendanceCalendar } from "./attendance-calendar";

/** Attendance calendar page. Managers can switch between the staff they manage. */
export function AttendanceCalendarPageContent() {
  const user = useCurrentUser();
  const isManager = user?.role === "admin" || user?.role === "super_admin";
  const staff = useStaff(isManager);
  const [userId, setUserId] = useState("");

  if (!user) return null;
  const selfIsStaff = user.role !== "super_admin";
  const viewing = userId || (selfIsStaff ? "" : null);

  return (
    <>
      <PageHeader
        title="Attendance calendar"
        description={
          isManager
            ? "See attendance by month, day and date for yourself or any staff member you manage."
            : "Your attendance by month, day and date, with your duty hours and approved leave."
        }
      />
      {isManager && (
        <Toolbar>
          <Select value={userId} onChange={(e) => setUserId(e.target.value)} className="w-72" aria-label="Staff member">
            <option value="">{selfIsStaff ? "My calendar" : "Choose a staff member…"}</option>
            {(staff.data ?? []).map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName} – {ROLE_LABELS[s.role]}
              </option>
            ))}
          </Select>
        </Toolbar>
      )}
      {viewing === null ? (
        <EmptyState icon={CalendarDays} title="Choose a staff member" message="Pick someone above to see their attendance calendar." />
      ) : (
        <Card>
          <AttendanceCalendar key={userId} userId={userId || undefined} />
        </Card>
      )}
    </>
  );
}
