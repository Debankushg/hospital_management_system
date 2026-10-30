/** Keep in sync with the backend enums (backend/src/models/enums.ts). */

export const ROLES = [
  "super_admin",
  "admin",
  "doctor",
  "receptionist",
  "pathologist",
  "accounts",
  "patient",
] as const;

export const SPECIALTIES = [
  "opd",
  "gynecologist",
  "cardiologist",
  "ent",
  "dermatologist",
  "pediatrician",
] as const;

export const ADMIN_AREAS = [
  "doctor_management",
  "reception_management",
  "pathology_management",
  "accounts_management",
  "patient_management",
] as const;

/** Roles that can be created from the "Create user" form. */
export const CREATABLE_ROLES = ["doctor", "receptionist", "pathologist", "accounts", "patient"] as const;

/** Staff roles an admin can "work as" (decides which department lists them as "Doctor, Admin"). */
export const BASE_ROLES = ["doctor", "receptionist", "pathologist", "accounts"] as const;

/** Roles an admin can be demoted to. */
export const DEMOTION_ROLES = ["receptionist", "pathologist", "accounts", "patient"] as const;

export const ROLE_LABELS: Record<(typeof ROLES)[number], string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  doctor: "Doctor",
  receptionist: "Receptionist",
  pathologist: "Pathologist",
  accounts: "Accounts",
  patient: "Patient",
};

export const SPECIALTY_LABELS: Record<(typeof SPECIALTIES)[number], string> = {
  opd: "OPD",
  gynecologist: "Gynecologist",
  cardiologist: "Cardiologist (Heart)",
  ent: "ENT",
  dermatologist: "Dermatologist",
  pediatrician: "Child Specialist",
};

export const ADMIN_AREA_LABELS: Record<(typeof ADMIN_AREAS)[number], string> = {
  doctor_management: "Doctor management",
  reception_management: "Reception management",
  pathology_management: "Pathology management",
  accounts_management: "Accounts management",
  patient_management: "Patient management",
};
