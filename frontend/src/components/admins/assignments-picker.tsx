import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ADMIN_AREAS, ADMIN_AREA_LABELS } from "@/config/roles.config";
import { useAdmins } from "@/hooks/use-admins";
import type { Assignment } from "@/types/admin.types";

interface AssignmentsPickerProps {
  value: Assignment[];
  onChange: (value: Assignment[]) => void;
  error?: string;
  /** The admin being edited, so their own areas are not reported as "taken by someone else". */
  adminId?: string;
}

/**
 * Checkbox list of work areas, each with an optional note. A department has exactly one admin, so an area that
 * another admin holds is flagged: ticking it moves it to this admin.
 */
export function AssignmentsPicker({ value, onChange, error, adminId }: AssignmentsPickerProps) {
  const { data: admins } = useAdmins();
  const ownerOf = (area: string) =>
    admins?.find((a) => a.id !== adminId && a.assignments.some((x) => x.area === area));
  const find = (area: string) => value.find((a) => a.area === area);

  const toggle = (area: Assignment["area"]) =>
    onChange(find(area) ? value.filter((a) => a.area !== area) : [...value, { area }]);

  const setNotes = (area: Assignment["area"], notes: string) =>
    onChange(value.map((a) => (a.area === area ? { ...a, notes: notes || undefined } : a)));

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-700">Assigned work</p>
      {ADMIN_AREAS.map((area) => {
        const selected = find(area);
        const owner = ownerOf(area);
        return (
          <div key={area} className="space-y-1 rounded-lg border border-slate-200 p-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!selected} onChange={() => toggle(area)} />
              {ADMIN_AREA_LABELS[area]}
              {owner && !selected && <Badge tone="gray">Managed by {owner.fullName}</Badge>}
            </label>
            {owner && selected && (
              <p className="rounded-md bg-amber-50 px-2.5 py-1.5 text-xs text-amber-800 ring-1 ring-inset ring-amber-200">
                Currently managed by <strong>{owner.fullName}</strong>. Saving moves this department to this admin and
                removes it from {owner.fullName}.
              </p>
            )}
            {selected && (
              <Input
                placeholder="Notes (optional)"
                value={selected.notes ?? ""}
                onChange={(e) => setNotes(area, e.target.value)}
              />
            )}
          </div>
        );
      })}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
