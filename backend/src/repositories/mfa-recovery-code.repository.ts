import { and, eq, isNull } from "drizzle-orm";
import { db } from "../db";
import { mfaRecoveryCodes } from "../models";
import type { DbExecutor } from "../types/db.types";

export const mfaRecoveryCodeRepository = {
  deleteAllForUser(userId: string, ex: DbExecutor = db) {
    return ex.delete(mfaRecoveryCodes).where(eq(mfaRecoveryCodes.userId, userId));
  },

  /** Replaces all of a user's recovery codes with the given hashes. */
  async replaceForUser(userId: string, codeHashes: string[], ex: DbExecutor = db) {
    await ex.delete(mfaRecoveryCodes).where(eq(mfaRecoveryCodes.userId, userId));
    if (codeHashes.length) {
      await ex.insert(mfaRecoveryCodes).values(codeHashes.map((codeHash) => ({ userId, codeHash })));
    }
  },

  /** Atomically marks an unused code as used. Returns false if it does not exist or was already used. */
  async consume(userId: string, codeHash: string, ex: DbExecutor = db): Promise<boolean> {
    const rows = await ex
      .update(mfaRecoveryCodes)
      .set({ usedAt: new Date() })
      .where(
        and(
          eq(mfaRecoveryCodes.userId, userId),
          eq(mfaRecoveryCodes.codeHash, codeHash),
          isNull(mfaRecoveryCodes.usedAt),
        ),
      )
      .returning({ id: mfaRecoveryCodes.id });
    return rows.length > 0;
  },
};
