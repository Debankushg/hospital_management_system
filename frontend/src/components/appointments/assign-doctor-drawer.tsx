"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { QueryState } from "@/components/ui/query-state";
import { SPECIALTY_LABELS } from "@/config/roles.config";
import { useApproveAppointment } from "@/hooks/use-approve-appointment";
import { usePatient } from "@/hooks/use-patient";
import type { Appointment } from "@/types/appointment.types";
import { formatDate } from "@/utils/format-date.util";
import { getErrorMessage } from "@/utils/get-error-message.util";
import { DoctorAvailabilityList } from "./doctor-availability-list";
import { PatientSummary } from "./patient-summary";

interface AssignDoctorDrawerProps {
  appointment: Appointment;
  onClose: () => void;
}

/** Review the patient's details and request, pick an available doctor, then approve. */
export function AssignDoctorDrawer({ appointment, onClose }: AssignDoctorDrawerProps) {
  const patient = usePatient(appointment.patientId);
  const approve = useApproveAppointment();
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const reassigning = appointment.status === "approved";

  return (
    <Drawer
      size="lg"
      title={reassigning ? "Re-assign doctor" : "Assign doctor & approve"}
      description={`${appointment.patientName} · ${SPECIALTY_LABELS[appointment.specialty]} on ${formatDate(appointment.date)}`}
      onClose={onClose}
      footer={
        <div className="space-y-3">
          {approve.isError && <Alert tone="error">{getErrorMessage(approve.error)}</Alert>}
          <Button
            className="w-full"
            disabled={!doctorId}
            loading={approve.isPending}
            onClick={() =>
              doctorId &&
              approve.mutate({ id: appointment.id, doctorId, note: note.trim() || undefined }, { onSuccess: onClose })
            }
          >
            <CheckCircle2 className="size-4" />
            Approve details &amp; assign doctor
          </Button>
        </div>
      }
    >
      <div className="space-y-7">
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">1. Verify patient details</h3>
          <QueryState isLoading={patient.isLoading} error={patient.error} rows={2}>
            {patient.data && <PatientSummary patient={patient.data.patient} />}
          </QueryState>
        </section>

        <section className="space-y-2 rounded-lg bg-slate-50 p-3.5 text-sm">
          <p>
            <span className="text-slate-500">Needs:</span>{" "}
            <strong>{SPECIALTY_LABELS[appointment.specialty]}</strong> on <strong>{formatDate(appointment.date)}</strong>
          </p>
          {appointment.reason && (
            <p>
              <span className="text-slate-500">Reason:</span> {appointment.reason}
            </p>
          )}
          {appointment.doctorName && (
            <p>
              <span className="text-slate-500">Currently assigned:</span> Dr. {appointment.doctorName}
            </p>
          )}
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">2. Choose an available doctor</h3>
          <DoctorAvailabilityList
            specialty={appointment.specialty}
            date={appointment.date}
            selectedId={doctorId}
            preferredId={appointment.requestedDoctorId}
            onSelect={setDoctorId}
          />
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-900">3. Add a note (optional)</h3>
          <Input
            placeholder="Shown to the patient and kept in the records"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </section>
      </div>
    </Drawer>
  );
}
