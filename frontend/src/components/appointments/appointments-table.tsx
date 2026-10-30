"use client";

import { CalendarClock, Check, UserRoundCog, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { RowActions, Table, Td, Th, THead, Tr } from "@/components/ui/table";
import { SPECIALTY_LABELS } from "@/config/roles.config";
import { useCancelAppointment } from "@/hooks/use-cancel-appointment";
import { useDialogs } from "@/hooks/use-dialogs";
import { useRejectAppointment } from "@/hooks/use-reject-appointment";
import type { Appointment } from "@/types/appointment.types";
import { formatDate } from "@/utils/format-date.util";
import { AppointmentStatusBadge } from "./appointment-status-badge";

interface AppointmentsTableProps {
  appointments: Appointment[];
  onAssign: (appointment: Appointment) => void;
}

/** Reception queue with assign / re-assign / reject / cancel actions (feedback via toasts). */
export function AppointmentsTable({ appointments, onAssign }: AppointmentsTableProps) {
  const reject = useRejectAppointment();
  const cancel = useCancelAppointment();
  const { confirm, prompt } = useDialogs();
  const busy = reject.isPending || cancel.isPending;

  const onReject = async (a: Appointment) => {
    const note = await prompt({
      title: "Reject appointment request",
      message: `${a.patientName}'s request for ${SPECIALTY_LABELS[a.specialty]} will be rejected.`,
      label: "Reason (optional)",
      placeholder: "e.g. No slots available",
      confirmLabel: "Reject request",
      tone: "danger",
    });
    if (note !== null) reject.mutate({ id: a.id, note: note || undefined });
  };

  const onCancel = async (a: Appointment) => {
    const ok = await confirm({
      title: "Cancel this appointment?",
      message: `${a.patientName} will no longer be booked with Dr. ${a.doctorName}.`,
      confirmLabel: "Cancel appointment",
      cancelLabel: "Keep it",
      tone: "danger",
    });
    if (ok) cancel.mutate(a.id);
  };

  if (!appointments.length) {
    return <EmptyState icon={CalendarClock} title="No appointments" message="Nothing matches this view right now." />;
  }

  return (
    <Table>
      <THead>
        <tr>
          <Th>Patient</Th>
          <Th>Needs</Th>
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
              <p className="font-medium text-slate-900">{a.patientName}</p>
              <p className="text-xs text-slate-500">{a.patientPhone ?? a.patientEmail}</p>
            </Td>
            <Td>
              <p>{SPECIALTY_LABELS[a.specialty]}</p>
              {a.reason && <p className="text-xs text-slate-500">{a.reason}</p>}
            </Td>
            <Td className="whitespace-nowrap">{formatDate(a.date)}</Td>
            <Td>
              {a.doctorName ? (
                <p>Dr. {a.doctorName}</p>
              ) : (
                <p className="text-xs text-slate-500">
                  {a.requestedDoctorName ? `Preferred: Dr. ${a.requestedDoctorName}` : "Not assigned"}
                </p>
              )}
              {a.note && <p className="text-xs text-slate-500">Note: {a.note}</p>}
            </Td>
            <Td>
              <AppointmentStatusBadge status={a.status} />
            </Td>
            <Td className="text-right">
              <RowActions>
                {a.status === "requested" && (
                  <>
                    <Button size="sm" disabled={busy} onClick={() => onAssign(a)}>
                      <Check className="size-3.5" />
                      Assign &amp; approve
                    </Button>
                    <Button size="sm" variant="secondary" disabled={busy} onClick={() => onReject(a)}>
                      <X className="size-3.5" />
                      Reject
                    </Button>
                  </>
                )}
                {a.status === "approved" && (
                  <>
                    <Button size="sm" variant="secondary" disabled={busy} onClick={() => onAssign(a)}>
                      <UserRoundCog className="size-3.5" />
                      Re-assign
                    </Button>
                    <Button size="sm" variant="ghost" disabled={busy} onClick={() => onCancel(a)}>
                      Cancel
                    </Button>
                  </>
                )}
              </RowActions>
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}
