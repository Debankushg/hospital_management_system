import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { analyticsService } from "@/services/analytics.service";
import { todayLocal } from "@/utils/format-duty.util";

/** One month of attendance for the signed-in staff member (or `userId` for managers). */
export const useAttendanceCalendar = (month: string, userId?: string, enabled = true) =>
  useQuery({
    queryKey: queryKeys.analytics.calendar(month, userId),
    queryFn: () => analyticsService.attendanceCalendar(month, todayLocal(), userId),
    placeholderData: keepPreviousData,
    enabled,
  });
