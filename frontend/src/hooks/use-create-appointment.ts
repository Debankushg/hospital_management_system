import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentService } from "@/services/appointment.service";
import type { BookAppointmentFormValues } from "@/types/form.types";
import { stripEmpty } from "@/utils/strip-empty.util";

/** Patients book for themselves; pass `patientId` when a receptionist books on a patient's behalf. */
export function useCreateAppointment(patientId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { successMessage: "Appointment requested" },
    mutationFn: (values: BookAppointmentFormValues) =>
      appointmentService.create({ ...stripEmpty(values), ...(patientId ? { patientId } : {}) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}
