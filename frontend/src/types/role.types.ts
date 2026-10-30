import type { ADMIN_AREAS, ROLES, SPECIALTIES } from "@/config/roles.config";

export type Role = (typeof ROLES)[number];
export type Specialty = (typeof SPECIALTIES)[number];
export type AdminArea = (typeof ADMIN_AREAS)[number];
