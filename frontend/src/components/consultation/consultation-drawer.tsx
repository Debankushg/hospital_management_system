"use client";

import { CheckCircle2, ClipboardCheck } from "lucide-react";
import type { ReactNode } from "react";
import { AppointmentStatusBadge } from "@/components/appointments/appointment-status-badge";
import { PatientSummary } from "@/components/appointments/patient-summary";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { QueryState } from "@/components/ui/query-state";
import { SPECIALTY_LABELS } from "@/config/roles.config";
import { useCheckPatient } from "@/hooks/use-check-patient";
import { useDialogs } from "@/hooks/use-dialogs";
import { useDoctorAppointment } from "@/hooks/use-doctor-appointment";
import { formatDate, formatDateTime } from "@/utils/format-date.util";
import { PrescriptionList } from "./prescription-list";
import { PrescriptionUpload } from "./prescription-upload";
import { VisitHistory } from "./visit-history";

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="space-y-3">
    <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
    {children}
  </section>
);

/** Everything a doctor needs for one assigned patient: details, history, prescriptions and the check button. */
export function ConsultationDrawer({ appointmentId, onClose }: { appointmentId: string; onClose: () => void }) {
  const detail = useDoctorAppointment(appointmentId);
  const check = useCheckPatient();
  const { confirm } = useDialogs();
  const appt = detail.data?.appointment;

  const onCheck = async () => {
    const ok = await confirm({
      title: "Mark patient as checked?",
      message: "The visit will be shared with reception and accounts. This cannot be undone.",
      confirmLabel: "Mark as checked",
    });
    if (ok) check.mutate(appointmentId, { onSuccess: () => detail.refetch() });
  };

  const footer = appt ? (
    appt.status === "checked" ? (
      <p className="flex items-center gap-2 text-sm font-medium text-emerald-700">
        <CheckCircle2 className="size-5" />
        Checked{appt.checkedAt && ` on ${formatDateTime(appt.checkedAt)}`}. Visible to reception and accounts.
      </p>
    ) : (
      <Button className="w-full" loading={check.isPending} onClick={onCheck}>
        <ClipboardCheck className="size-4" />
        Mark patient as checked
      </Button>
    )
  ) : undefined;

  return (
    <Drawer
      size="lg"
      title={detail.data?.patient.fullName ?? "Patient"}
      description={appt ? `${SPECIALTY_LABELS[appt.specialty]} · ${formatDate(appt.date)}` : undefined}
      onClose={onClose}
      footer={footer}
    >
      <QueryState isLoading={detail.isLoading} error={detail.error}>
        {detail.data && appt && (
          <div className="space-y-7">
            <Section title="Patient details">
              <PatientSummary patient={detail.data.patient} />
            </Section>

            <Section title="This visit">
              <div className="flex items-start justify-between gap-3 rounded-lg bg-slate-50 p-3.5 text-sm">
                <div className="space-y-1">
                  <p className="font-medium text-slate-900">
                    {SPECIALTY_LABELS[appt.specialty]} · {formatDate(appt.date)}
                  </p>
                  {appt.reason ? <p className="text-slate-600">{appt.reason}</p> : <p className="text-slate-400">No reason given</p>}
                  {appt.note && <p className="text-xs text-slate-500">Reception note: {appt.note}</p>}
                </div>
                <AppointmentStatusBadge status={appt.status} />
              </div>
            </Section>

            <Section title="Prescription">
              <PrescriptionList prescriptions={appt.prescriptions} allowDelete />
              <PrescriptionUpload appointmentId={appointmentId} onUploaded={() => detail.refetch()} />
            </Section>

            <Section title="Previous visits & records">
              <VisitHistory visits={detail.data.history} />
            </Section>

            {appt.status !== "checked" && (
              <Alert tone="info">Use “Mark patient as checked” below once the consultation is complete.</Alert>
            )}
          </div>
        )}
      </QueryState>
    </Drawer>
  );
}
