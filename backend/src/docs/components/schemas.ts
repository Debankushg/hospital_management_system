import { ADMIN_AREAS, APPOINTMENT_STATUSES, ATTENDANCE_STATUSES, LEAVE_STATUSES, LEAVE_TYPES, ROLES, SPECIALTIES } from "../../models/enums";
import { CREATABLE_ROLES } from "../../schemas/user.schema";
import { ref } from "../helpers";

const uuid = { type: "string", format: "uuid" };
const email = { type: "string", format: "email", example: "jane@hospital.com" };
const password = {
  type: "string",
  minLength: 10,
  description: "Min 10 chars with upper, lower, digit and symbol",
  example: "Str0ng@Passw0rd",
};
const totp = { type: "string", pattern: "^\\d{6}$", example: "123456" };

export const schemas = {
  // ---------- shared ----------
  Error: {
    type: "object",
    properties: {
      error: { type: "string", example: "Validation failed" },
      details: { type: "object", additionalProperties: true },
    },
  },
  Role: { type: "string", enum: [...ROLES] },
  Specialty: { type: "string", enum: [...SPECIALTIES] },
  AdminArea: { type: "string", enum: [...ADMIN_AREAS] },
  PublicUser: {
    type: "object",
    properties: {
      id: uuid,
      email,
      fullName: { type: "string" },
      phone: { type: "string", nullable: true },
      role: ref("Role"),
      baseRole: { allOf: [ref("Role")], nullable: true, description: "Admins only: the staff role they work as" },
      isActive: { type: "boolean" },
      mfaEnabled: { type: "boolean" },
      createdAt: { type: "string", format: "date-time" },
    },
  },

  // ---------- auth ----------
  RegisterRequest: {
    type: "object",
    required: ["email", "password", "fullName"],
    properties: {
      email,
      password,
      fullName: { type: "string", example: "Jane Doe" },
      phone: { type: "string" },
      dateOfBirth: { type: "string", format: "date", example: "1995-04-21" },
      gender: { type: "string", enum: ["male", "female", "other"] },
      bloodGroup: { type: "string", enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
      address: { type: "string" },
    },
  },
  LoginRequest: {
    type: "object",
    required: ["email", "password"],
    properties: { email, password: { type: "string" } },
  },
  LoginResponse: {
    description: "Shape depends on `status`.",
    oneOf: [
      {
        type: "object",
        properties: {
          status: { type: "string", enum: ["authenticated"] },
          token: { type: "string" },
          user: ref("PublicUser"),
        },
      },
      {
        type: "object",
        properties: { status: { type: "string", enum: ["mfa_required"] }, mfaToken: { type: "string" } },
      },
      {
        type: "object",
        properties: {
          status: { type: "string", enum: ["mfa_setup_required"] },
          setupToken: { type: "string" },
        },
      },
    ],
  },
  MfaLoginRequest: {
    type: "object",
    description: "Provide exactly one of `code` or `recoveryCode`.",
    properties: { code: totp, recoveryCode: { type: "string", example: "a1b2c-d3e4f" } },
  },
  AuthTokenResponse: {
    type: "object",
    properties: { token: { type: "string" }, user: ref("PublicUser") },
  },
  MfaSetupResponse: {
    type: "object",
    properties: {
      secret: { type: "string" },
      otpauthUrl: { type: "string" },
      qrCodeDataUrl: { type: "string", description: "PNG data URL to render as a QR code" },
    },
  },
  MfaCodeRequest: { type: "object", required: ["code"], properties: { code: totp } },
  MfaEnableResponse: {
    type: "object",
    properties: {
      token: { type: "string" },
      recoveryCodes: { type: "array", items: { type: "string" }, description: "Shown once – store safely" },
    },
  },
  MfaDisableRequest: {
    type: "object",
    required: ["password", "code"],
    properties: { password: { type: "string" }, code: totp },
  },

  // ---------- users ----------
  CreateUserRequest: {
    type: "object",
    required: ["email", "password", "fullName", "role"],
    properties: {
      email,
      password,
      fullName: { type: "string" },
      phone: { type: "string" },
      role: { type: "string", enum: [...CREATABLE_ROLES] },
      specialty: { allOf: [ref("Specialty")], description: "Required when role is doctor" },
      licenseNo: { type: "string", description: "Required when role is doctor" },
      consultationFee: { type: "number", minimum: 0 },
    },
  },
  SetActiveRequest: {
    type: "object",
    required: ["isActive"],
    properties: { isActive: { type: "boolean" } },
  },
  Doctor: {
    type: "object",
    properties: {
      id: uuid,
      fullName: { type: "string" },
      specialty: ref("Specialty"),
      consultationFee: { type: "string", nullable: true, example: "500.00" },
    },
  },

  // ---------- admins ----------
  Assignment: {
    type: "object",
    required: ["area"],
    properties: { area: ref("AdminArea"), notes: { type: "string", maxLength: 500 } },
  },
  AssignmentView: {
    type: "object",
    properties: {
      area: ref("AdminArea"),
      notes: { type: "string", nullable: true },
      createdAt: { type: "string", format: "date-time" },
    },
  },
  AssignmentsRequest: {
    type: "object",
    required: ["assignments"],
    properties: {
      assignments: { type: "array", minItems: 1, items: ref("Assignment") },
      baseRole: {
        type: "string",
        enum: ["doctor", "receptionist", "pathologist", "accounts"],
        description:
          "The admin's profession (department listing, e.g. 'Doctor, Admin'). Promote fills it from the user's previous role if omitted (required for patients). Cannot be cleared.",
      },
    },
  },
  CreateAdminRequest: {
    type: "object",
    required: ["email", "password", "fullName", "assignments", "baseRole"],
    properties: {
      email,
      password,
      fullName: { type: "string" },
      phone: { type: "string" },
      assignments: { type: "array", minItems: 1, items: ref("Assignment") },
      baseRole: {
        type: "string",
        enum: ["doctor", "receptionist", "pathologist", "accounts"],
        description: "Required: the profession this admin works as",
      },
    },
  },
  AdminWithAssignments: {
    allOf: [
      ref("PublicUser"),
      { type: "object", properties: { assignments: { type: "array", items: ref("AssignmentView") } } },
    ],
  },
  AdminResult: {
    type: "object",
    properties: {
      user: ref("PublicUser"),
      assignments: { type: "array", items: ref("Assignment") },
      reassigned: { type: "array", items: ref("ReassignedArea") },
    },
  },
  ReassignedArea: {
    type: "object",
    description: "A department taken from another admin by this change (one admin per department).",
    properties: { area: ref("AdminArea"), fromAdminId: { type: "string", format: "uuid" }, fromAdminName: { type: "string" } },
  },
  DemoteRequest: {
    type: "object",
    required: ["role"],
    properties: { role: { type: "string", enum: ["receptionist", "pathologist", "accounts", "patient"] } },
  },

  // ---------- department / duty / attendance / leave ----------
  Duty: {
    type: "object",
    properties: {
      userId: uuid,
      startTime: { type: "string", example: "09:00" },
      endTime: { type: "string", example: "17:00" },
      workDays: { type: "array", items: { type: "integer", minimum: 0, maximum: 6 }, description: "0 = Sunday … 6 = Saturday" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  DutyRequest: {
    type: "object",
    required: ["startTime", "endTime", "workDays"],
    properties: {
      startTime: { type: "string", example: "09:00" },
      endTime: { type: "string", example: "17:00" },
      workDays: { type: "array", minItems: 1, items: { type: "integer", minimum: 0, maximum: 6 }, example: [1, 2, 3, 4, 5] },
    },
  },
  DepartmentMember: {
    allOf: [
      ref("PublicUser"),
      { type: "object", properties: { duty: { allOf: [ref("Duty")], nullable: true } } },
    ],
  },
  Department: {
    type: "object",
    properties: {
      area: ref("AdminArea"),
      role: ref("Role"),
      notes: { type: "string", nullable: true },
      members: { type: "array", items: ref("DepartmentMember") },
    },
  },
  AttendanceStatus: { type: "string", enum: [...ATTENDANCE_STATUSES] },
  MarkAttendanceRequest: {
    type: "object",
    required: ["userId", "date", "status"],
    properties: {
      userId: uuid,
      date: { type: "string", format: "date", example: "2026-10-30" },
      status: ref("AttendanceStatus"),
      notes: { type: "string", maxLength: 500 },
    },
  },
  AttendanceEntry: {
    type: "object",
    properties: {
      user: ref("PublicUser"),
      attendance: {
        nullable: true,
        type: "object",
        properties: { status: ref("AttendanceStatus"), notes: { type: "string", nullable: true } },
      },
    },
  },
  LeaveType: { type: "string", enum: [...LEAVE_TYPES] },
  CreateLeaveRequest: {
    type: "object",
    required: ["userId", "leaveType", "startDate", "endDate"],
    properties: {
      userId: uuid,
      leaveType: ref("LeaveType"),
      startDate: { type: "string", format: "date" },
      endDate: { type: "string", format: "date" },
      reason: { type: "string", maxLength: 500 },
    },
  },
  Leave: {
    type: "object",
    properties: {
      id: uuid,
      userId: uuid,
      userName: { type: "string" },
      userRole: ref("Role"),
      leaveType: ref("LeaveType"),
      startDate: { type: "string", format: "date" },
      endDate: { type: "string", format: "date" },
      reason: { type: "string", nullable: true },
      status: ref("LeaveStatus"),
      reviewNote: { type: "string", nullable: true },
      reviewedAt: { type: "string", format: "date-time", nullable: true },
      createdAt: { type: "string", format: "date-time" },
    },
  },
  LeaveStatus: { type: "string", enum: [...LEAVE_STATUSES] },
  RequestLeaveRequest: {
    type: "object",
    required: ["leaveType", "startDate", "endDate"],
    properties: {
      leaveType: ref("LeaveType"),
      startDate: { type: "string", format: "date" },
      endDate: { type: "string", format: "date", description: "At most 90 days after startDate" },
      reason: { type: "string", maxLength: 500 },
    },
  },
  ReviewLeaveRequest: {
    type: "object",
    required: ["status"],
    properties: {
      status: { type: "string", enum: ["approved", "rejected"] },
      note: { type: "string", maxLength: 500 },
    },
  },

  // ---------- patients & appointments ----------
  Patient: {
    allOf: [
      ref("PublicUser"),
      {
        type: "object",
        properties: {
          dateOfBirth: { type: "string", format: "date", nullable: true },
          gender: { type: "string", nullable: true },
          bloodGroup: { type: "string", nullable: true },
          address: { type: "string", nullable: true },
        },
      },
    ],
  },
  PatientPage: {
    type: "object",
    properties: {
      items: { type: "array", items: ref("Patient") },
      page: { type: "integer" },
      pageSize: { type: "integer" },
      total: { type: "integer" },
      totalPages: { type: "integer" },
    },
  },
  UpdatePatientRequest: {
    type: "object",
    description: "Any subset of fields. Send null to clear an optional field.",
    properties: {
      fullName: { type: "string" },
      phone: { type: "string", nullable: true },
      dateOfBirth: { type: "string", format: "date", nullable: true },
      gender: { type: "string", enum: ["male", "female", "other"], nullable: true },
      bloodGroup: { type: "string", enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], nullable: true },
      address: { type: "string", nullable: true },
    },
  },
  PaymentStatus: { type: "string", enum: ["pending", "paid", "expired"] },
  Payment: {
    type: "object",
    properties: {
      id: uuid,
      status: ref("PaymentStatus"),
      amount: { type: "string", example: "500.00" },
      currency: { type: "string", example: "inr" },
      sessionId: { type: "string" },
      paidAt: { type: "string", format: "date-time", nullable: true },
    },
  },
  Receivable: {
    type: "object",
    description: "A checked visit plus its payment state.",
    properties: {
      id: uuid,
      patientName: { type: "string" },
      patientEmail: { type: "string" },
      doctorName: { type: "string", nullable: true },
      specialty: ref("Specialty"),
      date: { type: "string", format: "date" },
      checkedAt: { type: "string", format: "date-time" },
      consultationFee: { type: "string", nullable: true },
      currency: { type: "string" },
      paymentStatus: { type: "string", enum: ["unpaid", "pending", "paid"] },
      payment: { ...ref("Payment"), nullable: true },
    },
  },
  PaymentSummary: {
    type: "object",
    properties: {
      collected: { type: "string" },
      paidCount: { type: "integer" },
      outstanding: { type: "string" },
      unpaidCount: { type: "integer" },
      currency: { type: "string" },
    },
  },
  StartCheckoutRequest: {
    type: "object",
    required: ["appointmentId"],
    properties: { appointmentId: uuid },
  },
  SyncPaymentRequest: {
    type: "object",
    required: ["sessionId"],
    properties: { sessionId: { type: "string", example: "cs_test_a1b2c3" } },
  },
  CheckoutResponse: {
    type: "object",
    properties: { url: { type: "string", format: "uri" }, payment: ref("Payment") },
  },
  AppointmentStatus: { type: "string", enum: [...APPOINTMENT_STATUSES] },
  Appointment: {
    type: "object",
    properties: {
      id: uuid,
      specialty: ref("Specialty"),
      date: { type: "string", format: "date" },
      reason: { type: "string", nullable: true },
      status: ref("AppointmentStatus"),
      note: { type: "string", nullable: true },
      createdAt: { type: "string", format: "date-time" },
      handledAt: { type: "string", format: "date-time", nullable: true },
      checkedAt: { type: "string", format: "date-time", nullable: true, description: "When the doctor marked the patient as checked" },
      prescriptionCount: { type: "integer" },
      consultationFee: { type: "string", nullable: true },
      patientId: uuid,
      patientName: { type: "string" },
      patientEmail: { type: "string" },
      patientPhone: { type: "string", nullable: true },
      requestedDoctorId: { ...uuid, nullable: true },
      requestedDoctorName: { type: "string", nullable: true },
      doctorId: { ...uuid, nullable: true },
      doctorName: { type: "string", nullable: true },
    },
  },
  AppointmentPage: {
    type: "object",
    properties: {
      items: { type: "array", items: ref("Appointment") },
      page: { type: "integer" },
      pageSize: { type: "integer" },
      total: { type: "integer" },
      totalPages: { type: "integer" },
    },
  },
  CreateAppointmentRequest: {
    type: "object",
    required: ["specialty", "date"],
    properties: {
      patientId: { ...uuid, description: "Required when a receptionist books for a patient; ignored for patients" },
      specialty: ref("Specialty"),
      preferredDoctorId: uuid,
      date: { type: "string", format: "date" },
      reason: { type: "string", maxLength: 500 },
    },
  },
  DoctorAvailability: {
    type: "object",
    properties: {
      id: uuid,
      fullName: { type: "string" },
      specialty: ref("Specialty"),
      consultationFee: { type: "string", nullable: true },
      duty: { allOf: [ref("Duty")], nullable: true },
      appointmentsThatDay: { type: "integer", description: "Approved appointments already on that date" },
      available: { type: "boolean" },
      reason: { type: "string", enum: ["absent", "on_leave", "not_on_duty"], nullable: true },
    },
  },
  ApproveAppointmentRequest: {
    type: "object",
    required: ["doctorId"],
    properties: { doctorId: uuid, note: { type: "string", maxLength: 500 } },
  },
  RejectAppointmentRequest: { type: "object", properties: { note: { type: "string", maxLength: 500 } } },

  Prescription: {
    type: "object",
    properties: {
      id: uuid,
      appointmentId: uuid,
      doctorId: { ...uuid, nullable: true },
      fileName: { type: "string", example: "prescription.pdf" },
      sizeBytes: { type: "integer" },
      createdAt: { type: "string", format: "date-time" },
    },
  },
  AppointmentWithPrescriptions: {
    allOf: [ref("Appointment"), { type: "object", properties: { prescriptions: { type: "array", items: ref("Prescription") } } }],
  },
  DoctorAppointmentDetail: {
    type: "object",
    properties: {
      appointment: ref("AppointmentWithPrescriptions"),
      patient: ref("Patient"),
      history: { type: "array", items: ref("AppointmentWithPrescriptions"), description: "The patient's other approved/checked visits, newest first" },
    },
  },
};
