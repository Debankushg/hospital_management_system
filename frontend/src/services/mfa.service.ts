import type { MfaEnableResponse, MfaSetupResponse } from "@/types/auth.types";
import { apiRequest } from "./api-client";

export const mfaService = {
  setup: (token: string) => apiRequest<MfaSetupResponse>("/auth/mfa/setup", { method: "POST", token }),

  enable: (token: string, code: string) =>
    apiRequest<MfaEnableResponse>("/auth/mfa/enable", { method: "POST", body: { code }, token }),

  /** Shows the setup key again; the server needs the password and a current code. */
  revealSecret: (password: string, code: string) =>
    apiRequest<MfaSetupResponse>("/auth/mfa/secret", { method: "POST", body: { password, code } }),

  disable: (password: string, code: string) =>
    apiRequest<void>("/auth/mfa/disable", { method: "POST", body: { password, code } }),
};
