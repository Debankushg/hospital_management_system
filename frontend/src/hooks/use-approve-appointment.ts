import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentService } from "@/services/appointment.service";

/** Assign an available doctor and approve (also used to re-assign). */
export function useApproveAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { successMessage: "Doctor assigned and appointment approved" },
    mutationFn: ({ id, doctorId, note }: { id: string; doctorId: string; note?: string }) =>
      appointmentService.approve(id, { doctorId, note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}
