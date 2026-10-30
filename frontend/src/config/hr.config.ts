/** Keep in sync with the backend enums (backend/src/models/enums.ts). */

export const ATTENDANCE_STATUSES = ["present", "absent", "late", "half_day", "on_leave"] as const;

export const ATTENDANCE_LABELS: Record<(typeof ATTENDANCE_STATUSES)[number], string> = {
  present: "Present",
  absent: "Absent",
  late: "Late",
  half_day: "Half day",
  on_leave: "On leave",
};

export const LEAVE_TYPES = ["sick", "casual", "annual", "unpaid", "other"] as const;

export const LEAVE_LABELS: Record<(typeof LEAVE_TYPES)[number], string> = {
  sick: "Sick leave",
  casual: "Casual leave",
  annual: "Annual leave",
  unpaid: "Unpaid leave",
  other: "Other",
};

export const LEAVE_STATUSES = ["pending", "approved", "rejected"] as const;

export const LEAVE_STATUS_LABELS: Record<(typeof LEAVE_STATUSES)[number], string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

/** 0 = Sunday … 6 = Saturday (matches the backend). */
export const WEEK_DAYS = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
] as const;
