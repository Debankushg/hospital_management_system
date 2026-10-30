import { useMutation } from "@tanstack/react-query";
import { paymentService } from "@/services/payment.service";

/** Opens Stripe's hosted payment page for a visit. The browser leaves the app and returns to /payments. */
export function useStartCheckout() {
  return useMutation({
    meta: { toastError: true },
    mutationFn: paymentService.startCheckout,
    onSuccess: ({ url }) => window.location.assign(url),
  });
}
