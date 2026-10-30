import { z } from "zod";
import { LEAVE_STATUSES, LEAVE_TYPES } from "../models/enums";
import { isoDateSchema } from "./attendance.schema";

export const MAX_LEAVE_DAYS = 90;

const dayCount = (start: string, end: string) =>
  (Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86_400_000 + 1;

const leaveFields = {
  leaveType: z.enum(LEAVE_TYPES),
  startDate: isoDateSchema,
  endDate: isoDateSchema,
  reason: z.string().max(500).optional(),
};

const validRange = (v: { startDate: string; endDate: string }) => v.endDate >= v.startDate;
const rangeIssue = { message: "End date must not be before start date", path: ["endDate"] };
const withinMax = (v: { startDate: string; endDate: string }) => dayCount(v.startDate, v.endDate) <= MAX_LEAVE_DAYS;
const maxIssue = { message: `A leave can span at most ${MAX_LEAVE_DAYS} days`, path: ["endDate"] };

/** Admin records leave for a staff member (approved immediately). */
export const createLeaveSchema = z
  .object({ userId: z.string().uuid(), ...leaveFields })
  .refine(validRange, rangeIssue)
  .refine(withinMax, maxIssue);

/** Staff member requests leave for themselves (starts as pending). */
export const requestLeaveSchema = z.object(leaveFields).refine(validRange, rangeIssue).refine(withinMax, maxIssue);

export const reviewLeaveSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  note: z.string().max(500).optional(),
});

export const leaveQuerySchema = z.object({
  userId: z.string().uuid().optional(),
  status: z.enum(LEAVE_STATUSES).optional(),
  from: isoDateSchema.optional(),
  to: isoDateSchema.optional(),
});
