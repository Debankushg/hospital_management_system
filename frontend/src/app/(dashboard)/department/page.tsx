import type { Metadata } from "next";
import { RoleGuard } from "@/components/auth/role-guard";
import { DepartmentPageContent } from "@/components/department/department-page-content";

export const metadata: Metadata = { title: "My department" };

export default function DepartmentPage() {
  return (
    <RoleGuard roles={["super_admin", "admin"]}>
      <DepartmentPageContent />
    </RoleGuard>
  );
}
