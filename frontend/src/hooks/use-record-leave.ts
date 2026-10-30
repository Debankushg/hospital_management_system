import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { leaveService } from "@/services/leave.service";
import type { LeaveFormValues } from "@/types/form.types";
import { stripEmpty } from "@/utils/strip-empty.util";

export function useRecordLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { successMessage: "Leave recorded" },
    mutationFn: (values: LeaveFormValues) => leaveService.record(stripEmpty(values)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leaves.all });
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}
