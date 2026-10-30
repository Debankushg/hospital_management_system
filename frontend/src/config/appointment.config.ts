/** Keep in sync with the backend (backend/src/models/enums.ts). */

export const APPOINTMENT_STATUSES = ["requested", "approved", "checked", "rejected", "cancelled"] as const;

export const APPOINTMENT_STATUS_LABELS: Record<(typeof APPOINTMENT_STATUSES)[number], string> = {
  requested: "Requested",
  approved: "Approved",
  checked: "Checked",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

export const UNAVAILABLE_REASON_LABELS = {
  absent: "Absent",
  on_leave: "On leave",
  not_on_duty: "Not on duty that day",
} as const;

export const MAX_PRESCRIPTION_MB = 5;

export const PAGE_SIZES = [10, 25, 50] as const;
