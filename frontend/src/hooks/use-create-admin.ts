import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { useToast } from "@/hooks/use-toast";
import { adminService } from "@/services/admin.service";
import { describeReassigned } from "@/utils/reassigned.util";
import type { CreateAdminFormValues } from "@/types/form.types";
import { stripEmpty } from "@/utils/strip-empty.util";

export function useCreateAdmin() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    meta: { successMessage: "Admin created" },
    mutationFn: (values: CreateAdminFormValues) => adminService.create(stripEmpty(values)),
    onSuccess: (data) => {
      const moved = describeReassigned(data.reassigned);
      if (moved) toast.success(moved);
      queryClient.invalidateQueries({ queryKey: queryKeys.admins.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: ["department"] });
    },
  });
}
