import type { AppointmentWithPrescriptions } from "./appointment.types";
import type { Patient } from "./patient.types";

/** A doctor's view of one assigned patient. */
export interface DoctorAppointmentDetail {
  appointment: AppointmentWithPrescriptions;
  patient: Patient;
  /** The patient's other approved/checked visits, newest first. */
  history: AppointmentWithPrescriptions[];
}
