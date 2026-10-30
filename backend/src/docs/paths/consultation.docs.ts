import { commonErrors, errorResponse, jsonResponse, ref, secured, uuidParam } from "../helpers";

const DOCTOR = "Doctor: my patients";
const VISITS = "Checked patients";

const pageParams = [
  { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
  { name: "pageSize", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 10 } },
  { name: "search", in: "query", schema: { type: "string" } },
  { name: "date", in: "query", schema: { type: "string", format: "date" } },
];

const page = (item: object) => ({
  type: "object",
  properties: {
    items: { type: "array", items: item },
    page: { type: "integer" },
    pageSize: { type: "integer" },
    total: { type: "integer" },
    totalPages: { type: "integer" },
  },
});

export const consultationPaths = {
  "/api/doctor/patients": {
    get: {
      tags: [DOCTOR],
      summary: "Patients assigned to me",
      description: "Doctors, and admins who work as a doctor. `status`: `approved` = still to see, `checked` = done.",
      security: secured,
      parameters: [...pageParams, { name: "status", in: "query", schema: { type: "string", enum: ["approved", "checked"] } }],
      responses: { 200: jsonResponse("Page of appointments", page(ref("Appointment"))), ...commonErrors },
    },
  },
  "/api/doctor/appointments/{id}": {
    get: {
      tags: [DOCTOR],
      summary: "Patient details, this visit's prescriptions and visit history",
      security: secured,
      parameters: [uuidParam("id", "Appointment id")],
      responses: {
        200: jsonResponse("Detail", ref("DoctorAppointmentDetail")),
        ...commonErrors,
        404: errorResponse("Not assigned to you"),
      },
    },
  },
  "/api/doctor/appointments/{id}/prescriptions": {
    post: {
      tags: [DOCTOR],
      summary: "Attach a prescription (PDF)",
      description:
        "Send the PDF as the **raw request body** with `Content-Type: application/pdf` and the file name in the `X-File-Name` header (URL-encoded). Max 5 MB, max 5 per visit. The file content is verified to be a real PDF (400 otherwise).",
      security: secured,
      parameters: [uuidParam("id", "Appointment id"), { name: "X-File-Name", in: "header", schema: { type: "string" } }],
      requestBody: {
        required: true,
        content: { "application/pdf": { schema: { type: "string", format: "binary" } } },
      },
      responses: {
        201: jsonResponse("Attached", { type: "object", properties: { prescription: ref("Prescription") } }),
        413: errorResponse("File too large"),
        415: errorResponse("Content-Type must be application/pdf"),
        ...commonErrors,
        404: errorResponse("Not assigned to you"),
      },
    },
  },
  "/api/doctor/appointments/{id}/check": {
    patch: {
      tags: [DOCTOR],
      summary: "Mark the patient as checked",
      description: "Status becomes `checked`; the visit then appears in the checked-patients list for reception and accounts.",
      security: secured,
      parameters: [uuidParam("id", "Appointment id")],
      responses: {
        200: jsonResponse("Checked", { type: "object", properties: { checked: { type: "boolean" } } }),
        ...commonErrors,
        404: errorResponse("Not assigned to you"),
        409: errorResponse("Already checked"),
      },
    },
  },
  "/api/prescriptions/{id}/file": {
    get: {
      tags: [DOCTOR],
      summary: "Open a prescription PDF",
      description:
        "Allowed: the patient, doctors treating that patient, reception staff and the super admin. Accounts cannot open prescriptions.",
      security: secured,
      parameters: [uuidParam("id", "Prescription id")],
      responses: {
        200: { description: "The PDF", content: { "application/pdf": { schema: { type: "string", format: "binary" } } } },
        ...commonErrors,
        404: errorResponse("Prescription not found"),
      },
    },
  },
  "/api/prescriptions/{id}": {
    delete: {
      tags: [DOCTOR],
      summary: "Delete a prescription (the doctor who attached it)",
      security: secured,
      parameters: [uuidParam("id", "Prescription id")],
      responses: { 204: { description: "Deleted" }, ...commonErrors, 404: errorResponse("Prescription not found") },
    },
  },
  "/api/visits/checked": {
    get: {
      tags: [VISITS],
      summary: "Patients checked by doctors (reception and accounts)",
      description:
        "Newest first, with the doctor, checked time, prescription count and consultation fee. Reception also gets the prescription metadata so it can open the PDFs; accounts sees only the count.",
      security: secured,
      parameters: pageParams,
      responses: { 200: jsonResponse("Page of checked visits", page(ref("AppointmentWithPrescriptions"))), ...commonErrors },
    },
  },
};
