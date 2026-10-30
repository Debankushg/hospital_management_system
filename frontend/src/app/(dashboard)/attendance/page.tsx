import type { Metadata } from "next";
import { AttendancePageContent } from "@/components/attendance/attendance-page-content";
import { RoleGuard } from "@/components/auth/role-guard";

export const metadata: Metadata = { title: "Attendance" };

export default function AttendancePage() {
  return (
    <RoleGuard roles={["super_admin", "admin"]}>
      <AttendancePageContent />
    </RoleGuard>
  );
}
