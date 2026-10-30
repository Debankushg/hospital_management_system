import type { Role } from "@/types/role.types";

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  super_admin: "Full control: create admins, assign their work areas and manage every account.",
  admin: "Manage the staff and patient accounts in the work areas assigned to you.",
  doctor: "View the doctor directory and keep your account secure.",
  receptionist: "Front-desk access for patient registration and appointments.",
  pathologist: "Laboratory access for pathology tests and reports.",
  accounts: "Billing and accounts access.",
  patient: "Find a specialist and manage your account security.",
};
