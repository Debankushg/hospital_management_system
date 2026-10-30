import { z } from "zod";
import { paginationQuerySchema } from "./pagination.schema";

export const startCheckoutSchema = z.object({ appointmentId: z.string().uuid() });

export const syncPaymentSchema = z.object({ sessionId: z.string().min(5).max(255) });

/** Checked visits with their payment state. */
export const receivablesQuerySchema = paginationQuerySchema.extend({
  status: z.enum(["all", "unpaid", "paid"]).default("unpaid"),
});
