import { Router } from "express";
import { attendanceController } from "../controllers";
import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/rbac.middleware";
import { validateAttendanceQuery, validateMarkAttendance } from "../validators/attendance.validator";

const router = Router();
router.use(authenticate(), requireRole("super_admin", "admin"));

router.get("/", validateAttendanceQuery, attendanceController.sheet);
router.post("/", validateMarkAttendance, attendanceController.mark);

export default router;
