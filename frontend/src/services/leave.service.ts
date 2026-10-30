import type { Leave, LeaveStatus } from "@/types/leave.types";
import { apiRequest } from "./api-client";

export const leaveService = {
  /** Leave of the staff the signed-in admin manages. */
  list: (status?: LeaveStatus) =>
    apiRequest<{ leaves: Leave[] }>("/leaves", { query: { status } }).then((r) => r.leaves),

  /** The signed-in staff member's own requests. */
  mine: () => apiRequest<{ leaves: Leave[] }>("/leaves/mine").then((r) => r.leaves),

  /** Admin records leave (approved immediately). */
  record: (payload: Record<string, unknown>) => apiRequest<unknown>("/leaves", { method: "POST", body: payload }),

  /** Staff member requests leave for themselves (pending). */
  request: (payload: Record<string, unknown>) =>
    apiRequest<unknown>("/leaves/request", { method: "POST", body: payload }),

  review: (id: string, body: { status: "approved" | "rejected"; note?: string }) =>
    apiRequest<unknown>(`/leaves/${id}/review`, { method: "PATCH", body }),

  remove: (id: string) => apiRequest<void>(`/leaves/${id}`, { method: "DELETE" }),
};
