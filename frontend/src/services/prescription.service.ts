import { apiRequest } from "./api-client";

export const prescriptionService = {
  /** The PDF is sent as the raw request body; the name travels in a header. */
  upload: (appointmentId: string, file: File) =>
    apiRequest<unknown>(`/doctor/appointments/${appointmentId}/prescriptions`, {
      method: "POST",
      body: file,
      headers: { "X-File-Name": encodeURIComponent(file.name) },
    }),

  remove: (id: string) => apiRequest<void>(`/prescriptions/${id}`, { method: "DELETE" }),

  /** Downloads the PDF (auth needs a header, so a plain link would not work). */
  fetchPdf: (id: string) => apiRequest<Blob>(`/prescriptions/${id}/file`, { asBlob: true }),
};
