import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";

/** Permanently deletes a user (super admin). Refreshes every list that may contain them. */
export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { successMessage: "User deleted", toastError: true },
    mutationFn: userService.remove,
    onSuccess: () => {
      for (const key of ["users", "admins", "doctors", "department", "attendance", "leaves"]) {
        queryClient.invalidateQueries({ queryKey: [key] });
      }
    },
  });
}
