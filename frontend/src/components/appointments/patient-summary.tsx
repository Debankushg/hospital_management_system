import { Avatar } from "@/components/ui/avatar";
import type { Patient } from "@/types/patient.types";
import { ageFromDob } from "@/utils/age.util";

/** Read-only patient details: what reception verifies before approving and what doctors see. */
export function PatientSummary({ patient }: { patient: Patient }) {
  const age = ageFromDob(patient.dateOfBirth);
  const rows: [string, string][] = [
    ["Phone", patient.phone ?? "–"],
    ["Gender", patient.gender ? patient.gender[0]!.toUpperCase() + patient.gender.slice(1) : "–"],
    ["Date of birth", patient.dateOfBirth ? `${patient.dateOfBirth}${age !== null ? ` (${age} yrs)` : ""}` : "–"],
    ["Blood group", patient.bloodGroup ?? "–"],
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-surface">
      <div className="flex items-center gap-3 border-b border-slate-100 p-4">
        <Avatar name={patient.fullName} className="size-11 text-sm" />
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900">{patient.fullName}</p>
          <p className="truncate text-sm text-slate-500">{patient.email}</p>
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 p-4 text-sm">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="text-xs text-slate-500">{k}</dt>
            <dd className="font-medium text-slate-900">{v}</dd>
          </div>
        ))}
        <div className="col-span-2">
          <dt className="text-xs text-slate-500">Address</dt>
          <dd className="font-medium text-slate-900">{patient.address ?? "–"}</dd>
        </div>
      </dl>
    </div>
  );
}
