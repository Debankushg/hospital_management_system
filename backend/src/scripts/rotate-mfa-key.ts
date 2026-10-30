/**
 * Re-encrypts every stored MFA secret from the current MFA_ENCRYPTION_KEY (.env) to a new key.
 *
 *   1. openssl rand -hex 32                                   -> your new key
 *   2. NEW_MFA_ENCRYPTION_KEY=<new> npm run mfa:rotate-key           (dry run: only checks)
 *   3. NEW_MFA_ENCRYPTION_KEY=<new> npm run mfa:rotate-key -- --apply (re-encrypts, one transaction)
 *   4. Put the new key into .env as MFA_ENCRYPTION_KEY and restart the server.
 *
 * Back up the database first. Do not change .env before step 3, or existing MFA secrets become unreadable.
 */
import { eq, isNotNull } from "drizzle-orm";
import { env } from "../config/env";
import { db, pool } from "../db";
import { users } from "../models";
import { decryptWithKey, encryptWithKey } from "../utils/crypto.util";

async function main() {
  const oldKey = env.MFA_ENCRYPTION_KEY;
  const newKey = process.env.NEW_MFA_ENCRYPTION_KEY ?? "";
  const apply = process.argv.includes("--apply");

  if (!/^[0-9a-fA-F]{64}$/.test(newKey)) throw new Error("Set NEW_MFA_ENCRYPTION_KEY to 64 hex chars (openssl rand -hex 32)");
  if (newKey.toLowerCase() === oldKey.toLowerCase()) throw new Error("The new key is the same as the current key");
  if (/^0+$/.test(newKey)) throw new Error("Refusing an all-zeros key");

  const rows = await db.select({ id: users.id, email: users.email, secret: users.mfaSecretEnc }).from(users).where(isNotNull(users.mfaSecretEnc));

  // Decrypt everything with the old key first, so nothing is written if any secret is unreadable.
  const plain = rows.map((r) => {
    try {
      return { ...r, plain: decryptWithKey(r.secret!, oldKey) };
    } catch {
      throw new Error(`Cannot decrypt the secret of ${r.email} with the current key. Is .env still the original key?`);
    }
  });
  console.log(`${plain.length} MFA secret(s) readable with the current key.`);

  if (!apply) return console.log("Dry run only. Re-run with --apply to re-encrypt.");

  await db.transaction(async (tx) => {
    for (const r of plain) {
      await tx.update(users).set({ mfaSecretEnc: encryptWithKey(r.plain, newKey) }).where(eq(users.id, r.id));
    }
  });
  console.log(`Re-encrypted ${plain.length} secret(s). Now set MFA_ENCRYPTION_KEY in .env to the new key and restart.`);
}

main()
  .catch((e) => {
    console.error(e.message ?? e);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
