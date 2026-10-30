import type { AttendanceSheet, AttendanceStatus } from "@/types/attendance.types";
import { apiRequest } from "./api-client";

export const attendanceService = {
  sheet: (date: string) => apiRequest<AttendanceSheet>("/attendance", { query: { date } }),

  mark: (payload: { userId: string; date: string; status: AttendanceStatus }) =>
    apiRequest<unknown>("/attendance", { method: "POST", body: payload }),
};
