import type { Metadata } from "next";
import { RoleGuard } from "@/components/auth/role-guard";
import { CheckedVisitsPageContent } from "@/components/checked-visits/checked-visits-page-content";

export const metadata: Metadata = { title: "Checked patients" };

export default function CheckedPatientsPage() {
  return (
    <RoleGuard capability="viewChecked">
      <CheckedVisitsPageContent />
    </RoleGuard>
  );
}
