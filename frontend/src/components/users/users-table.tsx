import { Badge } from "@/components/ui/badge";
import { PersonCell } from "@/components/ui/person-cell";
import { EmptyState } from "@/components/ui/empty-state";
import { RowActions, THead, Table, Td, Th, Tr } from "@/components/ui/table";
import type { PublicUser } from "@/types/user.types";
import { formatDate } from "@/utils/format-date.util";
import { RoleBadge } from "./role-badge";
import { UserActiveButton } from "./user-active-button";
import { UserDeleteButton } from "./user-delete-button";

interface UsersTableProps {
  users: PublicUser[];
  currentUserId?: string;
  /** Super admins can also delete users (including admins). */
  canDelete?: boolean;
}

export function UsersTable({ users, currentUserId, canDelete }: UsersTableProps) {
  if (!users.length) return <EmptyState message="No users found." />;

  return (
    <Table>
      <THead>
        <tr>
          <Th>Name</Th>
          <Th>Role</Th>
          <Th>MFA</Th>
          <Th>Status</Th>
          <Th>Joined</Th>
          <Th />
        </tr>
      </THead>
      <tbody>
        {users.map((u) => (
          <Tr key={u.id}>
            <Td>
<PersonCell name={u.fullName} sub={u.email} />
</Td>
            <Td>
              <RoleBadge role={u.role} baseRole={u.baseRole} />
            </Td>
            <Td>
              <Badge tone={u.mfaEnabled ? "green" : "amber"}>{u.mfaEnabled ? "On" : "Off"}</Badge>
            </Td>
            <Td>
              <Badge tone={u.isActive ? "green" : "red"}>{u.isActive ? "Active" : "Inactive"}</Badge>
            </Td>
            <Td>{formatDate(u.createdAt)}</Td>
            <Td className="text-right">
<RowActions>
              {u.id !== currentUserId && u.role !== "super_admin" && u.role !== "admin" && (
                <UserActiveButton user={u} />
              )}
              {canDelete && u.id !== currentUserId && u.role !== "super_admin" && <UserDeleteButton user={u} />}
            </RowActions>
</Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}
