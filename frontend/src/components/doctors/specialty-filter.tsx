import { Select } from "@/components/ui/select";
import { SPECIALTIES, SPECIALTY_LABELS } from "@/config/roles.config";
import type { Specialty } from "@/types/role.types";

interface SpecialtyFilterProps {
  value: Specialty | "";
  onChange: (value: Specialty | "") => void;
}

export function SpecialtyFilter({ value, onChange }: SpecialtyFilterProps) {
  return (
    <Select value={value} onChange={(e) => onChange(e.target.value as Specialty | "")} className="w-56">
      <option value="">All specialties</option>
      {SPECIALTIES.map((s) => (
        <option key={s} value={s}>
          {SPECIALTY_LABELS[s]}
        </option>
      ))}
    </Select>
  );
}
