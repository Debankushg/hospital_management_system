import { useMutation, useQueryClient } from "@tanstack/react-query";
import { consultationService } from "@/services/consultation.service";

/** Marks the patient as checked; the visit then shows up for reception and accounts. */
export function useCheckPatient() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { successMessage: "Patient marked as checked", toastError: true },
    mutationFn: consultationService.check,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-patients"] });
      queryClient.invalidateQueries({ queryKey: ["checked-visits"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}
