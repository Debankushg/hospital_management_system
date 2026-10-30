import { z } from "zod";

const timeValidator = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Enter a valid time");

export const dutyValidator = z
  .object({
    startTime: timeValidator,
    endTime: timeValidator,
    workDays: z.array(z.number().int().min(0).max(6)).min(1, "Select at least one day"),
  })
  .refine((v) => v.startTime !== v.endTime, { message: "Start and end time must differ", path: ["endTime"] });
