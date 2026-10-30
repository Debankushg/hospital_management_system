import { Router } from "express";
import { leaveController } from "../controllers";
import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/rbac.middleware";
import {
  validateCreateLeave,
  validateLeaveQuery,
  validateRequestLeave,
  validateReviewLeave,
} from "../validators/leave.validator";
import { validateIdParam } from "../validators/user.validator";

const router = Router();
router.use(authenticate());

// Any staff member: request leave and see their own requests.
router.post("/request", validateRequestLeave, leaveController.request);
router.get("/mine", leaveController.mine);

// Admins (within their areas) and super admin: list, record, approve/reject.
router.get("/", requireRole("super_admin", "admin"), validateLeaveQuery, leaveController.list);
router.post("/", requireRole("super_admin", "admin"), validateCreateLeave, leaveController.record);
router.patch(
  "/:id/review",
  requireRole("super_admin", "admin"),
  validateIdParam,
  validateReviewLeave,
  leaveController.review,
);

// Staff cancel their own pending request; admins delete (permission checked in the service).
router.delete("/:id", validateIdParam, leaveController.remove);

export default router;
