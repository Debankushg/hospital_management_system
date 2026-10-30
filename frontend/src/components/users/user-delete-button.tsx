"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteUser } from "@/hooks/use-delete-user";
import { useDialogs } from "@/hooks/use-dialogs";
import type { PublicUser } from "@/types/user.types";

/** Super-admin-only permanent delete, confirmed in an in-app dialog (feedback arrives as a toast). */
export function UserDeleteButton({ user }: { user: PublicUser }) {
  const del = useDeleteUser();
  const { confirm } = useDialogs();

  const onClick = async () => {
    const ok = await confirm({
      title: `Delete ${user.fullName}?`,
      message: (
        <>
          <p>
            <strong>{user.email}</strong> will be removed permanently with their profile, assignments, duty,
            attendance and leave records.
          </p>
          <p className="mt-2">This cannot be undone. Use Deactivate instead to only block their access.</p>
        </>
      ),
      confirmLabel: "Delete permanently",
      tone: "danger",
    });
    if (ok) del.mutate(user.id);
  };

  return (
    <Button variant="dangerSoft" size="sm" loading={del.isPending} onClick={onClick}>
      <Trash2 className="size-3.5" />
      Delete
    </Button>
  );
}
