import { Badge } from "@/components/ui/badge";
import { APPOINTMENT_STATUS_LABELS } from "@/config/appointment.config";
import type { AppointmentStatus } from "@/types/appointment.types";

const TONES = { requested: "amber", approved: "green", checked: "teal", rejected: "red", cancelled: "gray" } as const;

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  return <Badge tone={TONES[status]}>{APPOINTMENT_STATUS_LABELS[status]}</Badge>;
}
