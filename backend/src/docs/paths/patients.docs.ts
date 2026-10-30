import { commonErrors, errorResponse, jsonBody, jsonResponse, ref, secured, uuidParam } from "../helpers";

const TAG = "Patients (reception)";

export const patientPaths = {
  "/api/patients": {
    get: {
      tags: [TAG],
      summary: "Patient list with search, sort and pagination",
      description:
        "Reception access: receptionists, admins who work as a receptionist or are assigned Reception management, and the super admin. `search` matches name, email and phone.",
      security: secured,
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
        { name: "pageSize", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 10 } },
        { name: "search", in: "query", schema: { type: "string" } },
        { name: "sortBy", in: "query", schema: { type: "string", enum: ["name", "joined"], default: "name" } },
        { name: "order", in: "query", schema: { type: "string", enum: ["asc", "desc"], default: "asc" } },
      ],
      responses: { 200: jsonResponse("Page of patients", ref("PatientPage")), ...commonErrors },
    },
  },
  "/api/patients/{id}": {
    get: {
      tags: [TAG],
      summary: "Patient details with appointment history",
      security: secured,
      parameters: [uuidParam("id", "Patient id")],
      responses: {
        200: jsonResponse("Patient", {
          type: "object",
          properties: { patient: ref("Patient"), appointments: { type: "array", items: ref("Appointment") } },
        }),
        ...commonErrors,
        404: errorResponse("Patient not found"),
      },
    },
    patch: {
      tags: [TAG],
      summary: "Edit patient details (all reception staff)",
      security: secured,
      parameters: [uuidParam("id", "Patient id")],
      requestBody: jsonBody("UpdatePatientRequest"),
      responses: {
        200: jsonResponse("Updated", { type: "object", properties: { patient: ref("Patient") } }),
        ...commonErrors,
        404: errorResponse("Patient not found"),
      },
    },
    delete: {
      tags: [TAG],
      summary: "Delete a patient (reception admin / super admin only)",
      description:
        "Only the super admin and admins assigned **Reception management**. Removes the patient with their profile and appointments. Regular receptionists get 403.",
      security: secured,
      parameters: [uuidParam("id", "Patient id")],
      responses: { 204: { description: "Deleted" }, ...commonErrors, 404: errorResponse("Patient not found") },
    },
  },
};
