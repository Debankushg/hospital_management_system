import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { useToast } from "@/hooks/use-toast";
import { adminService } from "@/services/admin.service";
import { describeReassigned } from "@/utils/reassigned.util";
import type { Assignment } from "@/types/admin.types";
import type { Role } from "@/types/role.types";

export function useUpdateAssignments() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    meta: { successMessage: "Admin work updated" },
    mutationFn: ({
      userId,
      assignments,
      baseRole,
    }: {
      userId: string;
      assignments: Assignment[];
      baseRole?: Role;
    }) => adminService.updateAssignments(userId, assignments, baseRole),
    onSuccess: (data) => {
      const moved = describeReassigned(data.reassigned);
      if (moved) toast.success(moved);
      queryClient.invalidateQueries({ queryKey: queryKeys.admins.all });
      queryClient.invalidateQueries({ queryKey: ["department"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}
