import { authenticator } from "otplib";
import QRCode from "qrcode";
import { TOTP_WINDOW } from "../config/constants";
import { env } from "../config/env";
import { db } from "../db";
import { mfaRecoveryCodeRepository, userRepository } from "../repositories";
import type { User } from "../types/domain.types";
import { decrypt, encrypt, generateRecoveryCodes, sha256 } from "../utils/crypto.util";
import { HttpError } from "../utils/http-error.util";
import { signToken } from "../utils/jwt.util";
import { verifyPassword } from "../utils/password.util";
import { accountLockService } from "./account-lock.service";

authenticator.options = { window: TOTP_WINDOW };

export const mfaService = {
  verifyTotp(user: User, code: string): boolean {
    return !!user.mfaSecretEnc && authenticator.check(code, decrypt(user.mfaSecretEnc));
  },

  verifyRecoveryCode(user: User, recoveryCode: string): Promise<boolean> {
    return mfaRecoveryCodeRepository.consume(user.id, sha256(recoveryCode.trim().toLowerCase()));
  },

  /** Generates a fresh secret (not active until confirmed via `enable`). */
  async beginSetup(user: User) {
    if (user.mfaEnabled) throw new HttpError(409, "MFA is already enabled");
    const secret = authenticator.generateSecret();
    await userRepository.update(user.id, { mfaSecretEnc: encrypt(secret) });
    const otpauthUrl = authenticator.keyuri(user.email, env.MFA_ISSUER, secret);
    return { secret, otpauthUrl, qrCodeDataUrl: await QRCode.toDataURL(otpauthUrl) };
  },

  /**
   * Shows the setup key of an account that already has MFA. Needs the password AND a current code, so
   * only someone who can already sign in can see it. Wrong answers count toward the account lockout.
   */
  async revealSecret(user: User, password: string, code: string) {
    accountLockService.assertNotLocked(user);
    if (!user.mfaEnabled || !user.mfaSecretEnc) throw new HttpError(400, "MFA is not enabled");

    const ok = (await verifyPassword(password, user.passwordHash)) && this.verifyTotp(user, code);
    if (!ok) {
      await accountLockService.recordFailure(user);
      throw new HttpError(401, "Incorrect password or code");
    }
    await accountLockService.reset(user.id);

    const secret = decrypt(user.mfaSecretEnc);
    const otpauthUrl = authenticator.keyuri(user.email, env.MFA_ISSUER, secret);
    return { secret, otpauthUrl, qrCodeDataUrl: await QRCode.toDataURL(otpauthUrl) };
  },

  async enable(user: User, code: string) {
    if (user.mfaEnabled) throw new HttpError(409, "MFA is already enabled");
    if (!user.mfaSecretEnc) throw new HttpError(400, "Start MFA setup first");
    if (!this.verifyTotp(user, code)) throw new HttpError(401, "Invalid MFA code");

    const recoveryCodes = generateRecoveryCodes();
    await db.transaction(async (tx) => {
      await userRepository.update(user.id, { mfaEnabled: true }, tx);
      await mfaRecoveryCodeRepository.replaceForUser(user.id, recoveryCodes.map(sha256), tx);
    });
    return { token: signToken(user.id, "full"), recoveryCodes };
  },

  async disable(user: User, password: string, code: string) {
    if (user.role !== "patient") throw new HttpError(403, "MFA is mandatory for staff accounts");
    if (!user.mfaEnabled) throw new HttpError(400, "MFA is not enabled");
    if (!(await verifyPassword(password, user.passwordHash))) throw new HttpError(401, "Invalid credentials");
    if (!this.verifyTotp(user, code)) throw new HttpError(401, "Invalid MFA code");

    await db.transaction(async (tx) => {
      await userRepository.update(user.id, { mfaEnabled: false, mfaSecretEnc: null }, tx);
      await mfaRecoveryCodeRepository.deleteAllForUser(user.id, tx);
    });
  },
};
