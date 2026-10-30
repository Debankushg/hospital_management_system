import { z } from "zod";
import { ATTENDANCE_STATUSES } from "../models/enums";

export const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

export const markAttendanceSchema = z.object({
  userId: z.string().uuid(),
  date: isoDateSchema,
  status: z.enum(ATTENDANCE_STATUSES),
  notes: z.string().max(500).optional(),
});

export const attendanceQuerySchema = z.object({ date: isoDateSchema });
