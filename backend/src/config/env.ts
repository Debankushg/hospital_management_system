import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  MFA_ENCRYPTION_KEY: z.string().regex(/^[0-9a-fA-F]{64}$/, "must be 64 hex chars"),
  UPLOAD_DIR: z.string().default("uploads"),
  MFA_ISSUER: z.string().default("HospitalManagement"),
  // Stripe is optional: without a secret key the payment endpoints answer 503.
  STRIPE_SECRET_KEY: z.string().startsWith("sk_").optional(),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_").optional(),
  STRIPE_CURRENCY: z.string().length(3).toLowerCase().default("inr"),
  /** Where Stripe sends the browser after checkout. */
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  SUPER_ADMIN_EMAIL: z.string().email().optional(),
  SUPER_ADMIN_PASSWORD: z.string().min(10).optional(),
  SUPER_ADMIN_NAME: z.string().default("Super Admin"),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid environment:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

// The all-zeros MFA key from .env.example is public knowledge: fine for local dev, never for real data.
if (/^0+$/.test(env.MFA_ENCRYPTION_KEY)) {
  if (env.NODE_ENV === "production") {
    console.error("MFA_ENCRYPTION_KEY is the all-zeros placeholder. Generate one with: openssl rand -hex 32");
    process.exit(1);
  }
  console.warn("⚠ MFA_ENCRYPTION_KEY is the all-zeros placeholder (ok for local dev only). See README: key rotation.");
}
