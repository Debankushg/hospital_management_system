import {
  loginSchema,
  mfaCodeSchema,
  mfaDisableSchema,
  mfaLoginSchema,
  registerSchema,
} from "../schemas/auth.schema";
import { validate } from "./validate";

export const validateRegister = validate(registerSchema);
export const validateLogin = validate(loginSchema);
export const validateMfaCode = validate(mfaCodeSchema);
export const validateMfaLogin = validate(mfaLoginSchema);
export const validateMfaDisable = validate(mfaDisableSchema);
/** Revealing the setup key needs the same proof as disabling MFA: password + current code. */
export const validateMfaReveal = validate(mfaDisableSchema);
