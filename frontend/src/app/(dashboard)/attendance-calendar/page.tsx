import type { Metadata } from "next";
import { RoleGuard } from "@/components/auth/role-guard";
import { AttendanceCalendarPageContent } from "@/components/calendar/attendance-calendar-page-content";

export const metadata: Metadata = { title: "Attendance calendar" };

export default function AttendanceCalendarPage() {
  return (
    <RoleGuard roles={["super_admin", "admin", "doctor", "receptionist", "pathologist", "accounts"]}>
      <AttendanceCalendarPageContent />
    </RoleGuard>
  );
}
