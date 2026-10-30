import { z } from "zod";
import { LEAVE_TYPES } from "@/config/hr.config";

const dateValidator = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Select a date");

const MAX_DAYS = 90;
const spanDays = (start: string, end: string) =>
  (Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86_400_000 + 1;

/** Fields shared by "record leave" (admin) and "request leave" (staff). */
const leaveFields = {
  leaveType: z.enum(LEAVE_TYPES),
  startDate: dateValidator,
  endDate: dateValidator,
  reason: z.string().max(500).optional(),
};

const refineRange = <T extends z.ZodType<{ startDate: string; endDate: string }>>(schema: T) =>
  schema
    .refine((v) => v.endDate >= v.startDate, { message: "End date must not be before start date", path: ["endDate"] })
    .refine((v) => spanDays(v.startDate, v.endDate) <= MAX_DAYS, {
      message: `A leave can span at most ${MAX_DAYS} days`,
      path: ["endDate"],
    });

export const leaveRequestValidator = refineRange(z.object(leaveFields));

export const leaveValidator = refineRange(z.object({ userId: z.string().min(1, "Select a staff member"), ...leaveFields }));
