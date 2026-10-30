import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { leaveService } from "@/services/leave.service";
import type { LeaveRequestFormValues } from "@/types/form.types";
import { stripEmpty } from "@/utils/strip-empty.util";

export function useRequestLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { successMessage: "Leave request submitted" },
    mutationFn: (values: LeaveRequestFormValues) => leaveService.request(stripEmpty(values)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.leaves.all }),
  });
}
