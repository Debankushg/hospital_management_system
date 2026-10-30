import type { Paginated } from "@/types/pagination.types";
import type { CheckoutResponse, Payment, PaymentSummary, Receivable } from "@/types/payment.types";
import { apiRequest } from "./api-client";

export interface ReceivablesParams {
  status: "all" | "unpaid" | "paid";
  search: string;
  page: number;
  pageSize: number;
}

export const paymentService = {
  receivables: (p: ReceivablesParams) =>
    apiRequest<Paginated<Receivable>>("/payments/receivables", {
      query: { status: p.status, search: p.search || undefined, page: String(p.page), pageSize: String(p.pageSize) },
    }),

  summary: () => apiRequest<PaymentSummary>("/payments/summary"),

  /** Creates a Stripe Checkout page for the visit; the caller redirects the browser to `url`. */
  startCheckout: (appointmentId: string) =>
    apiRequest<CheckoutResponse>("/payments/checkout", { method: "POST", body: { appointmentId } }),

  sync: (sessionId: string) =>
    apiRequest<{ payment: Payment }>("/payments/sync", { method: "POST", body: { sessionId } }),
};
