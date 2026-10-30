import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { appointmentService, type AppointmentListParams } from "@/services/appointment.service";

export const useAppointments = (params: AppointmentListParams) =>
  useQuery({
    queryKey: queryKeys.appointments.list(params),
    queryFn: () => appointmentService.list(params),
    placeholderData: keepPreviousData,
  });
