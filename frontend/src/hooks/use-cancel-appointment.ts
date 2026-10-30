import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentService } from "@/services/appointment.service";

export function useCancelAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { successMessage: "Appointment cancelled", toastError: true },
    mutationFn: appointmentService.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}
