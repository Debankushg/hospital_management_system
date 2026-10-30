import { analyticsQuerySchema, attendanceCalendarQuerySchema } from "../schemas/analytics.schema";
import { validate } from "./validate";

export const validateAnalyticsQuery = validate(analyticsQuerySchema, "query");
export const validateCalendarQuery = validate(attendanceCalendarQuerySchema, "query");
