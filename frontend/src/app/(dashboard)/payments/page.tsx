import type { Metadata } from "next";
import { RoleGuard } from "@/components/auth/role-guard";
import { PaymentsPageContent } from "@/components/payments/payments-page-content";

export const metadata: Metadata = { title: "Payments" };

export default function PaymentsPage() {
  return (
    <RoleGuard capability="payments">
      <PaymentsPageContent />
    </RoleGuard>
  );
}
