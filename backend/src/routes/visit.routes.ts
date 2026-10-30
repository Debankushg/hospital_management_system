import { Router } from "express";
import { consultationController } from "../controllers";
import { authenticate } from "../middleware/auth.middleware";
import { requireCheckedVisitsAccess } from "../middleware/rbac.middleware";
import { validateCheckedVisitsQuery } from "../validators/consultation.validator";

const router = Router();
router.use(authenticate(), requireCheckedVisitsAccess);

// Patients a doctor has checked: shared with reception and accounts.
router.get("/checked", validateCheckedVisitsQuery, consultationController.listChecked);

export default router;
