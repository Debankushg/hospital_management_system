import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { dutyService } from "@/services/duty.service";
import type { DutyFormValues } from "@/types/form.types";

export function useUpdateDuty() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { successMessage: "Duty time saved" },
    mutationFn: ({ userId, values }: { userId: string; values: DutyFormValues }) =>
      dutyService.update(userId, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.department.overview }),
  });
}
