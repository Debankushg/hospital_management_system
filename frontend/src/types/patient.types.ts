import type { Appointment } from "./appointment.types";
import type { PublicUser } from "./user.types";

export interface Patient extends PublicUser {
  dateOfBirth: string | null;
  gender: string | null;
  bloodGroup: string | null;
  address: string | null;
}

export interface PatientDetail {
  patient: Patient;
  appointments: Appointment[];
}

export type PatientSortBy = "name" | "joined";

export interface PatientListParams {
  search: string;
  sortBy: PatientSortBy;
  order: "asc" | "desc";
  page: number;
  pageSize: number;
}
