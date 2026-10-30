import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { consultationService } from "@/services/consultation.service";

/** Patient details, this visit's prescriptions and visit history for one assigned appointment. */
export const useDoctorAppointment = (id: string) =>
  useQuery({ queryKey: queryKeys.doctorPatients.detail(id), queryFn: () => consultationService.detail(id) });
