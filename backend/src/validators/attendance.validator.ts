import { attendanceQuerySchema, markAttendanceSchema } from "../schemas/attendance.schema";
import { validate } from "./validate";

export const validateMarkAttendance = validate(markAttendanceSchema);
export const validateAttendanceQuery = validate(attendanceQuerySchema, "query");
