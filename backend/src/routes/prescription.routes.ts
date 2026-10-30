import { Router } from "express";
import { consultationController } from "../controllers";
import { authenticate } from "../middleware/auth.middleware";
import { requireDoctor } from "../middleware/rbac.middleware";
import { validateIdParam } from "../validators/user.validator";

const router = Router();
router.use(authenticate());

// Access is decided in the service (patient, treating doctors, reception, super admin).
router.get("/:id/file", validateIdParam, consultationController.prescriptionFile);
router.delete("/:id", requireDoctor, validateIdParam, consultationController.removePrescription);

export default router;
