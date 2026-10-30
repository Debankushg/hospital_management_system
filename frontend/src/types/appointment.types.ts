import type { APPOINTMENT_STATUSES, UNAVAILABLE_REASON_LABELS } from "@/config/appointment.config";
import type { Duty } from "./department.types";
import type { Specialty } from "./role.types";

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export interface Appointment {
  id: string;
  specialty: Specialty;
  date: string;
  reason: string | null;
  status: AppointmentStatus;
  note: string | null;
  createdAt: string;
  handledAt: string | null;
  /** When the doctor marked the patient as checked. */
  checkedAt: string | null;
  prescriptionCount: number;
  consultationFee: string | null;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string | null;
  requestedDoctorId: string | null;
  requestedDoctorName: string | null;
  doctorId: string | null;
  doctorName: string | null;
}

export interface DoctorAvailability {
  id: string;
  fullName: string;
  specialty: Specialty;
  consultationFee: string | null;
  duty: Duty | null;
  /** Approved appointments already booked for the date. */
  appointmentsThatDay: number;
  available: boolean;
  reason: keyof typeof UNAVAILABLE_REASON_LABELS | null;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  doctorId: string | null;
  fileName: string;
  sizeBytes: number;
  createdAt: string;
}

export interface AppointmentWithPrescriptions extends Appointment {
  prescriptions: Prescription[];
}
