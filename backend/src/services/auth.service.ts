import { MFA_MANDATORY_ROLES } from "../config/permissions.config";
import { db } from "../db";
import { patientProfileRepository, userRepository } from "../repositories";
import type { User } from "../types/domain.types";
import type { MfaLoginInput, RegisterInput } from "../types/dto.types";
import { HttpError } from "../utils/http-error.util";
import { signToken } from "../utils/jwt.util";
import { DUMMY_HASH, hashPassword, verifyPassword } from "../utils/password.util";
import { toPublicUser } from "../utils/user.mapper";
import { accountLockService } from "./account-lock.service";
import { permissionService } from "./permission.service";
import { mfaService } from "./mfa.service";

/** Public user plus what the UI may offer them (reception access, patient deletion…). */
export const toSessionUser = async (user: User) => ({
  ...toPublicUser(user),
  capabilities: await permissionService.capabilitiesOf(user),
});

export const authService = {
  async registerPatient(input: RegisterInput) {
    const passwordHash = await hashPassword(input.password);
    return db.transaction(async (tx) => {
      const user = await userRepository.create(
        {
          email: input.email,
          fullName: input.fullName,
          phone: input.phone,
          passwordHash,
          role: "patient",
        },
        tx,
      );
      await patientProfileRepository.create(
        {
          userId: user.id,
          dateOfBirth: input.dateOfBirth,
          gender: input.gender,
          bloodGroup: input.bloodGroup,
          address: input.address,
        },
        tx,
      );
      return toPublicUser(user);
    });
  },

  /** Step 1: password check. The returned status tells the client what to do next. */
  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      await verifyPassword(password, DUMMY_HASH);
      throw new HttpError(401, "Invalid credentials");
    }
    accountLockService.assertNotLocked(user);
    if (!(await verifyPassword(password, user.passwordHash))) {
      await accountLockService.recordFailure(user);
      throw new HttpError(401, "Invalid credentials");
    }
    if (!user.isActive) throw new HttpError(403, "Account is deactivated");

    if (user.mfaEnabled) {
      return { status: "mfa_required" as const, mfaToken: signToken(user.id, "mfa_pending") };
    }
    if (MFA_MANDATORY_ROLES.includes(user.role)) {
      return { status: "mfa_setup_required" as const, setupToken: signToken(user.id, "mfa_setup") };
    }
    await accountLockService.reset(user.id);
    return { status: "authenticated" as const, token: signToken(user.id, "full"), user: await toSessionUser(user) };
  },

  /** Step 2: TOTP code or one-time recovery code. */
  async verifyMfaLogin(user: User, input: MfaLoginInput) {
    accountLockService.assertNotLocked(user);
    if (!user.mfaEnabled) throw new HttpError(400, "MFA is not enabled");

    const ok = input.code
      ? mfaService.verifyTotp(user, input.code)
      : input.recoveryCode
        ? await mfaService.verifyRecoveryCode(user, input.recoveryCode)
        : false;

    if (!ok) {
      await accountLockService.recordFailure(user);
      throw new HttpError(401, "Invalid MFA code");
    }
    await accountLockService.reset(user.id);
    return { token: signToken(user.id, "full"), user: await toSessionUser(user) };
  },
};
