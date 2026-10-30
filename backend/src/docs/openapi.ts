import { schemas } from "./components/schemas";
import { securitySchemes } from "./components/security";
import { adminPaths } from "./paths/admins.docs";
import { analyticsPaths } from "./paths/analytics.docs";
import { appointmentPaths } from "./paths/appointments.docs";
import { attendancePaths } from "./paths/attendance.docs";
import { authPaths } from "./paths/auth.docs";
import { consultationPaths } from "./paths/consultation.docs";
import { departmentPaths } from "./paths/department.docs";
import { leavePaths } from "./paths/leaves.docs";
import { mfaPaths } from "./paths/mfa.docs";
import { patientPaths } from "./paths/patients.docs";
import { paymentPaths } from "./paths/payments.docs";
import { userPaths } from "./paths/users.docs";

/** Assembled OpenAPI 3 document. Add new modules by spreading their paths here. */
export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Hospital Management API",
    version: "1.0.0",
    description:
      "Registration, login with MFA (TOTP), and role-based management for a hospital system.\n\n" +
      "**How to authorize:** call `POST /api/auth/login`, finish MFA if required, then click " +
      "**Authorize** and paste the final `token`.",
  },
  servers: [{ url: "/", description: "Current server" }],
  tags: [
    { name: "Auth", description: "Registration and login" },
    { name: "MFA", description: "Multi-factor authentication" },
    { name: "Users", description: "Staff/patient management (role-restricted)" },
    { name: "Admins (super admin only)", description: "Create admins and assign their work areas" },
    { name: "Department & duty (admin)", description: "Assigned departments, members and duty times" },
    { name: "Attendance (admin)", description: "Mark staff attendance" },
    { name: "Leave", description: "Staff request leave; admins review it" },
    { name: "Patients (reception)", description: "Patient list for receptionists" },
    { name: "Appointments", description: "Request, assign a doctor and approve" },
    { name: "Doctor: my patients", description: "Assigned patients, prescriptions (PDF) and the check button" },
    { name: "Checked patients", description: "Checked list shared with reception and accounts" },
    { name: "Dashboard analytics", description: "Chart data and the attendance calendar" },
  ],
  paths: {
    ...authPaths,
    ...mfaPaths,
    ...userPaths,
    ...adminPaths,
    ...departmentPaths,
    ...attendancePaths,
    ...leavePaths,
    ...patientPaths,
    ...appointmentPaths,
    ...consultationPaths,
    ...analyticsPaths,
    ...paymentPaths,
  },
  components: { securitySchemes, schemas },
};
