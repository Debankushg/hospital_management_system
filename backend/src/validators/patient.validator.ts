import { patientListQuerySchema, updatePatientSchema } from "../schemas/patient.schema";
import { validate } from "./validate";

export const validatePatientListQuery = validate(patientListQuerySchema, "query");
export const validateUpdatePatient = validate(updatePatientSchema);
