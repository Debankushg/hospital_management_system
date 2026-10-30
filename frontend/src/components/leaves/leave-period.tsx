import { formatDate } from "@/utils/format-date.util";

export function LeavePeriod({ startDate, endDate }: { startDate: string; endDate: string }) {
  return <>{startDate === endDate ? formatDate(startDate) : `${formatDate(startDate)} – ${formatDate(endDate)}`}</>;
}
