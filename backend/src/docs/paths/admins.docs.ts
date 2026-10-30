import { commonErrors, errorResponse, jsonBody, jsonResponse, ref, secured, uuidParam } from "../helpers";

const TAG = "Admins (super admin only)";
const userId = uuidParam("userId", "User id");

const assignmentsEnvelope = {
  type: "object",
  properties: { assignments: { type: "array", items: ref("AssignmentView") } },
};

export const adminPaths = {
  "/api/admins": {
    get: {
      tags: [TAG],
      summary: "List admins with their assigned work",
      security: secured,
      responses: {
        200: jsonResponse("Admins", {
          type: "object",
          properties: { admins: { type: "array", items: ref("AdminWithAssignments") } },
        }),
        401: commonErrors[401],
        403: commonErrors[403],
      },
    },
    post: {
      tags: [TAG],
      summary: "Create a new admin and assign their work",
      description: "Each department has exactly one admin: areas held by another admin move to the new one (see `reassigned`).",
      security: secured,
      requestBody: jsonBody("CreateAdminRequest"),
      responses: {
        201: jsonResponse("Created", ref("AdminResult")),
        ...commonErrors,
        409: errorResponse("Email already exists"),
      },
    },
  },
  "/api/admins/{userId}/promote": {
    post: {
      tags: [TAG],
      summary: "Promote an existing user to admin",
      description: "Staff only (patients are rejected). Each department has one admin: areas held by another admin move to this one and are listed in `reassigned`.",
      security: secured,
      parameters: [userId],
      requestBody: jsonBody("AssignmentsRequest"),
      responses: {
        200: jsonResponse("Promoted", ref("AdminResult")),
        ...commonErrors,
        404: errorResponse("User not found"),
      },
    },
  },
  "/api/admins/{userId}/demote": {
    post: {
      tags: [TAG],
      summary: "Revoke admin rights",
      description: "Removes all assignments and moves the user to the given role.",
      security: secured,
      parameters: [userId],
      requestBody: jsonBody("DemoteRequest"),
      responses: {
        200: jsonResponse("Demoted", { type: "object", properties: { user: ref("PublicUser") } }),
        ...commonErrors,
        404: errorResponse("Admin not found"),
      },
    },
  },
  "/api/admins/{userId}/assignments": {
    get: {
      tags: [TAG],
      summary: "Get an admin's assigned work",
      security: secured,
      parameters: [userId],
      responses: {
        200: jsonResponse("Assignments", assignmentsEnvelope),
        ...commonErrors,
      },
    },
    put: {
      tags: [TAG],
      summary: "Replace an admin's assigned work",
      description: "Each department has exactly one admin: any area listed here that another admin holds is moved to this admin (see `reassigned`).",
      security: secured,
      parameters: [userId],
      requestBody: jsonBody("AssignmentsRequest"),
      responses: {
        200: jsonResponse("Updated", {
          type: "object",
          properties: {
            assignments: { type: "array", items: ref("Assignment") },
            reassigned: { type: "array", items: ref("ReassignedArea") },
          },
        }),
        ...commonErrors,
        404: errorResponse("Admin not found"),
      },
    },
  },
};
