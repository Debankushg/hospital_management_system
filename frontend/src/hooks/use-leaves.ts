import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { leaveService } from "@/services/leave.service";
import type { LeaveStatus } from "@/types/leave.types";

export const useLeaves = (status?: LeaveStatus) =>
  useQuery({ queryKey: queryKeys.leaves.list(status), queryFn: () => leaveService.list(status) });
