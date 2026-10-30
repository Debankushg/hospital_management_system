import { commonErrors, errorResponse, jsonBody, jsonResponse, ref, secured, uuidParam } from "../helpers";

const TAG = "Users";

const userEnvelope = { type: "object", properties: { user: ref("PublicUser") } };

export const userPaths = {
  "/api/users": {
    post: {
      tags: [TAG],
      summary: "Create a user (doctor, receptionist, pathologist, accounts, patient)",
      description:
        "**super_admin**: any of these roles. **admin**: only roles covered by their assigned work areas. " +
        "Doctors require `specialty` and `licenseNo`.",
      security: secured,
      requestBody: jsonBody("CreateUserRequest"),
      responses: {
        201: jsonResponse("Created", userEnvelope),
        ...commonErrors,
        409: errorResponse("Email or license number already exists"),
      },
    },
    get: {
      tags: [TAG],
      summary: "List users",
      description: "Admins only see roles within their assigned areas.",
      security: secured,
      parameters: [{ name: "role", in: "query", schema: ref("Role") }],
      responses: {
        200: jsonResponse("Users", {
          type: "object",
          properties: { users: { type: "array", items: ref("PublicUser") } },
        }),
        ...commonErrors,
      },
    },
  },
  "/api/users/{id}": {
    delete: {
      tags: [TAG],
      summary: "Delete a user permanently (super admin only)",
      description:
        "Works for any user including admins. Removes the profile, MFA data, assignments, duty, attendance and " +
        "leave records too. You cannot delete yourself or another super admin. Use deactivate to keep the data.",
      security: secured,
      parameters: [uuidParam("id", "User id")],
      responses: {
        204: { description: "Deleted" },
        ...commonErrors,
        404: errorResponse("User not found"),
      },
    },
  },
  "/api/users/{id}/active": {
    patch: {
      tags: [TAG],
      summary: "Activate / deactivate a user",
      security: secured,
      parameters: [uuidParam("id", "User id")],
      requestBody: jsonBody("SetActiveRequest"),
      responses: {
        200: jsonResponse("Updated", userEnvelope),
        ...commonErrors,
        404: errorResponse("User not found"),
      },
    },
  },
  "/api/users/doctors": {
    get: {
      tags: [TAG],
      summary: "Doctor directory",
      description: "Active doctors, optionally filtered by specialty. Any signed-in user.",
      security: secured,
      parameters: [{ name: "specialty", in: "query", schema: ref("Specialty") }],
      responses: {
        200: jsonResponse("Doctors", {
          type: "object",
          properties: { doctors: { type: "array", items: ref("Doctor") } },
        }),
        401: commonErrors[401],
      },
    },
  },
};
