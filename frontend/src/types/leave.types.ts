import type { LEAVE_STATUSES, LEAVE_TYPES } from "@/config/hr.config";
import type { Role } from "./role.types";

export type LeaveStatus = (typeof LEAVE_STATUSES)[number];
export type LeaveType = (typeof LEAVE_TYPES)[number];

export interface Leave {
  id: string;
  userId: string;
  userName: string;
  userRole: Role;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string | null;
  status: LeaveStatus;
  reviewNote: string | null;
  reviewedAt: string | null;
  createdAt: string;
}
