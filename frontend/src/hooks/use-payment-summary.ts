import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { paymentService } from "@/services/payment.service";

export const usePaymentSummary = () =>
  useQuery({ queryKey: queryKeys.payments.summary, queryFn: paymentService.summary, refetchInterval: 30_000 });
