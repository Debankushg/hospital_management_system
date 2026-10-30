import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SPECIALTY_LABELS } from "@/config/roles.config";
import type { Doctor } from "@/types/user.types";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <Card className="flex items-center gap-4 p-5 transition hover:border-brand-300 hover:shadow-pop">
      <Avatar name={doctor.fullName} className="size-12 text-sm" />
      <div className="min-w-0 space-y-1.5">
        <p className="truncate text-base font-semibold text-slate-900">Dr. {doctor.fullName}</p>
        <Badge tone="teal">{SPECIALTY_LABELS[doctor.specialty]}</Badge>
        {doctor.consultationFee && <p className="text-sm text-slate-500">Consultation fee: {doctor.consultationFee}</p>}
      </div>
    </Card>
  );
}
