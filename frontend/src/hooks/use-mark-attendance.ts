import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { attendanceService } from "@/services/attendance.service";

export function useMarkAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { successMessage: "Attendance saved", toastError: true },
    mutationFn: attendanceService.mark,
    onSuccess: (_data, vars) =>
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.sheet(vars.date) }),
  });
}
