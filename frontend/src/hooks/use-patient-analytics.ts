import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { analyticsService } from "@/services/analytics.service";
import type { DateRange } from "@/services/analytics.service";

/** Refreshes every minute so dashboards stay current. */
export const usePatientAnalytics = (range: DateRange) =>
  useQuery({
    queryKey: queryKeys.analytics.patients(range),
    queryFn: () => analyticsService.patients(range),
    placeholderData: keepPreviousData,
    refetchInterval: 60_000,
  });
