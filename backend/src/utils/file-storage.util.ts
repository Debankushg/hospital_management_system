import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { env } from "../config/env";

const root = path.resolve(env.UPLOAD_DIR, "prescriptions");

/** PDF files start with "%PDF-". Checked on the bytes, not just the Content-Type header. */
export const isPdf = (buf: Buffer) => buf.length > 5 && buf.subarray(0, 5).toString("latin1") === "%PDF-";

export async function savePrescriptionFile(buf: Buffer): Promise<string> {
  await fs.mkdir(root, { recursive: true });
  const storedName = `${randomUUID()}.pdf`;
  await fs.writeFile(path.join(root, storedName), buf, { flag: "wx" });
  return storedName;
}

export const prescriptionFilePath = (storedName: string) => path.join(root, path.basename(storedName));

export const deletePrescriptionFiles = (storedNames: string[]) =>
  Promise.all(storedNames.map((n) => fs.rm(prescriptionFilePath(n), { force: true })));

/** Makes a safe display name: no path parts, always ends with .pdf. */
export function safeFileName(raw: string | undefined): string {
  const base = path.basename(decodeURIComponent(raw ?? "").replace(/[\u0000-\u001f]/g, "")).slice(0, 120) || "prescription";
  return base.toLowerCase().endsWith(".pdf") ? base : `${base}.pdf`;
}
