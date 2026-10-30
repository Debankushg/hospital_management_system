import { Router } from "express";
import { patientController } from "../controllers";
import { authenticate } from "../middleware/auth.middleware";
import { requireReception, requireReceptionAdmin } from "../middleware/rbac.middleware";
import { validatePatientListQuery, validateUpdatePatient } from "../validators/patient.validator";
import { validateIdParam } from "../validators/user.validator";

const router = Router();
router.use(authenticate());

// Reception staff: view and edit patients.
router.get("/", requireReception, validatePatientListQuery, patientController.list);
router.get("/:id", requireReception, validateIdParam, patientController.get);
router.patch("/:id", requireReception, validateIdParam, validateUpdatePatient, patientController.update);

// Only the admin of the reception department (or the super admin) may delete a patient.
router.delete("/:id", requireReceptionAdmin, validateIdParam, patientController.remove);

export default router;
