import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { adminService } from "@/services/admin.service";
import type { DEMOTION_ROLES } from "@/config/roles.config";

export function useDemoteAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { successMessage: "Admin rights removed" },
    mutationFn: ({ userId, role }: { userId: string; role: (typeof DEMOTION_ROLES)[number] }) =>
      adminService.demote(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admins.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: ["department"] });
    },
  });
}
