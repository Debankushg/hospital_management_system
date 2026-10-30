import { Badge } from "@/components/ui/badge";
import { LEAVE_STATUS_LABELS } from "@/config/hr.config";
import type { LeaveStatus } from "@/types/leave.types";

const TONES = { pending: "amber", approved: "green", rejected: "red" } as const;

export function LeaveStatusBadge({ status }: { status: LeaveStatus }) {
  return <Badge tone={TONES[status]}>{LEAVE_STATUS_LABELS[status]}</Badge>;
}
