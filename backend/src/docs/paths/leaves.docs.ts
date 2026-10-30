import { commonErrors, errorResponse, jsonBody, jsonResponse, ref, secured, uuidParam } from "../helpers";

const TAG = "Leave";

const leavesEnvelope = {
  type: "object",
  properties: { leaves: { type: "array", items: ref("Leave") } },
};

export const leavePaths = {
  "/api/leaves/request": {
    post: {
      tags: [TAG],
      summary: "Request leave (any staff member)",
      description:
        "Creates a **pending** request for the caller. An admin of their department (or the super admin, for admins) " +
        "approves or rejects it.",
      security: secured,
      requestBody: jsonBody("RequestLeaveRequest"),
      responses: {
        201: jsonResponse("Requested", { type: "object" }),
        400: commonErrors[400],
        401: commonErrors[401],
        403: errorResponse("Patients and the super admin cannot request leave"),
      },
    },
  },
  "/api/leaves/mine": {
    get: {
      tags: [TAG],
      summary: "My leave requests and their status",
      security: secured,
      responses: { 200: jsonResponse("Leaves", leavesEnvelope), 401: commonErrors[401] },
    },
  },
  "/api/leaves": {
    get: {
      tags: [TAG],
      summary: "List leave of staff I manage (admin)",
      security: secured,
      parameters: [
        { name: "status", in: "query", schema: ref("LeaveStatus") },
        { name: "userId", in: "query", schema: { type: "string", format: "uuid" } },
        { name: "from", in: "query", schema: { type: "string", format: "date" } },
        { name: "to", in: "query", schema: { type: "string", format: "date" } },
      ],
      responses: { 200: jsonResponse("Leaves", leavesEnvelope), ...commonErrors },
    },
    post: {
      tags: [TAG],
      summary: "Record leave for a staff member (admin)",
      description: "Approved immediately. The days are marked as `on_leave` in the attendance sheet.",
      security: secured,
      requestBody: jsonBody("CreateLeaveRequest"),
      responses: {
        201: jsonResponse("Recorded", { type: "object" }),
        ...commonErrors,
        404: errorResponse("User not found"),
      },
    },
  },
  "/api/leaves/{id}/review": {
    patch: {
      tags: [TAG],
      summary: "Approve or reject a pending leave request (admin)",
      description:
        "Only for staff in the admin's assigned areas. Approving marks every day of the leave as `on_leave` in the " +
        "attendance sheet.",
      security: secured,
      parameters: [uuidParam("id", "Leave id")],
      requestBody: jsonBody("ReviewLeaveRequest"),
      responses: {
        200: jsonResponse("Reviewed", { type: "object" }),
        ...commonErrors,
        404: errorResponse("Leave record not found"),
        409: errorResponse("Leave was already approved/rejected"),
      },
    },
  },
  "/api/leaves/{id}": {
    delete: {
      tags: [TAG],
      summary: "Delete a leave record / cancel own pending request",
      description: "Staff can cancel their own *pending* request. Admins can delete leave of staff they manage.",
      security: secured,
      parameters: [uuidParam("id", "Leave id")],
      responses: {
        204: { description: "Deleted" },
        ...commonErrors,
        404: errorResponse("Leave record not found"),
      },
    },
  },
};
