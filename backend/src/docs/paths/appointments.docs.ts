import { commonErrors, errorResponse, jsonBody, jsonResponse, ref, secured, uuidParam } from "../helpers";

const TAG = "Appointments";

const appointmentEnvelope = { type: "object", properties: { appointment: ref("Appointment") } };

export const appointmentPaths = {
  "/api/appointments": {
    post: {
      tags: [TAG],
      summary: "Request an appointment",
      description:
        "**Patient**: books for themselves. **Receptionist / super admin**: books on behalf of a patient (`patientId`). " +
        "`specialty` is the patient's requirement (e.g. `opd`); a preferred doctor is optional. Starts as `requested`.",
      security: secured,
      requestBody: jsonBody("CreateAppointmentRequest"),
      responses: { 201: jsonResponse("Created", appointmentEnvelope), ...commonErrors, 404: errorResponse("Patient not found") },
    },
    get: {
      tags: [TAG],
      summary: "Reception queue (paginated)",
      security: secured,
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
        { name: "pageSize", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 10 } },
        { name: "search", in: "query", schema: { type: "string" } },
        { name: "status", in: "query", schema: ref("AppointmentStatus") },
        { name: "date", in: "query", schema: { type: "string", format: "date" } },
      ],
      responses: { 200: jsonResponse("Page of appointments", ref("AppointmentPage")), ...commonErrors },
    },
  },
  "/api/appointments/mine": {
    get: {
      tags: [TAG],
      summary: "My appointments (patient)",
      security: secured,
      responses: {
        200: jsonResponse("Appointments", {
          type: "object",
          properties: { appointments: { type: "array", items: ref("Appointment") } },
        }),
        ...commonErrors,
      },
    },
  },
  "/api/appointments/availability": {
    get: {
      tags: [TAG],
      summary: "Doctors of a specialty with availability on a date",
      description:
        "Unavailable when marked absent / on leave, covered by approved leave, or the date is not a duty day. " +
        "Includes the doctor's workload for that day.",
      security: secured,
      parameters: [
        { name: "specialty", in: "query", required: true, schema: ref("Specialty") },
        { name: "date", in: "query", required: true, schema: { type: "string", format: "date" } },
      ],
      responses: {
        200: jsonResponse("Doctors", {
          type: "object",
          properties: { doctors: { type: "array", items: ref("DoctorAvailability") } },
        }),
        ...commonErrors,
      },
    },
  },
  "/api/appointments/{id}/approve": {
    patch: {
      tags: [TAG],
      summary: "Assign a doctor and approve",
      description:
        "The doctor must match the required specialty and be available that day (409 otherwise). " +
        "An approved appointment can be re-assigned.",
      security: secured,
      parameters: [uuidParam("id", "Appointment id")],
      requestBody: jsonBody("ApproveAppointmentRequest"),
      responses: {
        200: jsonResponse("Approved", appointmentEnvelope),
        ...commonErrors,
        404: errorResponse("Appointment not found"),
        409: errorResponse("Doctor unavailable, or appointment already rejected/cancelled"),
      },
    },
  },
  "/api/appointments/{id}/reject": {
    patch: {
      tags: [TAG],
      summary: "Reject a requested appointment",
      security: secured,
      parameters: [uuidParam("id", "Appointment id")],
      requestBody: jsonBody("RejectAppointmentRequest", false),
      responses: {
        200: jsonResponse("Rejected", appointmentEnvelope),
        ...commonErrors,
        404: errorResponse("Appointment not found"),
        409: errorResponse("Appointment is not in requested state"),
      },
    },
  },
  "/api/appointments/{id}/cancel": {
    patch: {
      tags: [TAG],
      summary: "Cancel an appointment",
      description: "Patients cancel their own; receptionist / super admin cancel any.",
      security: secured,
      parameters: [uuidParam("id", "Appointment id")],
      responses: {
        200: jsonResponse("Cancelled", appointmentEnvelope),
        ...commonErrors,
        404: errorResponse("Appointment not found"),
        409: errorResponse("Already finished"),
      },
    },
  },
};
