import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { paymentService } from "@/services/payment.service";

/** Asks the server to re-read a payment from Stripe, then refreshes the lists. */
export function useSyncPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { toastError: true },
    mutationFn: paymentService.sync,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.payments.all }),
  });
}
