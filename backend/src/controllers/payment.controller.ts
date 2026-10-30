import type { ReceivablesQuery, StartCheckoutInput, SyncPaymentInput } from "../types/dto.types";
import { paymentService } from "../services";
import { asyncHandler } from "../utils/async-handler.util";

export const paymentController = {
  receivables: asyncHandler(async (req, res) => {
    res.json(await paymentService.receivables(req.query as unknown as ReceivablesQuery));
  }),

  summary: asyncHandler(async (_req, res) => {
    res.json(await paymentService.summary());
  }),

  checkout: asyncHandler(async (req, res) => {
    const { appointmentId } = req.body as StartCheckoutInput;
    res.status(201).json(await paymentService.startCheckout(req.user!, appointmentId));
  }),

  sync: asyncHandler(async (req, res) => {
    res.json(await paymentService.sync((req.body as SyncPaymentInput).sessionId));
  }),

  /** Raw body (Buffer) is required for the signature check. */
  webhook: asyncHandler(async (req, res) => {
    await paymentService.handleWebhook(req.body as Buffer, req.header("stripe-signature"));
    res.json({ received: true });
  }),
};
