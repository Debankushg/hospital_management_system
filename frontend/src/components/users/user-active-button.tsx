"use client";

import { Button } from "@/components/ui/button";
import { useSetUserActive } from "@/hooks/use-set-user-active";
import type { PublicUser } from "@/types/user.types";

export function UserActiveButton({ user }: { user: PublicUser }) {
  const setActive = useSetUserActive();

  return (
    <Button
      variant={user.isActive ? "dangerSoft" : "secondary"}
      loading={setActive.isPending}
      onClick={() => setActive.mutate({ id: user.id, isActive: !user.isActive })}
      size="sm"
    >
      {user.isActive ? "Deactivate" : "Activate"}
    </Button>
  );
}
