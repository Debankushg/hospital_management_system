import express, { Router } from "express";
import { consultationController } from "../controllers";
import { authenticate } from "../middleware/auth.middleware";
import { requireDoctor } from "../middleware/rbac.middleware";
import { validateDoctorPatientsQuery } from "../validators/consultation.validator";
import { validateIdParam } from "../validators/user.validator";

const router = Router();
router.use(authenticate(), requireDoctor);

// Patients assigned to the signed-in doctor.
router.get("/patients", validateDoctorPatientsQuery, consultationController.listPatients);
router.get("/appointments/:id", validateIdParam, consultationController.detail);

// The PDF is sent as the raw request body (Content-Type: application/pdf, max 5 MB).
router.post(
  "/appointments/:id/prescriptions",
  validateIdParam,
  express.raw({ type: "application/pdf", limit: "5mb" }),
  consultationController.addPrescription,
);
router.patch("/appointments/:id/check", validateIdParam, consultationController.check);

export default router;
