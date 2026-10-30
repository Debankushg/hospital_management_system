import { LOCK_MINUTES, MAX_FAILED_ATTEMPTS } from "../config/constants";
import { userRepository } from "../repositories";
import type { User } from "../types/domain.types";
import { HttpError } from "../utils/http-error.util";

export const accountLockService = {
  assertNotLocked(user: User) {
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new HttpError(423, "Account temporarily locked. Try again later.");
    }
  },

  /** Counts a failed password/MFA attempt and locks the account once the limit is reached. */
  async recordFailure(user: User) {
    const attempts = user.failedAttempts + 1;
    const lock = attempts >= MAX_FAILED_ATTEMPTS;
    await userRepository.update(user.id, {
      failedAttempts: lock ? 0 : attempts,
      lockedUntil: lock ? new Date(Date.now() + LOCK_MINUTES * 60_000) : user.lockedUntil,
    });
  },

  async reset(userId: string) {
    await userRepository.update(userId, { failedAttempts: 0, lockedUntil: null });
  },
};
