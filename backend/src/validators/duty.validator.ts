import { dutyScheduleSchema } from "../schemas/duty.schema";
import { validate } from "./validate";

export const validateDutySchedule = validate(dutyScheduleSchema);
