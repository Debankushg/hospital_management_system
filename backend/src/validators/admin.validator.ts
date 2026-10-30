import { createAdminSchema, demoteAdminSchema, updateAdminWorkSchema } from "../schemas/admin.schema";
import { userIdParamSchema } from "../schemas/common.schema";
import { validate } from "./validate";

export const validateCreateAdmin = validate(createAdminSchema);
export const validateAdminWork = validate(updateAdminWorkSchema);
export const validateDemoteAdmin = validate(demoteAdminSchema);
export const validateUserIdParam = validate(userIdParamSchema, "params");
