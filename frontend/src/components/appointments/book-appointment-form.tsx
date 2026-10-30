"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SPECIALTIES, SPECIALTY_LABELS } from "@/config/roles.config";
import { useCreateAppointment } from "@/hooks/use-create-appointment";
import { useDoctors } from "@/hooks/use-doctors";
import type { BookAppointmentFormValues } from "@/types/form.types";
import { todayLocal } from "@/utils/format-duty.util";
import { getErrorMessage } from "@/utils/get-error-message.util";
import { bookAppointmentValidator } from "@/validators/appointment.validator";

interface BookAppointmentFormProps {
  /** Set when a receptionist books on behalf of a patient. */
  patientId?: string;
  onDone: () => void;
}

export function BookAppointmentForm({ patientId, onDone }: BookAppointmentFormProps) {
  const create = useCreateAppointment(patientId);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookAppointmentFormValues>({
    resolver: zodResolver(bookAppointmentValidator),
    defaultValues: { specialty: "opd", preferredDoctorId: "", date: todayLocal() },
  });
  const doctors = useDoctors(watch("specialty"));

  return (
    <form onSubmit={handleSubmit((v) => create.mutate(v, { onSuccess: onDone }))} className="space-y-4" noValidate>
      {create.isError && <Alert tone="error">{getErrorMessage(create.error)}</Alert>}
      <FormField label="Treatment needed" error={errors.specialty?.message}>
        <Select {...register("specialty")}>
          {SPECIALTIES.map((s) => (
            <option key={s} value={s}>
              {SPECIALTY_LABELS[s]}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField label="Preferred doctor (optional)" hint="The receptionist may assign another doctor if unavailable.">
        <Select {...register("preferredDoctorId")}>
          <option value="">No preference</option>
          {(doctors.data ?? []).map((d) => (
            <option key={d.id} value={d.id}>
              Dr. {d.fullName}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField label="Date" error={errors.date?.message}>
        <Input type="date" min={todayLocal()} {...register("date")} />
      </FormField>
      <FormField label="Reason / symptoms (optional)" error={errors.reason?.message}>
        <Input {...register("reason")} />
      </FormField>
      <Button type="submit" loading={create.isPending} className="w-full">
        Request appointment
      </Button>
    </form>
  );
}
