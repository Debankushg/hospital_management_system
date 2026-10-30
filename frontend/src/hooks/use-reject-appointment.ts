import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentService } from "@/services/appointment.service";

export function useRejectAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { successMessage: "Appointment rejected", toastError: true },
    mutationFn: ({ id, note }: { id: string; note?: string }) => appointmentService.reject(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}
