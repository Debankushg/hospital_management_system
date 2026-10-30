import { RoleBadge } from "@/components/users/role-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PersonCell } from "@/components/ui/person-cell";
import { Select } from "@/components/ui/select";
import { Table, Td, Th, THead, Tr } from "@/components/ui/table";
import { ATTENDANCE_LABELS, ATTENDANCE_STATUSES } from "@/config/hr.config";
import type { AttendanceEntry, AttendanceStatus } from "@/types/attendance.types";

interface AttendanceSheetProps {
  entries: AttendanceEntry[];
  disabled?: boolean;
  onMark: (userId: string, status: AttendanceStatus) => void;
}

export function AttendanceSheet({ entries, disabled, onMark }: AttendanceSheetProps) {
  if (!entries.length) return <EmptyState message="No staff to show. Staff appear once a department is assigned to you." />;

  return (
    <Table>
      <THead>
        <tr>
          <Th>Staff member</Th>
          <Th>Role</Th>
          <Th>Attendance</Th>
        </tr>
      </THead>
      <tbody>
        {entries.map(({ user, attendance }) => (
          <Tr key={user.id}>
            <Td>
<PersonCell name={user.fullName} sub={user.email} />
</Td>
            <Td>
              <RoleBadge role={user.role} baseRole={user.baseRole} />
            </Td>
            <Td>
              <Select
                value={attendance?.status ?? ""}
                disabled={disabled}
                onChange={(e) => onMark(user.id, e.target.value as AttendanceStatus)}
                className="w-40"
              >
                <option value="" disabled>
                  Not marked
                </option>
                {ATTENDANCE_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {ATTENDANCE_LABELS[s]}
                  </option>
                ))}
              </Select>
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}
