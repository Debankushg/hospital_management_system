import type { AuthTokenResponse, LoginResult } from "@/types/auth.types";
import type { PublicUser } from "@/types/user.types";
import { apiRequest } from "./api-client";

export const authService = {
  register: (payload: Record<string, unknown>) =>
    apiRequest<{ user: PublicUser }>("/auth/register", { method: "POST", body: payload, token: null }),

  login: (email: string, password: string) =>
    apiRequest<LoginResult>("/auth/login", { method: "POST", body: { email, password }, token: null }),

  /** Login step 2: send exactly one of `code` or `recoveryCode`. */
  verifyMfaLogin: (mfaToken: string, body: { code?: string; recoveryCode?: string }) =>
    apiRequest<AuthTokenResponse>("/auth/mfa/verify-login", { method: "POST", body, token: mfaToken }),

  me: (token?: string) => apiRequest<{ user: PublicUser }>("/auth/me", { token }),
};
