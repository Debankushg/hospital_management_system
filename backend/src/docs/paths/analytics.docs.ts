import { commonErrors, errorResponse, jsonResponse, secured } from "../helpers";

const TAG = "Dashboard analytics";

const range = [
  { name: "from", in: "query", required: true, schema: { type: "string", format: "date" } },
  { name: "to", in: "query", required: true, schema: { type: "string", format: "date" }, description: "At most 400 days after `from`" },
  { name: "groupBy", in: "query", schema: { type: "string", enum: ["day", "month"], default: "day" } },
];

const obj = (description: string) => jsonResponse(description, { type: "object" });

export const analyticsPaths = {
  "/api/analytics/patients": {
    get: {
      tags: [TAG],
      summary: "Patient volume chart (every signed-in user)",
      description:
        "Gap-free series of appointments per day/month split by status (`requested`, `approved`, `checked`, `cancelled`) plus new patient registrations. Aggregate counts only.",
      security: secured,
      parameters: range,
      responses: { 200: obj("Series and totals"), ...commonErrors },
    },
  },
  "/api/analytics/revenue": {
    get: {
      tags: [TAG],
      summary: "Revenue chart (reception, accounts, super admin)",
      description:
        "Revenue = consultation fee of **checked** visits, by visit date. The fee is stored when the doctor marks the patient as checked, so later fee changes do not rewrite history. Each bucket and the totals split it into `collected` (paid through Stripe) and `pending` (checked but not paid yet); `revenue` = collected + pending. Includes a breakdown by specialty.",
      security: secured,
      parameters: range,
      responses: { 200: obj("Series, by-specialty breakdown and totals"), ...commonErrors },
    },
  },
  "/api/analytics/doctors": {
    get: {
      tags: [TAG],
      summary: "Checked vs unchecked patients per doctor (doctors, super admin)",
      description: "`unchecked` = approved appointments not yet checked, within the window.",
      security: secured,
      parameters: range.slice(0, 2),
      responses: { 200: obj("Per-doctor counts"), ...commonErrors },
    },
  },
  "/api/analytics/attendance-calendar": {
    get: {
      tags: [TAG],
      summary: "Attendance calendar for one month",
      description:
        "Per day: status, note, approved leave and whether it is a duty day; plus a summary. Staff see their own calendar. Managers can pass `userId` for staff they manage (super admin: anyone except super admins). Patients and the super admin without `userId` get 400.",
      security: secured,
      parameters: [
        { name: "month", in: "query", required: true, schema: { type: "string", example: "2026-10" } },
        { name: "userId", in: "query", schema: { type: "string", format: "uuid" } },
        { name: "today", in: "query", schema: { type: "string", format: "date" }, description: "Viewer's local date (to compute 'not marked')" },
      ],
      responses: { 200: obj("Calendar"), ...commonErrors, 404: errorResponse("User not found") },
    },
  },
};
