import { idParamSchema } from "../schemas/common.schema";
import {
  createUserSchema,
  doctorQuerySchema,
  listUsersQuerySchema,
  setActiveSchema,
} from "../schemas/user.schema";
import { validate } from "./validate";

export const validateCreateUser = validate(createUserSchema);
export const validateListUsers = validate(listUsersQuerySchema, "query");
export const validateSetActive = validate(setActiveSchema);
export const validateDoctorQuery = validate(doctorQuerySchema, "query");
export const validateIdParam = validate(idParamSchema, "params");
