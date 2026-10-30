import type { ATTENDANCE_STATUSES } from "@/config/hr.config";
import type { PublicUser } from "./user.types";

export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

export interface AttendanceEntry {
  user: PublicUser;
  attendance: { status: AttendanceStatus; notes: string | null } | null;
}

export interface AttendanceSheet {
  date: string;
  entries: AttendanceEntry[];
}
