import { commonErrors, errorResponse, jsonBody, jsonResponse, ref, secured } from "../helpers";

const TAG = "Auth";

export const authPaths = {
  "/api/auth/register": {
    post: {
      tags: [TAG],
      summary: "Register as a patient",
      description: "Public self-registration. Always creates a `patient`; staff accounts are created by admins.",
      requestBody: jsonBody("RegisterRequest"),
      responses: {
        201: jsonResponse("Registered", {
          type: "object",
          properties: { user: ref("PublicUser") },
        }),
        400: commonErrors[400],
        409: errorResponse("Email already registered"),
      },
    },
  },
  "/api/auth/login": {
    post: {
      tags: [TAG],
      summary: "Login – step 1 (password)",
      description:
        "Returns one of three statuses:\n" +
        "- `authenticated` – patient without MFA, `token` is ready to use\n" +
        "- `mfa_required` – call `/api/auth/mfa/verify-login` with `mfaToken`\n" +
        "- `mfa_setup_required` – staff must enrol MFA using `setupToken` (`/mfa/setup` then `/mfa/enable`)",
      requestBody: jsonBody("LoginRequest"),
      responses: {
        200: jsonResponse("Login result", ref("LoginResponse")),
        400: commonErrors[400],
        401: errorResponse("Invalid credentials"),
        403: errorResponse("Account deactivated"),
        423: errorResponse("Account temporarily locked"),
      },
    },
  },
  "/api/auth/me": {
    get: {
      tags: [TAG],
      summary: "Current user",
      description:
        "Includes `capabilities` (`reception`, `editPatients`, `deletePatients`) so the UI knows what to offer.",
      security: secured,
      responses: {
        200: jsonResponse("Current user", { type: "object", properties: { user: ref("PublicUser") } }),
        401: commonErrors[401],
      },
    },
  },
};
