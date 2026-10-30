import { commonErrors, errorResponse, jsonBody, jsonResponse, ref, secured } from "../helpers";

const TAG = "Attendance (admin)";

export const attendancePaths = {
  "/api/attendance": {
    get: {
      tags: [TAG],
      summary: "Daily attendance sheet",
      description: "All managed staff with their attendance for the date (`attendance` is null if not marked).",
      security: secured,
      parameters: [
        { name: "date", in: "query", required: true, schema: { type: "string", format: "date" } },
      ],
      responses: {
        200: jsonResponse("Sheet", {
          type: "object",
          properties: {
            date: { type: "string", format: "date" },
            entries: { type: "array", items: ref("AttendanceEntry") },
          },
        }),
        ...commonErrors,
      },
    },
    post: {
      tags: [TAG],
      summary: "Mark (or change) attendance",
      description: "Creates or overwrites the record for the staff member and date. Future dates are rejected.",
      security: secured,
      requestBody: jsonBody("MarkAttendanceRequest"),
      responses: {
        201: jsonResponse("Saved", { type: "object" }),
        ...commonErrors,
        404: errorResponse("User not found"),
      },
    },
  },
};
