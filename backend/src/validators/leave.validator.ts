import { createLeaveSchema, leaveQuerySchema, requestLeaveSchema, reviewLeaveSchema } from "../schemas/leave.schema";
import { validate } from "./validate";

export const validateCreateLeave = validate(createLeaveSchema);
export const validateLeaveQuery = validate(leaveQuerySchema, "query");
export const validateRequestLeave = validate(requestLeaveSchema);
export const validateReviewLeave = validate(reviewLeaveSchema);
