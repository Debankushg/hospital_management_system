import { Router } from "express";
import adminRoutes from "./admin.routes";
import paymentRoutes from "./payment.routes";
import analyticsRoutes from "./analytics.routes";
import appointmentRoutes from "./appointment.routes";
import attendanceRoutes from "./attendance.routes";
import authRoutes from "./auth.routes";
import departmentRoutes from "./department.routes";
import doctorRoutes from "./doctor.routes";
import dutyRoutes from "./duty.routes";
import leaveRoutes from "./leave.routes";
import patientRoutes from "./patient.routes";
import prescriptionRoutes from "./prescription.routes";
import visitRoutes from "./visit.routes";
import userRoutes from "./user.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/admins", adminRoutes);
router.use("/department", departmentRoutes);
router.use("/staff", dutyRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/leaves", leaveRoutes);
router.use("/patients", patientRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/doctor", doctorRoutes);
router.use("/prescriptions", prescriptionRoutes);
router.use("/visits", visitRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/payments", paymentRoutes);

export default router;
