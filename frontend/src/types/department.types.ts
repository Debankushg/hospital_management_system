import type { AdminArea, Role } from "./role.types";
import type { PublicUser } from "./user.types";

export interface Duty {
  userId: string;
  /** "HH:MM" (24h) */
  startTime: string;
  endTime: string;
  /** 0 = Sunday … 6 = Saturday */
  workDays: number[];
  updatedAt: string;
}

export interface DepartmentMember extends PublicUser {
  duty: Duty | null;
}

export interface Department {
  area: AdminArea;
  role: Role;
  notes: string | null;
  members: DepartmentMember[];
}

export interface UnplacedAdmin {
  id: string;
  fullName: string;
  email: string;
}

export interface DepartmentOverview {
  departments: Department[];
  /** Super admin only: admins with no profession set, so they are not listed in any department. */
  unplacedAdmins: UnplacedAdmin[];
}
