import type { AppointmentWithPrescriptions } from "@/types/appointment.types";
import type { DoctorAppointmentDetail } from "@/types/consultation.types";
import type { Paginated } from "@/types/pagination.types";
import { apiRequest } from "./api-client";

export interface DoctorPatientsParams {
  status?: "approved" | "checked";
  date: string;
  search: string;
  page: number;
  pageSize: number;
}

export interface CheckedVisitsParams {
  date: string;
  search: string;
  page: number;
  pageSize: number;
}

const toQuery = (p: { date: string; search: string; page: number; pageSize: number }) => ({
  date: p.date || undefined,
  search: p.search || undefined,
  page: String(p.page),
  pageSize: String(p.pageSize),
});

export const consultationService = {
  /** Patients assigned to the signed-in doctor. */
  listPatients: (p: DoctorPatientsParams) =>
    apiRequest<Paginated<AppointmentWithPrescriptions>>("/doctor/patients", {
      query: { ...toQuery(p), status: p.status },
    }),

  detail: (id: string) => apiRequest<DoctorAppointmentDetail>(`/doctor/appointments/${id}`),

  check: (id: string) => apiRequest<unknown>(`/doctor/appointments/${id}/check`, { method: "PATCH" }),

  /** Checked patients shared with reception and accounts. */
  listChecked: (p: CheckedVisitsParams) =>
    apiRequest<Paginated<AppointmentWithPrescriptions>>("/visits/checked", { query: toQuery(p) }),
};
