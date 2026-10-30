import type { Metadata } from "next";
import { RoleGuard } from "@/components/auth/role-guard";
import { MyLeavePageContent } from "@/components/my-leave/my-leave-page-content";

export const metadata: Metadata = { title: "My leave" };

export default function MyLeavePage() {
  return (
    <RoleGuard roles={["admin", "doctor", "receptionist", "pathologist", "accounts"]}>
      <MyLeavePageContent />
    </RoleGuard>
  );
}
