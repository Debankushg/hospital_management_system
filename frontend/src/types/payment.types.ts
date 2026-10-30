import type { Appointment } from "./appointment.types";

export type PaymentStatus = "pending" | "paid" | "expired";

export interface Payment {
  id: string;
  status: PaymentStatus;
  amount: string;
  currency: string;
  sessionId: string;
  paidAt: string | null;
}

/** A checked visit with its payment state. */
export interface Receivable extends Appointment {
  currency: string;
  paymentStatus: "unpaid" | "pending" | "paid";
  payment: Payment | null;
}

export interface PaymentSummary {
  collected: string;
  paidCount: number;
  outstanding: string;
  unpaidCount: number;
  currency: string;
}

export interface CheckoutResponse {
  url: string;
  payment: Payment;
}
