import { commonErrors, errorResponse, jsonBody, jsonResponse, ref, secured } from "../helpers";

const TAG = "Payments (Stripe)";

const WHO =
  "Accounts staff, admins assigned the **Accounts management** department, and the super admin. " +
  "Everyone else gets 403. Card details are entered on Stripe's hosted page and never reach this server.";

const page = (item: object) => ({
  type: "object",
  properties: {
    items: { type: "array", items: item },
    page: { type: "integer" },
    pageSize: { type: "integer" },
    total: { type: "integer" },
    totalPages: { type: "integer" },
  },
});

export const paymentPaths = {
  "/api/payments/receivables": {
    get: {
      tags: [TAG],
      summary: "Checked visits with their payment status",
      description: `${WHO} \`status\`: unpaid (default), paid or all.`,
      security: secured,
      parameters: [
        { name: "status", in: "query", schema: { type: "string", enum: ["all", "unpaid", "paid"], default: "unpaid" } },
        { name: "search", in: "query", schema: { type: "string" } },
        { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
        { name: "pageSize", in: "query", schema: { type: "integer", minimum: 1, maximum: 100, default: 10 } },
      ],
      responses: { 200: jsonResponse("Page of visits", page(ref("Receivable"))), ...commonErrors },
    },
  },
  "/api/payments/summary": {
    get: {
      tags: [TAG],
      summary: "Money collected vs outstanding",
      description: WHO,
      security: secured,
      responses: { 200: jsonResponse("Totals", ref("PaymentSummary")), ...commonErrors },
    },
  },
  "/api/payments/checkout": {
    post: {
      tags: [TAG],
      summary: "Start a Stripe payment for a checked visit",
      description:
        `${WHO} Returns a Stripe Checkout \`url\`; open it so the client can pay. ` +
        "An already-open page is reused. 409 if the visit is already paid, 503 if Stripe is not configured.",
      security: secured,
      requestBody: jsonBody("StartCheckoutRequest"),
      responses: {
        201: jsonResponse("Checkout page", ref("CheckoutResponse")),
        404: errorResponse("Checked visit not found"),
        409: errorResponse("Already paid"),
        503: errorResponse("Stripe is not configured"),
        ...commonErrors,
      },
    },
  },
  "/api/payments/sync": {
    post: {
      tags: [TAG],
      summary: "Refresh a payment from Stripe",
      description: `${WHO} Call it after Stripe redirects back (\`session_id\`) or to refresh a pending payment. Safe to repeat.`,
      security: secured,
      requestBody: jsonBody("SyncPaymentRequest"),
      responses: {
        200: jsonResponse("Current payment", { type: "object", properties: { payment: ref("Payment") } }),
        404: errorResponse("Payment not found"),
        503: errorResponse("Stripe is not configured"),
        ...commonErrors,
      },
    },
  },
  "/api/payments/webhook": {
    post: {
      tags: [TAG],
      summary: "Stripe webhook (called by Stripe)",
      description:
        "No bearer token: authenticity is proven by the `Stripe-Signature` header (secret `STRIPE_WEBHOOK_SECRET`). " +
        "Handles `checkout.session.completed`, `checkout.session.async_payment_succeeded` and `checkout.session.expired`.",
      responses: {
        200: { description: "Event received" },
        400: errorResponse("Invalid or missing signature"),
        503: errorResponse("Webhook is not configured"),
      },
    },
  },
};
