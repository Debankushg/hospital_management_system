import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { consultationService, type CheckedVisitsParams } from "@/services/consultation.service";

/** Patients checked by doctors (reception & accounts). Refreshes every 30s so the list stays current. */
export const useCheckedVisits = (params: CheckedVisitsParams) =>
  useQuery({
    queryKey: queryKeys.checkedVisits.list(params),
    queryFn: () => consultationService.listChecked(params),
    placeholderData: keepPreviousData,
    refetchInterval: 30_000,
  });
