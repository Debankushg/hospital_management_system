"use client";

import { CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { RowActions, Table, Td, Th, THead, Tr } from "@/components/ui/table";
import { PrescriptionList } from "@/components/consultation/prescription-list";
import { SPECIALTY_LABELS } from "@/config/roles.config";
import { useCancelAppointment } from "@/hooks/use-cancel-appointment";
import { useDialogs } from "@/hooks/use-dialogs";
import type { AppointmentWithPrescriptions } from "@/types/appointment.types";
import { formatDate } from "@/utils/format-date.util";
import { AppointmentStatusBadge } from "./appointment-status-badge";

export function MyAppointmentsTable({ appointments }: { appointments: AppointmentWithPrescriptions[] }) {
  const cancel = useCancelAppointment();
  const { confirm } = useDialogs();

  const onCancel = async (a: AppointmentWithPrescriptions) => {
    const ok = await confirm({
      title: "Cancel this appointment?",
      message: `${SPECIALTY_LABELS[a.specialty]} on ${formatDate(a.date)} will be cancelled.`,
      confirmLabel: "Cancel appointment",
      cancelLabel: "Keep it",
      tone: "danger",
    });
    if (ok) cancel.mutate(a.id);
  };

  if (!appointments.length) {
    return <EmptyState icon={CalendarClock} title="No appointments yet" message="Book an appointment and reception will assign a doctor." />;
  }

  return (
    <Table>
      <THead>
        <tr>
          <Th>Treatment</Th>
          <Th>Date</Th>
          <Th>Doctor</Th>
          <Th>Status</Th>
          <Th />
        </tr>
      </THead>
      <tbody>
        {appointments.map((a) => (
          <Tr key={a.id}>
            <Td>
              <p className="font-medium text-slate-900">{SPECIALTY_LABELS[a.specialty]}</p>
              {a.reason && <p className="text-xs text-slate-500">{a.reason}</p>}
            </Td>
            <Td className="whitespace-nowrap">{formatDate(a.date)}</Td>
            <Td>{a.doctorName ? `Dr. ${a.doctorName}` : <span className="text-slate-400">Waiting for assignment</span>}</Td>
            <Td>
              <AppointmentStatusBadge status={a.status} />
              {a.note && <p className="mt-1 text-xs text-slate-500">{a.note}</p>}
              {a.prescriptions.length > 0 && (
                <div className="mt-2 min-w-64">
                  <PrescriptionList prescriptions={a.prescriptions} />
                </div>
              )}
            </Td>
            <Td className="text-right">
              <RowActions>
                {(a.status === "requested" || a.status === "approved") && (
                  <Button variant="secondary" size="sm" disabled={cancel.isPending} onClick={() => onCancel(a)}>
                    Cancel
                  </Button>
                )}
              </RowActions>
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}
