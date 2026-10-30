import type { Metadata } from "next";
import { RoleGuard } from "@/components/auth/role-guard";
import { PatientsPageContent } from "@/components/patients/patients-page-content";

export const metadata: Metadata = { title: "Patients" };

export default function PatientsPage() {
  return (
    <RoleGuard roles={["receptionist", "super_admin"]} capability="reception">
      <PatientsPageContent />
    </RoleGuard>
  );
}
