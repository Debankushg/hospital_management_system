import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { userService } from "@/services/user.service";
import type { Role } from "@/types/role.types";

export const useUsers = (role?: Role) =>
  useQuery({ queryKey: queryKeys.users.list(role), queryFn: () => userService.list(role) });
