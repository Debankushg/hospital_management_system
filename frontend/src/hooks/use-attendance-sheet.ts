import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { attendanceService } from "@/services/attendance.service";

export const useAttendanceSheet = (date: string) =>
  useQuery({
    queryKey: queryKeys.attendance.sheet(date),
    queryFn: () => attendanceService.sheet(date),
    enabled: !!date,
  });
