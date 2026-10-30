import { Router } from "express";
import { departmentController } from "../controllers";
import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/rbac.middleware";

const router = Router();
router.use(authenticate(), requireRole("super_admin", "admin"));

router.get("/overview", departmentController.overview);
router.get("/staff", departmentController.staff);

export default router;
