import type { AdminResult, AdminWithAssignments, Assignment, ReassignedArea } from "@/types/admin.types";
import type { DEMOTION_ROLES } from "@/config/roles.config";
import type { Role } from "@/types/role.types";
import type { PublicUser } from "@/types/user.types";
import { apiRequest } from "./api-client";

export const adminService = {
  list: () => apiRequest<{ admins: AdminWithAssignments[] }>("/admins").then((r) => r.admins),

  create: (payload: Record<string, unknown>) =>
    apiRequest<AdminResult>("/admins", { method: "POST", body: payload }),

  /** `baseRole` is only needed for users who are not already doctors / receptionists / pathologists / accounts. */
  promote: (userId: string, assignments: Assignment[], baseRole?: Role) =>
    apiRequest<AdminResult>(`/admins/${userId}/promote`, {
      method: "POST",
      body: { assignments, ...(baseRole && { baseRole }) },
    }),

  /** Omit `baseRole` to leave the profession unchanged (it cannot be cleared). */
  updateAssignments: (userId: string, assignments: Assignment[], baseRole?: Role) =>
    apiRequest<{ assignments: Assignment[]; reassigned: ReassignedArea[] }>(`/admins/${userId}/assignments`, {
      method: "PUT",
      body: { assignments, ...(baseRole !== undefined && { baseRole }) },
    }),

  demote: (userId: string, role: (typeof DEMOTION_ROLES)[number]) =>
    apiRequest<{ user: PublicUser }>(`/admins/${userId}/demote`, { method: "POST", body: { role } }),
};
