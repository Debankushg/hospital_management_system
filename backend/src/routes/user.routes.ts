import { Router } from "express";
import { userController } from "../controllers";
import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/rbac.middleware";
import {
  validateCreateUser,
  validateDoctorQuery,
  validateIdParam,
  validateListUsers,
  validateSetActive,
} from "../validators/user.validator";

const router = Router();
router.use(authenticate());

// Directory of doctors, readable by any signed-in user (e.g. patients picking a specialist).
router.get("/doctors", validateDoctorQuery, userController.listDoctors);

// Management endpoints: super admin, or admin within assigned areas (enforced in the service).
router.post("/", requireRole("super_admin", "admin"), validateCreateUser, userController.create);
router.get("/", requireRole("super_admin", "admin"), validateListUsers, userController.list);
router.patch(
  "/:id/active",
  requireRole("super_admin", "admin"),
  validateIdParam,
  validateSetActive,
  userController.setActive,
);

// Permanent delete (any non-super-admin user, including admins): super admin only.
router.delete("/:id", requireRole("super_admin"), validateIdParam, userController.remove);

export default router;
