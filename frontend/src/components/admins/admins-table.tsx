import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { RowActions, THead, Table, Td, Th, Tr } from "@/components/ui/table";
import { ADMIN_AREA_LABELS } from "@/config/roles.config";
import { RoleBadge } from "@/components/users/role-badge";
import { UserDeleteButton } from "@/components/users/user-delete-button";
import type { AdminWithAssignments } from "@/types/admin.types";

interface AdminsTableProps {
  admins: AdminWithAssignments[];
  onEdit: (admin: AdminWithAssignments) => void;
  onDemote: (admin: AdminWithAssignments) => void;
}

export function AdminsTable({ admins, onEdit, onDemote }: AdminsTableProps) {
  if (!admins.length) return <EmptyState message="No admins yet. Create one or promote an existing user." />;

  return (
    <Table>
      <THead>
        <tr>
          <Th>Admin</Th>
          <Th>Assigned work</Th>
          <Th>Status</Th>
          <Th />
        </tr>
      </THead>
      <tbody>
        {admins.map((a) => (
          <Tr key={a.id}>
            <Td>
              <p className="font-medium">
                {a.fullName} <RoleBadge role="admin" baseRole={a.baseRole} />
              </p>
              {!a.baseRole && (
                <p className="mt-1 text-xs text-amber-700">
                  Profession not set – not listed in any department. Use “Edit work”.
                </p>
              )}
              <p className="text-xs text-slate-500">{a.email}</p>
            </Td>
            <Td>
              <div className="flex flex-wrap gap-1">
                {a.assignments.length ? (
                  a.assignments.map((x) => (
                    <Badge key={x.area} tone="teal">
                      {ADMIN_AREA_LABELS[x.area]}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">None</span>
                )}
              </div>
            </Td>
            <Td>
              <Badge tone={a.isActive ? "green" : "red"}>{a.isActive ? "Active" : "Inactive"}</Badge>
            </Td>
            <Td className="text-right">
<RowActions>
              <Button variant="secondary" size="sm" onClick={() => onEdit(a)}>
                Edit work
              </Button>
              <Button variant="dangerSoft" size="sm" onClick={() => onDemote(a)}>
                Demote
              </Button>
              <UserDeleteButton user={a} />
            </RowActions>
</Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}
