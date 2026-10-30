import type { Appointment, AppointmentStatus, AppointmentWithPrescriptions, DoctorAvailability } from "@/types/appointment.types";
import type { Paginated } from "@/types/pagination.types";
import type { Specialty } from "@/types/role.types";
import { apiRequest } from "./api-client";

export interface AppointmentListParams {
  status?: AppointmentStatus;
  date?: string;
  search: string;
  page: number;
  pageSize: number;
}

export const appointmentService = {
  /** Reception queue. */
  list: (p: AppointmentListParams) =>
    apiRequest<Paginated<Appointment>>("/appointments", {
      query: {
        status: p.status,
        date: p.date || undefined,
        search: p.search || undefined,
        page: String(p.page),
        pageSize: String(p.pageSize),
      },
    }),

  /** The signed-in patient's own appointments. */
  mine: () =>
    apiRequest<{ appointments: AppointmentWithPrescriptions[] }>("/appointments/mine").then((r) => r.appointments),

  create: (payload: Record<string, unknown>) =>
    apiRequest<unknown>("/appointments", { method: "POST", body: payload }),

  availability: (specialty: Specialty, date: string) =>
    apiRequest<{ doctors: DoctorAvailability[] }>("/appointments/availability", {
      query: { specialty, date },
    }).then((r) => r.doctors),

  approve: (id: string, body: { doctorId: string; note?: string }) =>
    apiRequest<unknown>(`/appointments/${id}/approve`, { method: "PATCH", body }),

  reject: (id: string, note?: string) =>
    apiRequest<unknown>(`/appointments/${id}/reject`, { method: "PATCH", body: { note } }),

  cancel: (id: string) => apiRequest<unknown>(`/appointments/${id}/cancel`, { method: "PATCH" }),
};
