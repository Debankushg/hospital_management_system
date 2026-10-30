import { Router } from "express";
import { dutyController } from "../controllers";
import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/rbac.middleware";
import { validateUserIdParam } from "../validators/admin.validator";
import { validateDutySchedule } from "../validators/duty.validator";

const router = Router();
router.use(authenticate(), requireRole("super_admin", "admin"));

router.get("/:userId/duty", validateUserIdParam, dutyController.get);
router.put("/:userId/duty", validateUserIdParam, validateDutySchedule, dutyController.set);

export default router;
