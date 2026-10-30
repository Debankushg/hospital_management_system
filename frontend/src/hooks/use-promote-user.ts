import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { useToast } from "@/hooks/use-toast";
import { adminService } from "@/services/admin.service";
import { describeReassigned } from "@/utils/reassigned.util";
import type { PromoteUserFormValues } from "@/types/form.types";

export function usePromoteUser() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    meta: { successMessage: "User promoted to admin" },
    mutationFn: ({ userId, assignments, baseRole }: PromoteUserFormValues) =>
      adminService.promote(userId, assignments, baseRole || undefined),
    onSuccess: (data) => {
      const moved = describeReassigned(data.reassigned);
      if (moved) toast.success(moved);
      queryClient.invalidateQueries({ queryKey: queryKeys.admins.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: ["department"] });
    },
  });
}
