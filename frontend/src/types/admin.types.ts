import type { AdminArea } from "./role.types";
import type { PublicUser } from "./user.types";

export interface Assignment {
  area: AdminArea;
  notes?: string;
}

export interface AssignmentView {
  area: AdminArea;
  notes: string | null;
  createdAt: string;
}

export interface AdminWithAssignments extends PublicUser {
  assignments: AssignmentView[];
}

/** A department that was taken from another admin by this change (one admin per department). */
export interface ReassignedArea {
  area: AdminArea;
  fromAdminId: string;
  fromAdminName: string;
}

export interface AdminResult {
  user: PublicUser;
  assignments: Assignment[];
  reassigned?: ReassignedArea[];
}
