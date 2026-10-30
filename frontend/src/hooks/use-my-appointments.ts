import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { appointmentService } from "@/services/appointment.service";

export const useMyAppointments = () =>
  useQuery({ queryKey: queryKeys.appointments.mine, queryFn: appointmentService.mine });
