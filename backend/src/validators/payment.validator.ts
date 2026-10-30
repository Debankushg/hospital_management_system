import { receivablesQuerySchema, startCheckoutSchema, syncPaymentSchema } from "../schemas/payment.schema";
import { validate } from "./validate";

export const validateStartCheckout = validate(startCheckoutSchema);
export const validateSyncPayment = validate(syncPaymentSchema);
export const validateReceivablesQuery = validate(receivablesQuerySchema, "query");
