import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { leaveService } from "@/services/leave.service";

export const useMyLeaves = () => useQuery({ queryKey: queryKeys.leaves.mine, queryFn: leaveService.mine });
