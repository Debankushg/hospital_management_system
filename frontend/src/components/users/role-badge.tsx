import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS } from "@/config/roles.config";
import type { Role } from "@/types/role.types";

type Tone = Parameters<typeof Badge>[0]["tone"];

/** Admins get their own colour so they stand out in every list. */
const ROLE_TONES: Partial<Record<Role, Tone>> = {
  super_admin: "dark",
  admin: "purple",
};

interface RoleBadgeProps {
  role: Role;
  /** For admins: the role they work as, shown as "Doctor, Admin". */
  baseRole?: Role | null;
}

export function RoleBadge({ role, baseRole }: RoleBadgeProps) {
  const label = role === "admin" && baseRole ? `${ROLE_LABELS[baseRole]}, ${ROLE_LABELS.admin}` : ROLE_LABELS[role];
  return <Badge tone={ROLE_TONES[role] ?? "gray"}>{label}</Badge>;
}
