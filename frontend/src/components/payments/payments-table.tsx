"use client";

import { CreditCard, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, Td, Th, THead, Tr } from "@/components/ui/table";
import { SPECIALTY_LABELS } from "@/config/roles.config";
import { useDialogs } from "@/hooks/use-dialogs";
import { useStartCheckout } from "@/hooks/use-start-checkout";
import { useSyncPayment } from "@/hooks/use-sync-payment";
import type { Receivable } from "@/types/payment.types";
import { formatDate, formatDateTime } from "@/utils/format-date.util";
import { formatMoney } from "@/utils/format-money.util";

const STATUS = {
  paid: { tone: "green", label: "Paid" },
  pending: { tone: "amber", label: "Payment started" },
  unpaid: { tone: "red", label: "Unpaid" },
} as const;

export function PaymentsTable({ visits }: { visits: Receivable[] }) {
  const { confirm } = useDialogs();
  const checkout = useStartCheckout();
  const sync = useSyncPayment();

  if (!visits.length) return <EmptyState message="No visits to show here." />;

  const takePayment = async (v: Receivable) => {
    const ok = await confirm({
      title: "Take payment",
      message: (
        <>
          Collect <strong>{formatMoney(v.consultationFee, v.currency)}</strong> from <strong>{v.patientName}</strong>?
          You will be taken to Stripe&apos;s secure page where the card is entered.
        </>
      ),
      confirmLabel: "Continue to Stripe",
    });
    if (ok) checkout.mutate(v.id);
  };

  return (
    <Table>
      <THead>
        <tr>
          <Th>Patient</Th>
          <Th>Doctor</Th>
          <Th>Visit</Th>
          <Th>Amount</Th>
          <Th>Status</Th>
          <Th>
            <span className="sr-only">Action</span>
          </Th>
        </tr>
      </THead>
      <tbody>
        {visits.map((v) => {
          const status = STATUS[v.paymentStatus];
          const noFee = !v.consultationFee || Number(v.consultationFee) <= 0;
          return (
            <Tr key={v.id}>
              <Td>
                <p className="font-medium">{v.patientName}</p>
                <p className="text-xs text-slate-500">{v.patientPhone ?? v.patientEmail}</p>
              </Td>
              <Td>
                <p>Dr. {v.doctorName}</p>
                <p className="text-xs text-slate-500">{SPECIALTY_LABELS[v.specialty]}</p>
              </Td>
              <Td>{formatDate(v.date)}</Td>
              <Td className="font-medium">{formatMoney(v.consultationFee, v.currency)}</Td>
              <Td>
                <Badge tone={status.tone}>{status.label}</Badge>
                {v.payment?.paidAt && <p className="mt-1 text-xs text-slate-500">{formatDateTime(v.payment.paidAt)}</p>}
              </Td>
              <Td className="text-right">
                {v.paymentStatus === "paid" ? null : (
                  <div className="flex justify-end gap-2">
                    {v.payment && (
                      <Button
                        variant="secondary"
                        size="sm"
                        loading={sync.isPending && sync.variables === v.payment.sessionId}
                        onClick={() => sync.mutate(v.payment!.sessionId)}
                      >
                        <RefreshCw className="size-3.5" /> Refresh
                      </Button>
                    )}
                    <Button
                      size="sm"
                      disabled={noFee}
                      title={noFee ? "No consultation fee set for this doctor" : undefined}
                      loading={checkout.isPending && checkout.variables === v.id}
                      onClick={() => takePayment(v)}
                    >
                      <CreditCard className="size-3.5" /> {v.payment ? "Resume payment" : "Take payment"}
                    </Button>
                  </div>
                )}
              </Td>
            </Tr>
          );
        })}
      </tbody>
    </Table>
  );
}
