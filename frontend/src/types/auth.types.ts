import type { PublicUser } from "./user.types";

/** Response of POST /auth/login – shape depends on `status`. */
export type LoginResult =
  | { status: "authenticated"; token: string; user: PublicUser }
  | { status: "mfa_required"; mfaToken: string }
  | { status: "mfa_setup_required"; setupToken: string };

export interface AuthTokenResponse {
  token: string;
  user: PublicUser;
}

export interface MfaSetupResponse {
  secret: string;
  otpauthUrl: string;
  qrCodeDataUrl: string;
}

export interface MfaEnableResponse {
  token: string;
  recoveryCodes: string[];
}
