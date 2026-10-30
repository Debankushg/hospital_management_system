import { AppointmentStatusBadge } from "@/components/appointments/appointment-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { RowActions, THead, Table, Td, Th, Tr } from "@/components/ui/table";
import { SPECIALTY_LABELS } from "@/config/roles.config";
import type { AppointmentWithPrescriptions } from "@/types/appointment.types";
import { formatDate } from "@/utils/format-date.util";

interface DoctorPatientsTableProps {
  appointments: AppointmentWithPrescriptions[];
  onOpen: (appointment: AppointmentWithPrescriptions) => void;
}

export function DoctorPatientsTable({ appointments, onOpen }: DoctorPatientsTableProps) {
  if (!appointments.length) return <EmptyState message="No patients assigned to you here." />;

  return (
    <Table>
      <THead>
        <tr>
          <Th>Patient</Th>
          <Th>Needs</Th>
          <Th>Date</Th>
          <Th>Prescription</Th>
          <Th>Status</Th>
          <Th />
        </tr>
      </THead>
      <tbody>
        {appointments.map((a) => (
          <Tr key={a.id}>
            <Td>
              <p className="font-medium">{a.patientName}</p>
              <p className="text-xs text-slate-500">{a.patientPhone ?? a.patientEmail}</p>
            </Td>
            <Td>
              <p>{SPECIALTY_LABELS[a.specialty]}</p>
              {a.reason && <p className="text-xs text-slate-500">{a.reason}</p>}
            </Td>
            <Td>{formatDate(a.date)}</Td>
            <Td>{a.prescriptionCount ? <Badge tone="teal">{a.prescriptionCount} attached</Badge> : <span className="text-xs text-slate-400">None</span>}</Td>
            <Td>
              <AppointmentStatusBadge status={a.status} />
            </Td>
            <Td className="text-right">
<RowActions>
              <Button size="sm" variant={a.status === "checked" ? "secondary" : "primary"} onClick={() => onOpen(a)}>
                {a.status === "checked" ? "View" : "See patient"}
              </Button>
            </RowActions>
</Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}
