"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, Td, Th, THead, Tr } from "@/components/ui/table";
import { SPECIALTY_LABELS } from "@/config/roles.config";
import { useOpenPrescription } from "@/hooks/use-open-prescription";
import type { AppointmentWithPrescriptions } from "@/types/appointment.types";
import { formatDate, formatDateTime } from "@/utils/format-date.util";

/**
 * Patients checked by doctors. Reception gets the prescription PDFs to open;
 * accounts sees that a prescription exists (and the consultation fee) but not its content.
 */
export function CheckedVisitsTable({ visits }: { visits: AppointmentWithPrescriptions[] }) {
  const open = useOpenPrescription();

  if (!visits.length) return <EmptyState message="No checked patients yet." />;

  return (
    <Table>
        <THead>
          <tr>
            <Th>Patient</Th>
            <Th>Doctor</Th>
            <Th>Visit</Th>
            <Th>Checked at</Th>
            <Th>Fee</Th>
            <Th>Prescription</Th>
          </tr>
        </THead>
        <tbody>
          {visits.map((v) => (
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
              <Td>{v.checkedAt ? formatDateTime(v.checkedAt) : "–"}</Td>
              <Td>{v.consultationFee ?? "–"}</Td>
              <Td>
                {v.prescriptionCount === 0 ? (
                  <Badge tone="gray">None</Badge>
                ) : v.prescriptions.length ? (
                  <div className="flex flex-wrap gap-1">
                    {v.prescriptions.map((p) => (
                      <Button
                        key={p.id}
                        variant="secondary"
                        size="sm"
                        disabled={open.isPending}
                        onClick={() => open.mutate(p.id)}
                      >
                        {p.fileName}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <Badge tone="teal">{v.prescriptionCount} attached</Badge>
                )}
              </Td>
            </Tr>
          ))}
        </tbody>
    </Table>
  );
}
