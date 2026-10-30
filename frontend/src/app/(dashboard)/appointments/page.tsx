import type { Metadata } from "next";
import { AppointmentsPageContent } from "@/components/appointments/appointments-page-content";
import { RoleGuard } from "@/components/auth/role-guard";

export const metadata: Metadata = { title: "Appointments" };

export default function AppointmentsPage() {
  return (
    <RoleGuard roles={["receptionist", "super_admin"]} capability="reception">
      <AppointmentsPageContent />
    </RoleGuard>
  );
}
