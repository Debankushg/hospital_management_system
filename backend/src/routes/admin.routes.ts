import { Router } from "express";
import { adminController } from "../controllers";
import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/rbac.middleware";
import {
  validateAdminWork,
  validateCreateAdmin,
  validateDemoteAdmin,
  validateUserIdParam,
} from "../validators/admin.validator";

const router = Router();
router.use(authenticate(), requireRole("super_admin"));

router.get("/", adminController.list);
router.post("/", validateCreateAdmin, adminController.create);

router.post("/:userId/promote", validateUserIdParam, validateAdminWork, adminController.promote);
router.post("/:userId/demote", validateUserIdParam, validateDemoteAdmin, adminController.demote);
router.get("/:userId/assignments", validateUserIdParam, adminController.getAssignments);
router.put(
  "/:userId/assignments",
  validateUserIdParam,
  validateAdminWork,
  adminController.replaceAssignments,
);

export default router;
