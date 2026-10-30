import { Badge } from "@/components/ui/badge";
import type { AttendanceStatus } from "@/types/attendance.types";
import { STATUS_STYLE, statusLabel } from "./calendar-styles";

export function AttendanceStatusBadge({ status }: { status: AttendanceStatus }) {
  return <Badge tone={STATUS_STYLE[status].badge}>{statusLabel(status)}</Badge>;
}
