import { commonErrors, errorResponse, jsonBody, jsonResponse, ref, secured, uuidParam } from "../helpers";

const TAG = "Department & duty (admin)";

export const departmentPaths = {
  "/api/department/overview": {
    get: {
      tags: [TAG],
      summary: "My departments, members and duty times",
      description:
        "**admin**: the work areas assigned to them, each with its members. **super_admin**: every area. Admins appear only inside their own profession's department (`baseRole`), tagged e.g. Doctor, Admin, never under the other departments they administer. The response also lists `unplacedAdmins` (super admin only): admins with no profession set.",
      security: secured,
      responses: {
        200: jsonResponse("Departments", {
          type: "object",
          properties: { departments: { type: "array", items: ref("Department") } },
        }),
        401: commonErrors[401],
        403: commonErrors[403],
      },
    },
  },
  "/api/department/staff": {
    get: {
      tags: [TAG],
      summary: "Staff the caller manages",
      description: "Used for attendance and leave pickers. Excludes patients.",
      security: secured,
      responses: {
        200: jsonResponse("Staff", {
          type: "object",
          properties: { staff: { type: "array", items: ref("PublicUser") } },
        }),
        401: commonErrors[401],
        403: commonErrors[403],
      },
    },
  },
  "/api/staff/{userId}/duty": {
    get: {
      tags: [TAG],
      summary: "Get a staff member's duty schedule",
      security: secured,
      parameters: [uuidParam("userId", "Staff member id")],
      responses: {
        200: jsonResponse("Duty (null if not set)", {
          type: "object",
          properties: { duty: { allOf: [ref("Duty")], nullable: true } },
        }),
        ...commonErrors,
        404: errorResponse("User not found"),
      },
    },
    put: {
      tags: [TAG],
      summary: "Set / change a staff member's duty time",
      description: "Admins can only change duty for staff in their assigned areas.",
      security: secured,
      parameters: [uuidParam("userId", "Staff member id")],
      requestBody: jsonBody("DutyRequest"),
      responses: {
        200: jsonResponse("Saved", { type: "object", properties: { duty: ref("Duty") } }),
        ...commonErrors,
        404: errorResponse("User not found"),
      },
    },
  },
};
