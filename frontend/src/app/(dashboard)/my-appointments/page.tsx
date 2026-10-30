import type { Metadata } from "next";
import { MyAppointmentsPageContent } from "@/components/appointments/my-appointments-page-content";
import { RoleGuard } from "@/components/auth/role-guard";

export const metadata: Metadata = { title: "My appointments" };

export default function MyAppointmentsPage() {
  return (
    <RoleGuard roles={["patient"]}>
      <MyAppointmentsPageContent />
    </RoleGuard>
  );
}
