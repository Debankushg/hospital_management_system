import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";
import { RECOVERY_CODE_COUNT } from "../config/constants";
import { env } from "../config/env";

/** AES-256-GCM with an explicit 64-hex-char key (used directly when rotating keys). */
export function encryptWithKey(plain: string, hexKey: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", Buffer.from(hexKey, "hex"), iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), enc].map((b) => b.toString("hex")).join(":");
}

export function decryptWithKey(payload: string, hexKey: string): string {
  const [iv, tag, enc] = payload.split(":").map((h) => Buffer.from(h, "hex"));
  const decipher = createDecipheriv("aes-256-gcm", Buffer.from(hexKey, "hex"), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString("utf8");
}

export const encrypt = (plain: string) => encryptWithKey(plain, env.MFA_ENCRYPTION_KEY);
export const decrypt = (payload: string) => decryptWithKey(payload, env.MFA_ENCRYPTION_KEY);

/** Recovery codes are high-entropy random, so a fast hash is sufficient. */
export const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

export function generateRecoveryCodes(n = RECOVERY_CODE_COUNT): string[] {
  return Array.from({ length: n }, () => {
    const hex = randomBytes(5).toString("hex");
    return `${hex.slice(0, 5)}-${hex.slice(5)}`;
  });
}
