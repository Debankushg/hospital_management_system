import { Select } from "@/components/ui/select";
import { ROLES, ROLE_LABELS } from "@/config/roles.config";
import type { Role } from "@/types/role.types";

interface RoleFilterProps {
  value: Role | "";
  onChange: (value: Role | "") => void;
}

export function RoleFilter({ value, onChange }: RoleFilterProps) {
  return (
    <Select value={value} onChange={(e) => onChange(e.target.value as Role | "")} className="w-48">
      <option value="">All roles</option>
      {ROLES.map((r) => (
        <option key={r} value={r}>
          {ROLE_LABELS[r]}
        </option>
      ))}
    </Select>
  );
}
