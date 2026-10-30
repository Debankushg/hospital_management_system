import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { analyticsService } from "@/services/analytics.service";
import type { DateRange } from "@/services/analytics.service";

/** Refreshes every minute so dashboards stay current. */
export const useDoctorAnalytics = (range: Pick<DateRange, "from" | "to">) =>
  useQuery({
    queryKey: queryKeys.analytics.doctors(range),
    queryFn: () => analyticsService.doctors(range),
    placeholderData: keepPreviousData,
    refetchInterval: 60_000,
  });
