import type { Metadata } from "next";
import { RoleGuard } from "@/components/auth/role-guard";
import { LeavesPageContent } from "@/components/leaves/leaves-page-content";

export const metadata: Metadata = { title: "Leave" };

export default function LeavesPage() {
  return (
    <RoleGuard roles={["super_admin", "admin"]}>
      <LeavesPageContent />
    </RoleGuard>
  );
}
