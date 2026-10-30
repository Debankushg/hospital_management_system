import type { Role, Specialty } from "./role.types";

/** What the backend says this user may do (computed server-side). */
export interface Capabilities {
  /** Patient list, booking, assigning doctors. */
  reception: boolean;
  editPatients: boolean;
  deletePatients: boolean;
  /** Sees patients assigned to them, attaches prescriptions, marks patients as checked. */
  doctor: boolean;
  accounts: boolean;
  /** Can take payments through Stripe (accounts, Accounts-department admins, super admin). */
  payments: boolean;
  /** Can see the checked-patients list (reception or accounts). */
  viewChecked: boolean;
}

export interface PublicUser {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: Role;
  /** Admins only: the staff role they work as, shown as e.g. "Doctor, Admin". */
  baseRole: Role | null;
  isActive: boolean;
  mfaEnabled: boolean;
  createdAt: string;
  /** Present on the signed-in user (login / me). */
  capabilities?: Capabilities;
}

export interface Doctor {
  id: string;
  fullName: string;
  specialty: Specialty;
  consultationFee: string | null;
}
