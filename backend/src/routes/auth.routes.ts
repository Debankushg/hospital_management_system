import { Router } from "express";
import { authController, mfaController } from "../controllers";
import { authenticate } from "../middleware/auth.middleware";
import { authRateLimiter } from "../middleware/rate-limit.middleware";
import {
  validateLogin,
  validateMfaCode,
  validateMfaDisable,
  validateMfaLogin,
  validateMfaReveal,
  validateRegister,
} from "../validators/auth.validator";

const router = Router();

/** Public self-registration: always creates a patient. Staff are created by admins. */
router.post("/register", authRateLimiter, validateRegister, authController.register);
router.post("/login", authRateLimiter, validateLogin, authController.login);
router.get("/me", authenticate(), authController.me);

// Second login step
router.post(
  "/mfa/verify-login",
  authRateLimiter,
  authenticate("mfa_pending"),
  validateMfaLogin,
  authController.verifyMfaLogin,
);

// Setup/enable accept a mfa_setup token (forced enrolment) or a full token (voluntary, e.g. patients).
router.post("/mfa/setup", authenticate("mfa_setup", "full"), mfaController.setup);
router.post(
  "/mfa/enable",
  authRateLimiter,
  authenticate("mfa_setup", "full"),
  validateMfaCode,
  mfaController.enable,
);
router.post("/mfa/secret", authRateLimiter, authenticate(), validateMfaReveal, mfaController.revealSecret);
router.post("/mfa/disable", authRateLimiter, authenticate(), validateMfaDisable, mfaController.disable);

export default router;
