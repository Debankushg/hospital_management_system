import type { z } from "zod";
import type { editPatientValidator } from "@/validators/patient.validator";
import type { bookAppointmentValidator } from "@/validators/appointment.validator";
import type {
  createAdminValidator,
  promoteUserValidator,
  updateAssignmentsValidator,
} from "@/validators/admin.validator";
import type {
  loginValidator,
  mfaCodeValidator,
  mfaDisableValidator,
  mfaVerifyValidator,
  registerValidator,
} from "@/validators/auth.validator";
import type { dutyValidator } from "@/validators/duty.validator";
import type { leaveRequestValidator, leaveValidator } from "@/validators/leave.validator";
import type { createUserValidator } from "@/validators/user.validator";

export type LoginFormValues = z.infer<typeof loginValidator>;
export type RegisterFormValues = z.infer<typeof registerValidator>;
export type MfaCodeFormValues = z.infer<typeof mfaCodeValidator>;
export type MfaVerifyFormValues = z.infer<typeof mfaVerifyValidator>;
export type MfaDisableFormValues = z.infer<typeof mfaDisableValidator>;
export type CreateUserFormValues = z.infer<typeof createUserValidator>;
export type CreateAdminFormValues = z.infer<typeof createAdminValidator>;
export type PromoteUserFormValues = z.infer<typeof promoteUserValidator>;
export type UpdateAssignmentsFormValues = z.infer<typeof updateAssignmentsValidator>;
export type DutyFormValues = z.infer<typeof dutyValidator>;
export type LeaveFormValues = z.infer<typeof leaveValidator>;
export type LeaveRequestFormValues = z.infer<typeof leaveRequestValidator>;
export type BookAppointmentFormValues = z.infer<typeof bookAppointmentValidator>;
export type EditPatientFormValues = z.infer<typeof editPatientValidator>;
