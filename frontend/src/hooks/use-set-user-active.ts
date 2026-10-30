import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { userService } from "@/services/user.service";

export function useSetUserActive() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { successMessage: "User status updated", toastError: true },
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => userService.setActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
}
