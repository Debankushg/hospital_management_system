import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { adminService } from "@/services/admin.service";

export const useAdmins = () => useQuery({ queryKey: queryKeys.admins.all, queryFn: adminService.list });
