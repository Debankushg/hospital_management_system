import { Router } from "express";
import { appointmentController } from "../controllers";
import { authenticate } from "../middleware/auth.middleware";
import { requirePatientOrReception, requireReception, requireRole } from "../middleware/rbac.middleware";
import {
  validateAppointmentListQuery,
  validateApproveAppointment,
  validateAvailabilityQuery,
  validateCreateAppointment,
  validateRejectAppointment,
} from "../validators/appointment.validator";
import { validateIdParam } from "../validators/user.validator";

const router = Router();
router.use(authenticate());

const reception = requireReception;

// Patients (for themselves) and reception staff (on behalf of a patient) create requests.
router.post("/", requirePatientOrReception, validateCreateAppointment, appointmentController.create);
router.get("/mine", requireRole("patient"), appointmentController.mine);

// Reception queue.
router.get("/", reception, validateAppointmentListQuery, appointmentController.list);
router.get("/availability", reception, validateAvailabilityQuery, appointmentController.availability);
router.patch("/:id/approve", reception, validateIdParam, validateApproveAppointment, appointmentController.approve);
router.patch("/:id/reject", reception, validateIdParam, validateRejectAppointment, appointmentController.reject);

// Patient cancels own; reception cancels any (checked in the service).
router.patch("/:id/cancel", validateIdParam, appointmentController.cancel);

export default router;
