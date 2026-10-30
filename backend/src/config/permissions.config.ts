import type { AdminArea, Role } from "../types/domain.types";

/** Which admin work area governs each manageable role. Admins/super admins are never listed. */
export const ROLE_AREA: Partial<Record<Role, AdminArea>> = {
  doctor: "doctor_management",
  receptionist: "reception_management",
  pathologist: "pathology_management",
  accounts: "accounts_management",
  patient: "patient_management",
};

/** Roles that must have MFA enrolled before they can use the system. */
export const MFA_MANDATORY_ROLES: Role[] = [
  "super_admin",
  "admin",
  "doctor",
  "receptionist",
  "pathologist",
  "accounts",
];

/** Reverse of ROLE_AREA: the role whose members belong to each work area. */
export const AREA_ROLE = Object.fromEntries(
  Object.entries(ROLE_AREA).map(([role, area]) => [area, role]),
) as Record<AdminArea, Role>;
