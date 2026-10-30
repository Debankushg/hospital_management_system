import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { leaveService } from "@/services/leave.service";

/** Approve / reject a pending leave. Approval also marks the days "on leave" in attendance. */
export function useReviewLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { successMessage: "Leave request updated", toastError: true },
    mutationFn: ({ id, status, note }: { id: string; status: "approved" | "rejected"; note?: string }) =>
      leaveService.review(id, { status, note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leaves.all });
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}
