import Stripe from "stripe";
import { env } from "../config/env";
import { HttpError } from "./http-error.util";

let client: Stripe | undefined;

/** The shared Stripe client; 503 when STRIPE_SECRET_KEY is not configured. */
export function getStripe(): Stripe {
  if (!env.STRIPE_SECRET_KEY) throw new HttpError(503, "Online payments are not configured on this server");
  return (client ??= new Stripe(env.STRIPE_SECRET_KEY));
}

/** Smallest currency unit (cents/paise) for a decimal amount string. */
export const toMinorUnits = (amount: string | number) => Math.round(Number(amount) * 100);
