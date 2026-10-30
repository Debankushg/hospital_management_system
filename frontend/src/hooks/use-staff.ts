import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { departmentService } from "@/services/department.service";

/** Staff the signed-in admin manages (attendance / leave pickers). Pass `enabled=false` for non-managers. */
export const useStaff = (enabled = true) =>
  useQuery({ queryKey: queryKeys.department.staff, queryFn: departmentService.staff, enabled });
