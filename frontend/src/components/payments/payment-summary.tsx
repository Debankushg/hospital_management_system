"use client";

import { CircleCheck, Hourglass } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { usePaymentSummary } from "@/hooks/use-payment-summary";
import { formatMoney } from "@/utils/format-money.util";

/** Collected vs outstanding, so accounts sees at a glance what is still owed. */
export function PaymentSummary() {
  const { data } = usePaymentSummary();
  if (!data) return null;
  return (
    <div className="mb-5 grid gap-4 sm:grid-cols-2">
      <StatCard
        label={`Collected · ${data.paidCount} ${data.paidCount === 1 ? "payment" : "payments"}`}
        value={formatMoney(data.collected, data.currency)}
        icon={CircleCheck}
      />
      <StatCard
        label={`Outstanding · ${data.unpaidCount} ${data.unpaidCount === 1 ? "visit" : "visits"}`}
        value={formatMoney(data.outstanding, data.currency)}
        icon={Hourglass}
      />
    </div>
  );
}
