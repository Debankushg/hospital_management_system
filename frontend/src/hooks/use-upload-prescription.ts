import { useMutation, useQueryClient } from "@tanstack/react-query";
import { prescriptionService } from "@/services/prescription.service";

export function useUploadPrescription(appointmentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { successMessage: "Prescription attached", toastError: true },
    mutationFn: (file: File) => prescriptionService.upload(appointmentId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-patients"] });
      queryClient.invalidateQueries({ queryKey: ["checked-visits"] });
    },
  });
}
