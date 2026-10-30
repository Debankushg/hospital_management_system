"use client";

import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { QueryState } from "@/components/ui/query-state";
import { UNAVAILABLE_REASON_LABELS } from "@/config/appointment.config";
import { useDoctorAvailability } from "@/hooks/use-doctor-availability";
import type { Specialty } from "@/types/role.types";
import { cn } from "@/utils/cn";
import { formatDuty } from "@/utils/format-duty.util";

interface DoctorAvailabilityListProps {
  specialty: Specialty;
  date: string;
  selectedId: string | null;
  preferredId: string | null;
  onSelect: (doctorId: string) => void;
}

/** Doctors that match the patient's requirement. Unavailable ones are shown but cannot be chosen. */
export function DoctorAvailabilityList({ specialty, date, selectedId, preferredId, onSelect }: DoctorAvailabilityListProps) {
  const doctors = useDoctorAvailability(specialty, date);

  return (
    <QueryState isLoading={doctors.isLoading} error={doctors.error}>
      {doctors.data?.length ? (
        <ul className="space-y-2">
          {doctors.data.map((d) => (
            <li key={d.id}>
              <label
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm",
                  selectedId === d.id ? "border-brand-600 bg-brand-50" : "border-slate-200",
                  !d.available && "cursor-not-allowed bg-slate-50 opacity-70",
                )}
              >
                <input
                  type="radio"
                  name="doctor"
                  className="mt-1"
                  disabled={!d.available}
                  checked={selectedId === d.id}
                  onChange={() => onSelect(d.id)}
                />
                <div className="flex-1">
                  <p className="font-medium">
                    Dr. {d.fullName} {d.id === preferredId && <span className="text-xs text-brand-ink">(patient's preference)</span>}
                  </p>
                  <p className="text-xs text-slate-500">
                    Duty: {formatDuty(d.duty)} · {d.appointmentsThatDay} appointment(s) that day
                    {d.consultationFee && ` · Fee ${d.consultationFee}`}
                  </p>
                </div>
                {d.available ? (
                  <Badge tone="green">Available</Badge>
                ) : (
                  <Badge tone="red">{UNAVAILABLE_REASON_LABELS[d.reason!]}</Badge>
                )}
              </label>
            </li>
          ))}
        </ul>
      ) : (
        <Alert tone="info">No active doctors found for this specialty.</Alert>
      )}
    </QueryState>
  );
}
