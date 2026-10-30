import { z } from "zod";

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:MM (24h)");

export const dutyScheduleSchema = z
  .object({
    startTime: timeSchema,
    endTime: timeSchema,
    /** 0 = Sunday … 6 = Saturday */
    workDays: z
      .array(z.number().int().min(0).max(6))
      .min(1, "Select at least one day")
      .refine((d) => new Set(d).size === d.length, "Duplicate days"),
  })
  .refine((v) => v.startTime !== v.endTime, { message: "Start and end time must differ", path: ["endTime"] });
