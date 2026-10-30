import type { Metadata } from "next";
import { RoleGuard } from "@/components/auth/role-guard";
import { DoctorPatientsPageContent } from "@/components/consultation/doctor-patients-page-content";

export const metadata: Metadata = { title: "My patients" };

export default function MyPatientsPage() {
  return (
    <RoleGuard capability="doctor">
      <DoctorPatientsPageContent />
    </RoleGuard>
  );
}
