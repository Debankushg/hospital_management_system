import { AppointmentStatusBadge } from "@/components/appointments/appointment-status-badge";
import { SPECIALTY_LABELS } from "@/config/roles.config";
import type { AppointmentWithPrescriptions } from "@/types/appointment.types";
import { formatDate } from "@/utils/format-date.util";
import { PrescriptionList } from "./prescription-list";

/** The patient's other visits with their prescriptions (clinical history). */
export function VisitHistory({ visits }: { visits: AppointmentWithPrescriptions[] }) {
  if (!visits.length) return <p className="text-sm text-slate-500">No earlier visits.</p>;

  return (
    <ul className="space-y-3">
      {visits.map((v) => (
        <li key={v.id} className="space-y-2 rounded-lg border border-slate-200 p-3 text-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium">
                {SPECIALTY_LABELS[v.specialty]} · {formatDate(v.date)}
              </p>
              <p className="text-xs text-slate-500">
                {v.doctorName ? `Dr. ${v.doctorName}` : "–"}
                {v.reason && ` · ${v.reason}`}
              </p>
            </div>
            <AppointmentStatusBadge status={v.status} />
          </div>
          {v.prescriptions.length > 0 && <PrescriptionList prescriptions={v.prescriptions} />}
        </li>
      ))}
    </ul>
  );
}
