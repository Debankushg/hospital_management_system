import type { Capabilities, PublicUser } from "@/types/user.types";
import type { Role } from "@/types/role.types";

export const hasAnyRole = (role: Role | undefined, allowed?: Role[]) =>
  !allowed || (!!role && allowed.includes(role));

/** Allowed by role, or by a server-granted capability (e.g. an admin who works as a receptionist). */
export const hasAccess = (
  user: PublicUser | null | undefined,
  roles?: Role[],
  capability?: keyof Capabilities,
) => {
  if (!roles && !capability) return true;
  if (hasAnyRole(user?.role, roles) && roles) return true;
  return !!capability && !!user?.capabilities?.[capability];
};
