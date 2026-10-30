import { commonErrors, errorResponse, jsonBody, jsonResponse, ref, secured } from "../helpers";

const TAG = "MFA";

export const mfaPaths = {
  "/api/auth/mfa/verify-login": {
    post: {
      tags: [TAG],
      summary: "Login – step 2 (TOTP or recovery code)",
      description: "Use the `mfaToken` from login as the Bearer token.",
      security: secured,
      requestBody: jsonBody("MfaLoginRequest"),
      responses: {
        200: jsonResponse("Authenticated", ref("AuthTokenResponse")),
        400: commonErrors[400],
        401: errorResponse("Invalid code or token"),
        423: errorResponse("Account temporarily locked"),
      },
    },
  },
  "/api/auth/mfa/setup": {
    post: {
      tags: [TAG],
      summary: "Start MFA enrolment",
      description:
        "Use the `setupToken` (staff, forced enrolment) or a full token (patient, voluntary). " +
        "Scan the QR code in an authenticator app, then call `/mfa/enable`.",
      security: secured,
      responses: {
        200: jsonResponse("Secret and QR code", ref("MfaSetupResponse")),
        401: commonErrors[401],
        409: errorResponse("MFA already enabled"),
      },
    },
  },
  "/api/auth/mfa/enable": {
    post: {
      tags: [TAG],
      summary: "Confirm MFA enrolment",
      description: "Returns a full token and one-time recovery codes (shown only once).",
      security: secured,
      requestBody: jsonBody("MfaCodeRequest"),
      responses: {
        200: jsonResponse("MFA enabled", ref("MfaEnableResponse")),
        400: commonErrors[400],
        401: errorResponse("Invalid code"),
        409: errorResponse("MFA already enabled"),
      },
    },
  },
  "/api/auth/mfa/secret": {
    post: {
      tags: [TAG],
      summary: "Show my MFA setup key again",
      description:
        "For accounts that already have MFA. Requires the password **and** a current 6-digit code, so the key is never shown to someone who cannot already sign in. Wrong answers count toward the account lockout. Use it to add the same key to another device or app.",
      security: secured,
      requestBody: jsonBody("MfaDisableRequest"),
      responses: {
        200: jsonResponse("Key and QR code", ref("MfaSetupResponse")),
        400: errorResponse("MFA is not enabled"),
        401: errorResponse("Incorrect password or code"),
        423: errorResponse("Account temporarily locked"),
      },
    },
  },
  "/api/auth/mfa/disable": {
    post: {
      tags: [TAG],
      summary: "Disable MFA (patients only)",
      description: "MFA is mandatory for staff roles.",
      security: secured,
      requestBody: jsonBody("MfaDisableRequest"),
      responses: {
        204: { description: "MFA disabled" },
        400: commonErrors[400],
        401: errorResponse("Invalid password or code"),
        403: errorResponse("MFA is mandatory for staff accounts"),
      },
    },
  },
};
