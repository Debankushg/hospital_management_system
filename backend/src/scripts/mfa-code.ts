/**
 * Dev helper: prints the current MFA code for an account, so you can sign in without an authenticator app.
 *   npm run mfa:code -- user@example.com            prints the current code
 *   npm run mfa:code -- user@example.com --key      also prints the setup key (to add to an app / generator)
 * Reads the encrypted secret with the server's MFA_ENCRYPTION_KEY, so it only works for someone with
 * access to the server. Refuses to run in production.
 */
import { authenticator } from "otplib";
import { env } from "../config/env";
import { pool } from "../db";
import { userRepository } from "../repositories";
import { decrypt } from "../utils/crypto.util";

async function main() {
  if (env.NODE_ENV === "production") throw new Error("Disabled in production");
  const email = process.argv.slice(2).find((a) => !a.startsWith("--"));
  if (!email) throw new Error("Usage: npm run mfa:code -- <email>");

  const user = await userRepository.findByEmail(email);
  if (!user?.mfaSecretEnc) throw new Error(`No MFA secret for ${email}. Finish MFA setup first.`);

  const secret = decrypt(user.mfaSecretEnc);
  console.log(`${user.email}${user.mfaEnabled ? "" : " (MFA setup not confirmed yet)"}`);
  if (process.argv.includes("--key")) console.log(`Key:  ${secret}`);
  console.log(`Code: ${authenticator.generate(secret)}   (valid for ~${authenticator.timeRemaining()}s)`);
}

main()
  .catch((e) => {
    console.error(e.message ?? e);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
