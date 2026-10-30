import type Stripe from "stripe";
import { env } from "../config/env";
import { appointmentRepository, doctorProfileRepository, paymentRepository, userRepository } from "../repositories";
import type { Payment, User } from "../types/domain.types";
import type { ReceivablesQuery } from "../types/dto.types";
import { HttpError } from "../utils/http-error.util";
import { offsetOf, toPage } from "../utils/pagination.util";
import { getStripe, toMinorUnits } from "../utils/stripe.util";

/** Brings a stored payment in line with what Stripe says about its Checkout Session. */
async function applySession(session: Stripe.Checkout.Session): Promise<Payment | undefined> {
  if (session.payment_status === "paid") {
    const intent = typeof session.payment_intent === "string" ? session.payment_intent : (session.payment_intent?.id ?? null);
    await paymentRepository.markPaid(session.id, intent);
  } else if (session.status === "expired") {
    await paymentRepository.markExpired(session.id);
  }
  return paymentRepository.findBySessionId(session.id);
}

const publicPayment = (p: Payment) => ({
  id: p.id,
  status: p.status,
  amount: p.amount,
  currency: p.currency,
  sessionId: p.stripeSessionId,
  paidAt: p.paidAt,
});

export const paymentService = {
  /** Checked visits with their payment state (unpaid first by default). */
  async receivables(q: ReceivablesQuery) {
    const { rows, total } = await appointmentRepository.list({
      status: "checked",
      search: q.search,
      paid: q.status === "all" ? undefined : q.status === "paid",
      sort: "checked_desc",
      limit: q.pageSize,
      offset: offsetOf(q.page, q.pageSize),
    });
    const all = await paymentRepository.listByAppointmentIds(rows.map((r) => r.id));
    const items = rows.map((r) => {
      const mine = all.filter((p) => p.appointmentId === r.id);
      const shown = mine.find((p) => p.status === "paid") ?? mine.find((p) => p.status === "pending");
      return {
        ...r,
        currency: env.STRIPE_CURRENCY,
        paymentStatus: shown ? shown.status : ("unpaid" as const),
        payment: shown ? publicPayment(shown) : null,
      };
    });
    return toPage(items, total, q.page, q.pageSize);
  },

  async summary() {
    return { ...(await paymentRepository.summary()), currency: env.STRIPE_CURRENCY };
  },

  /** Starts (or resumes) a Stripe-hosted Checkout page for a checked visit. */
  async startCheckout(actor: User, appointmentId: string) {
    const stripe = getStripe();
    const appt = await appointmentRepository.findById(appointmentId);
    if (!appt || appt.status !== "checked") throw new HttpError(404, "Checked visit not found");
    // Visits checked before fees were snapshotted fall back to the doctor's current fee.
    const profile = appt.checkedFee == null && appt.doctorId ? await doctorProfileRepository.findByUser(appt.doctorId) : undefined;
    const fee = Number(appt.checkedFee ?? profile?.consultationFee ?? 0);
    if (!(fee > 0)) throw new HttpError(400, "This visit has no consultation fee to collect");

    const existing = await paymentRepository.listByAppointmentIds([appt.id]);
    if (existing.some((p) => p.status === "paid")) throw new HttpError(409, "This visit is already paid");

    // Reuse a Checkout page that is still open instead of creating duplicates.
    for (const p of existing.filter((x) => x.status === "pending")) {
      const session = await stripe.checkout.sessions.retrieve(p.stripeSessionId);
      if (session.status === "open" && session.url) return { payment: publicPayment(p), url: session.url };
      const updated = await applySession(session);
      if (updated?.status === "paid") throw new HttpError(409, "This visit is already paid");
    }

    const patient = await userRepository.findById(appt.patientId);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: appt.id,
      customer_email: patient?.email,
      metadata: { appointmentId: appt.id },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: env.STRIPE_CURRENCY,
            unit_amount: toMinorUnits(fee),
            product_data: {
              name: `Consultation – ${appt.specialty.toUpperCase()}`,
              description: `Visit on ${appt.appointmentDate}`,
            },
          },
        },
      ],
      success_url: `${env.FRONTEND_URL}/payments?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.FRONTEND_URL}/payments?checkout=cancelled`,
    });
    if (!session.url) throw new HttpError(502, "Stripe did not return a payment page");

    const payment = await paymentRepository.create({
      appointmentId: appt.id,
      patientId: appt.patientId,
      amount: fee.toFixed(2),
      currency: env.STRIPE_CURRENCY,
      stripeSessionId: session.id,
      createdBy: actor.id,
    });
    return { payment: publicPayment(payment), url: session.url };
  },

  /** Asks Stripe for the current state of a session (used after redirect and for the Refresh button). */
  async sync(sessionId: string) {
    const stored = await paymentRepository.findBySessionId(sessionId);
    if (!stored) throw new HttpError(404, "Payment not found");
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    const payment = await applySession(session);
    return { payment: publicPayment(payment ?? stored) };
  },

  /** Stripe webhook: verifies the signature, then applies Checkout events. */
  async handleWebhook(rawBody: Buffer, signature: string | undefined) {
    if (!env.STRIPE_WEBHOOK_SECRET) throw new HttpError(503, "Stripe webhook is not configured");
    if (!signature) throw new HttpError(400, "Missing Stripe signature");
    let event: Stripe.Event;
    try {
      event = getStripe().webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
    } catch {
      throw new HttpError(400, "Invalid Stripe signature");
    }
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
      case "checkout.session.expired":
        await applySession(event.data.object as Stripe.Checkout.Session);
        break;
      default:
        break;
    }
  },
};
