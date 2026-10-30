import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { userService } from "@/services/user.service";
import type { CreateUserFormValues } from "@/types/form.types";
import { stripEmpty } from "@/utils/strip-empty.util";

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { successMessage: "User created" },
    mutationFn: ({ consultationFee, ...values }: CreateUserFormValues) =>
      userService.create({
        ...stripEmpty(values),
        ...(consultationFee ? { consultationFee: Number(consultationFee) } : {}),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
}
