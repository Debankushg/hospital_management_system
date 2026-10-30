import { RoleBadge } from "@/components/users/role-badge";
import { Badge } from "@/components/ui/badge";
import { PersonCell } from "@/components/ui/person-cell";
import { Button } from "@/components/ui/button";
import { RowActions, THead, Table, Td, Th, Tr } from "@/components/ui/table";
import type { DepartmentMember } from "@/types/department.types";
import { useCurrentUser } from "@/hooks/use-current-user";
import { formatDuty } from "@/utils/format-duty.util";

interface DepartmentMembersTableProps {
  members: DepartmentMember[];
  onEditDuty: (member: DepartmentMember) => void;
}

export function DepartmentMembersTable({ members, onEditDuty }: DepartmentMembersTableProps) {
  const viewer = useCurrentUser();
  // Only the super admin manages an admin's duty time.
  const canEdit = (m: DepartmentMember) => m.role !== "patient" && (m.role !== "admin" || viewer?.role === "super_admin");

  if (!members.length) return <p className="text-sm text-slate-500">No members in this department yet.</p>;

  return (
    <Table>
      <THead>
        <tr>
          <Th>Member</Th>
          <Th>Role</Th>
          <Th>Duty</Th>
          <Th>Status</Th>
          <Th />
        </tr>
      </THead>
      <tbody>
        {members.map((m) => (
          <Tr key={m.id}>
            <Td>
<PersonCell name={m.fullName} sub={m.email} />
</Td>
            <Td>
              <RoleBadge role={m.role} baseRole={m.baseRole} />
            </Td>
            <Td className="text-slate-600">{m.role === "patient" ? "–" : formatDuty(m.duty)}</Td>
            <Td>
              <Badge tone={m.isActive ? "green" : "red"}>{m.isActive ? "Active" : "Inactive"}</Badge>
            </Td>
            <Td className="text-right">
<RowActions>
              {canEdit(m) && (
                <Button variant="secondary" size="sm" onClick={() => onEditDuty(m)}>
                  Change duty time
                </Button>
              )}
            </RowActions>
</Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}
