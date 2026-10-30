"use client";

import type { ReactNode } from "react";
import { Alert } from "@/components/ui/alert";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { Role } from "@/types/role.types";
import type { Capabilities } from "@/types/user.types";
import { hasAccess } from "@/utils/role.util";

interface RoleGuardProps {
  /** Roles allowed in. Omit to rely on `capability` alone. */
  roles?: Role[];
  /** Also allow users granted this capability by the server. */
  capability?: keyof Capabilities;
  children: ReactNode;
}

/** Shows children only if the user has one of the roles or the capability. UI-only: the API enforces access too. */
export function RoleGuard({ roles, capability, children }: RoleGuardProps) {
  const user = useCurrentUser();
  if (!hasAccess(user, roles, capability)) {
    return <Alert tone="error">You do not have permission to view this page.</Alert>;
  }
  return <>{children}</>;
}
