import { checkedVisitsQuerySchema, doctorPatientsQuerySchema } from "../schemas/consultation.schema";
import { validate } from "./validate";

export const validateDoctorPatientsQuery = validate(doctorPatientsQuerySchema, "query");
export const validateCheckedVisitsQuery = validate(checkedVisitsQuerySchema, "query");
