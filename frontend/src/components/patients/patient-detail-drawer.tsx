"use client";

import { CalendarPlus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { AppointmentStatusBadge } from "@/components/appointments/appointment-status-badge";
import { BookAppointmentForm } from "@/components/appointments/book-appointment-form";
import { PatientSummary } from "@/components/appointments/patient-summary";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { QueryState } from "@/components/ui/query-state";
import { SPECIALTY_LABELS } from "@/config/roles.config";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useDeletePatient } from "@/hooks/use-delete-patient";
import { useDialogs } from "@/hooks/use-dialogs";
import { usePatient } from "@/hooks/use-patient";
import { formatDate } from "@/utils/format-date.util";
import { PatientEditForm } from "./patient-edit-form";

type Mode = "view" | "edit" | "book";

const TITLES: Record<Mode, string> = { view: "Patient details", edit: "Edit patient", book: "Book appointment" };

interface PatientDetailDrawerProps {
  patientId: string;
  onClose: () => void;
}

/** Patient details, appointment history, edit (all reception staff) and delete (reception admin only). */
export function PatientDetailDrawer({ patientId, onClose }: PatientDetailDrawerProps) {
  const detail = usePatient(patientId);
  const remove = useDeletePatient();
  const caps = useCurrentUser()?.capabilities;
  const { confirm } = useDialogs();
  const [mode, setMode] = useState<Mode>("view");
  const patient = detail.data?.patient;

  const onDelete = async () => {
    if (!patient) return;
    const ok = await confirm({
      title: `Delete ${patient.fullName}?`,
      message: "Their details and appointments will be removed permanently. This cannot be undone.",
      confirmLabel: "Delete patient",
      tone: "danger",
    });
    if (ok) remove.mutate(patientId, { onSuccess: onClose });
  };

  const footer =
    mode === "view" && patient ? (
      <div className="flex flex-wrap gap-2">
        <Button className="flex-1" onClick={() => setMode("book")}>
          <CalendarPlus className="size-4" />
          Book appointment
        </Button>
        {caps?.editPatients && (
          <Button variant="secondary" onClick={() => setMode("edit")}>
            <Pencil className="size-4" />
            Edit
          </Button>
        )}
        {caps?.deletePatients && (
          <Button variant="dangerSoft" loading={remove.isPending} onClick={onDelete}>
            <Trash2 className="size-4" />
            Delete
          </Button>
        )}
      </div>
    ) : undefined;

  return (
    <Drawer title={TITLES[mode]} description={patient?.fullName} onClose={onClose} footer={footer}>
      <QueryState isLoading={detail.isLoading} error={detail.error}>
        {detail.data && mode === "edit" && <PatientEditForm patient={detail.data.patient} onDone={() => setMode("view")} />}

        {detail.data && mode === "book" && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Booking for <strong>{detail.data.patient.fullName}</strong>. Assign the doctor afterwards from the Appointments queue.
            </p>
            <BookAppointmentForm patientId={patientId} onDone={() => setMode("view")} />
          </div>
        )}

        {detail.data && mode === "view" && (
          <div className="space-y-6">
            <PatientSummary patient={detail.data.patient} />
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">Appointments</h3>
              {detail.data.appointments.length ? (
                <ul className="divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200 text-sm">
                  {detail.data.appointments.map((a) => (
                    <li key={a.id} className="flex items-center justify-between gap-3 p-3">
                      <div>
                        <p className="font-medium text-slate-900">
                          {SPECIALTY_LABELS[a.specialty]} · {formatDate(a.date)}
                        </p>
                        <p className="text-xs text-slate-500">{a.doctorName ? `Dr. ${a.doctorName}` : "Not assigned"}</p>
                      </div>
                      <AppointmentStatusBadge status={a.status} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500">No appointments yet.</p>
              )}
            </section>
          </div>
        )}
      </QueryState>
    </Drawer>
  );
}
