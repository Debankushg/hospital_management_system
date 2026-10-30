import { useMutation, useQueryClient } from "@tanstack/react-query";
import { prescriptionService } from "@/services/prescription.service";

export function useDeletePrescription() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { successMessage: "Prescription deleted", toastError: true },
    mutationFn: prescriptionService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-patients"] });
      queryClient.invalidateQueries({ queryKey: ["checked-visits"] });
    },
  });
}
