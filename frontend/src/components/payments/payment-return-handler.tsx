"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { ROUTES } from "@/config/routes.config";
import { useSyncPayment } from "@/hooks/use-sync-payment";
import { useToast } from "@/hooks/use-toast";

/**
 * Stripe sends the browser back to /payments?checkout=success&session_id=...
 * Confirm the payment with the server right away (the webhook may be a moment behind), then clean the URL.
 */
export function PaymentReturnHandler() {
  const params = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const { mutate } = useSyncPayment();
  const handled = useRef(false);

  const outcome = params.get("checkout");
  const sessionId = params.get("session_id");

  useEffect(() => {
    if (!outcome || handled.current) return;
    handled.current = true;
    if (outcome === "success" && sessionId) {
      mutate(sessionId, {
        onSuccess: ({ payment }) =>
          payment.status === "paid"
            ? toast.success("Payment received")
            : toast.error("Payment is not confirmed yet. Use Refresh in a moment."),
      });
    } else if (outcome === "cancelled") {
      toast.error("Payment was cancelled. You can resume it any time.");
    }
    router.replace(ROUTES.payments);
  }, [outcome, sessionId, mutate, router, toast]);

  return null;
}
