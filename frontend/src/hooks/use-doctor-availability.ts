import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { appointmentService } from "@/services/appointment.service";
import type { Specialty } from "@/types/role.types";

/** Doctors of a specialty with their availability on a date. */
export const useDoctorAvailability = (specialty: Specialty, date: string) =>
  useQuery({
    queryKey: queryKeys.appointments.availability(specialty, date),
    queryFn: () => appointmentService.availability(specialty, date),
  });
