import { ADMIN_AREA_LABELS } from "@/config/roles.config";
import type { ReassignedArea } from "@/types/admin.types";

/** "Reception moved from John Jou; Accounts moved from Mrinal Pal", or null when nothing moved. */
export function describeReassigned(list: ReassignedArea[] | undefined): string | null {
  if (!list?.length) return null;
  return list.map((r) => `${ADMIN_AREA_LABELS[r.area]} moved from ${r.fromAdminName}`).join("; ");
}
