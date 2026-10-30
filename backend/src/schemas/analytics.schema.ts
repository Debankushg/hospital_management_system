import { z } from "zod";
import { isoDateSchema } from "./attendance.schema";

const dayCount = (a: string, b: string) => (Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000 + 1;

/** Date window for a chart. The client sends local dates so "today" matches the user's calendar. */
export const analyticsQuerySchema = z
  .object({
    from: isoDateSchema,
    to: isoDateSchema,
    groupBy: z.enum(["day", "month"]).default("day"),
  })
  .refine((v) => v.to >= v.from, { message: "to must not be before from", path: ["to"] })
  .refine((v) => dayCount(v.from, v.to) <= 400, { message: "Range is limited to 400 days", path: ["to"] });

export const attendanceCalendarQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Use YYYY-MM"),
  /** View another staff member (managers only). Omit for your own calendar. */
  userId: z.string().uuid().optional(),
  /** The viewer's local date, used to tell "not marked yet" from "future". */
  today: isoDateSchema.optional(),
});
