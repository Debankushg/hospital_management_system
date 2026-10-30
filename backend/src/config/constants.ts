export const BCRYPT_ROUNDS = 12;

export const MAX_FAILED_ATTEMPTS = 5;
export const LOCK_MINUTES = 15;

export const RECOVERY_CODE_COUNT = 8;
export const TOTP_WINDOW = 1;

export const TOKEN_TTL = {
  mfa_pending: "5m",
  mfa_setup: "15m",
  full: "1h",
} as const;

export const AUTH_RATE_LIMIT = { windowMs: 15 * 60_000, limit: 30 };
