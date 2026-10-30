import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientService } from "@/services/patient.service";
import type { EditPatientFormValues } from "@/types/form.types";

export function useUpdatePatient(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { successMessage: "Patient details saved" },
    mutationFn: (values: EditPatientFormValues) => patientService.update(id, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["patients"] }),
  });
}
