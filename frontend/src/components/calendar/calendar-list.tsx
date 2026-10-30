import { Table, Td, Th, THead, Tr } from "@/components/ui/table";
import type { Duty } from "@/types/department.types";
import type { CalendarDay } from "@/types/analytics.types";
import { weekdayName } from "@/utils/calendar.util";
import { formatDate } from "@/utils/format-date.util";
import { AttendanceStatusBadge } from "./attendance-status-badge";
import { effectiveStatus } from "./calendar-styles";

/** Day-by-day list of the month (the "day wise" view). */
export function CalendarList({ days, duty, today }: { days: CalendarDay[]; duty: Duty | null; today: string }) {
  return (
    <Table>
      <THead>
        <tr>
          <Th>Date</Th>
          <Th>Day</Th>
          <Th>Attendance</Th>
          <Th>Duty</Th>
          <Th>Note</Th>
        </tr>
      </THead>
      <tbody>
        {days.map((d) => {
          const status = effectiveStatus(d);
          return (
            <Tr key={d.date} className={d.date === today ? "bg-brand-50/60" : undefined}>
              <Td className="whitespace-nowrap font-medium text-slate-900">{formatDate(d.date)}</Td>
              <Td>{weekdayName(d.weekday)}</Td>
              <Td>{status ? <AttendanceStatusBadge status={status} /> : <span className="text-slate-400">–</span>}</Td>
              <Td className="whitespace-nowrap text-slate-600">
                {d.isWorkDay === null ? "–" : d.isWorkDay && duty ? `${duty.startTime} – ${duty.endTime}` : "Off"}
              </Td>
              <Td className="text-slate-600">{d.notes ?? "–"}</Td>
            </Tr>
          );
        })}
      </tbody>
    </Table>
  );
}
