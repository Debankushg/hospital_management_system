import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { paymentService, type ReceivablesParams } from "@/services/payment.service";

export const useReceivables = (params: ReceivablesParams) =>
  useQuery({
    queryKey: queryKeys.payments.receivables(params),
    queryFn: () => paymentService.receivables(params),
    placeholderData: keepPreviousData,
    refetchInterval: 30_000,
  });
