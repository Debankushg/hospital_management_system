import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import type { RegisterFormValues } from "@/types/form.types";
import { stripEmpty } from "@/utils/strip-empty.util";

export function useRegister() {
  return useMutation({
    mutationFn: ({ confirmPassword: _confirm, ...values }: RegisterFormValues) =>
      authService.register(stripEmpty(values)),
  });
}
