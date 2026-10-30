import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientService } from "@/services/patient.service";

export function useDeletePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { successMessage: "Patient deleted", toastError: true },
    mutationFn: patientService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}
