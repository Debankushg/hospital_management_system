import type { EditPatientFormValues } from "@/types/form.types";
import type { Paginated } from "@/types/pagination.types";
import type { Patient, PatientDetail, PatientListParams } from "@/types/patient.types";
import { apiRequest } from "./api-client";

export const patientService = {
  list: (p: PatientListParams) =>
    apiRequest<Paginated<Patient>>("/patients", {
      query: {
        search: p.search || undefined,
        sortBy: p.sortBy,
        order: p.order,
        page: String(p.page),
        pageSize: String(p.pageSize),
      },
    }),

  get: (id: string) => apiRequest<PatientDetail>(`/patients/${id}`),

  /** Empty strings are sent as null so the backend clears the field. */
  update: (id: string, values: EditPatientFormValues) =>
    apiRequest<{ patient: Patient }>(`/patients/${id}`, {
      method: "PATCH",
      body: {
        fullName: values.fullName,
        phone: values.phone || null,
        dateOfBirth: values.dateOfBirth || null,
        gender: values.gender || null,
        bloodGroup: values.bloodGroup || null,
        address: values.address || null,
      },
    }).then((r) => r.patient),

  remove: (id: string) => apiRequest<void>(`/patients/${id}`, { method: "DELETE" }),
};
