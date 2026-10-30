import { z } from "zod";
import { isoDateSchema } from "./attendance.schema";
import { paginationQuerySchema } from "./pagination.schema";

/** Doctor's list of assigned patients. */
export const doctorPatientsQuerySchema = paginationQuerySchema.extend({
  status: z.enum(["approved", "checked"]).optional(),
  date: isoDateSchema.optional(),
});

/** List of checked patients shared with reception and accounts. */
export const checkedVisitsQuerySchema = paginationQuerySchema.extend({
  date: isoDateSchema.optional(),
});
