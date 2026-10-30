import type { Metadata } from "next";
import { AdminsPageContent } from "@/components/admins/admins-page-content";
import { RoleGuard } from "@/components/auth/role-guard";

export const metadata: Metadata = { title: "Admins" };

export default function AdminsPage() {
  return (
    <RoleGuard roles={["super_admin"]}>
      <AdminsPageContent />
    </RoleGuard>
  );
}
