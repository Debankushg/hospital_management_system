import { FormField } from "@/components/ui/form-field";
import { Select } from "@/components/ui/select";
import { BASE_ROLES, ROLE_LABELS } from "@/config/roles.config";
import type { ComponentProps } from "react";

interface BaseRoleSelectProps extends ComponentProps<"select"> {
  error?: string;
}

/** The admin's profession. They are listed only in that department, tagged e.g. "Doctor, Admin". */
export function BaseRoleSelect({ error, ...props }: BaseRoleSelectProps) {
  return (
    <FormField
      label="Works as (profession)"
      error={error}
      hint="Listed only under this department with an “Admin” tag, e.g. “Doctor, Admin” – not under the other departments they manage."
    >
      <Select {...props}>
        <option value="">Select profession…</option>
        {BASE_ROLES.map((r) => (
          <option key={r} value={r}>
            {ROLE_LABELS[r]}
          </option>
        ))}
      </Select>
    </FormField>
  );
}
