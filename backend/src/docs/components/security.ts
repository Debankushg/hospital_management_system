export const securitySchemes = {
  bearerAuth: {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description:
      "JWT from the login flow. Which token is accepted depends on the endpoint: " +
      "`mfaToken` for /auth/mfa/verify-login, `setupToken` or full token for /auth/mfa/setup and /enable, " +
      "and the full `token` for everything else.",
  },
};
