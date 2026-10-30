"use client";

import { UserPlus } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Toolbar } from "@/components/layout/toolbar";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { QueryState } from "@/components/ui/query-state";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useUsers } from "@/hooks/use-users";
import type { Role } from "@/types/role.types";
import { CreateUserForm } from "./create-user-form";
import { RoleFilter } from "./role-filter";
import { UsersTable } from "./users-table";

export function UsersPageContent() {
  const currentUser = useCurrentUser();
  const [role, setRole] = useState<Role | "">("");
  const [creating, setCreating] = useState(false);
  const users = useUsers(role || undefined);

  return (
    <>
      <PageHeader
        title="Users"
        description="Create and manage accounts within your assigned work areas."
        actions={
          <Button onClick={() => setCreating(true)}>
            <UserPlus className="size-4" />
            Add user
          </Button>
        }
      />
      <Toolbar>
        <RoleFilter value={role} onChange={setRole} />
      </Toolbar>
      <QueryState isLoading={users.isLoading} error={users.error}>
        <UsersTable
          users={users.data ?? []}
          currentUserId={currentUser?.id}
          canDelete={currentUser?.role === "super_admin"}
        />
      </QueryState>
      {creating && (
        <Modal title="Add user" description="Staff must set up two-factor authentication on first sign-in." onClose={() => setCreating(false)}>
          <CreateUserForm onDone={() => setCreating(false)} />
        </Modal>
      )}
    </>
  );
}
