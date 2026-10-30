import type { Metadata } from "next";
import { RoleGuard } from "@/components/auth/role-guard";
import { UsersPageContent } from "@/components/users/users-page-content";

export const metadata: Metadata = { title: "Users" };

export default function UsersPage() {
  return (
    <RoleGuard roles={["super_admin", "admin"]}>
      <UsersPageContent />
    </RoleGuard>
  );
}
