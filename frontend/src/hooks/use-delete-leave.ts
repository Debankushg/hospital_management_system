import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { leaveService } from "@/services/leave.service";

export function useDeleteLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { successMessage: "Leave removed", toastError: true },
    mutationFn: leaveService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.leaves.all }),
  });
}
