import type { Role, Specialty } from "@/types/role.types";
import type { Doctor, PublicUser } from "@/types/user.types";
import { apiRequest } from "./api-client";

export const userService = {
  list: (role?: Role) =>
    apiRequest<{ users: PublicUser[] }>("/users", { query: { role } }).then((r) => r.users),

  create: (payload: Record<string, unknown>) =>
    apiRequest<{ user: PublicUser }>("/users", { method: "POST", body: payload }).then((r) => r.user),

  setActive: (id: string, isActive: boolean) =>
    apiRequest<{ user: PublicUser }>(`/users/${id}/active`, { method: "PATCH", body: { isActive } }).then(
      (r) => r.user,
    ),

  remove: (id: string) => apiRequest<void>(`/users/${id}`, { method: "DELETE" }),

  listDoctors: (specialty?: Specialty) =>
    apiRequest<{ doctors: Doctor[] }>("/users/doctors", { query: { specialty } }).then((r) => r.doctors),
};
