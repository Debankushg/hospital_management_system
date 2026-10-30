"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useUpdatePatient } from "@/hooks/use-update-patient";
import type { EditPatientFormValues } from "@/types/form.types";
import type { Patient } from "@/types/patient.types";
import { getErrorMessage } from "@/utils/get-error-message.util";
import { editPatientValidator } from "@/validators/patient.validator";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

interface PatientEditFormProps {
  patient: Patient;
  onDone: () => void;
}

export function PatientEditForm({ patient, onDone }: PatientEditFormProps) {
  const update = useUpdatePatient(patient.id);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditPatientFormValues>({
    resolver: zodResolver(editPatientValidator),
    defaultValues: {
      fullName: patient.fullName,
      phone: patient.phone ?? "",
      dateOfBirth: patient.dateOfBirth ?? "",
      gender: (patient.gender as EditPatientFormValues["gender"]) ?? "",
      bloodGroup: (patient.bloodGroup as EditPatientFormValues["bloodGroup"]) ?? "",
      address: patient.address ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit((v) => update.mutate(v, { onSuccess: onDone }))} className="space-y-4" noValidate>
      {update.isError && <Alert tone="error">{getErrorMessage(update.error)}</Alert>}
      <FormField label="Full name" error={errors.fullName?.message}>
        <Input {...register("fullName")} />
      </FormField>
      <FormField label="Email" hint="Email is the patient's login and cannot be changed here.">
        <Input value={patient.email} disabled readOnly />
      </FormField>
      <FormField label="Phone" error={errors.phone?.message}>
        <Input type="tel" {...register("phone")} />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Date of birth" error={errors.dateOfBirth?.message}>
          <Input type="date" {...register("dateOfBirth")} />
        </FormField>
        <FormField label="Gender">
          <Select {...register("gender")}>
            <option value="">Not set</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>
        </FormField>
      </div>
      <FormField label="Blood group">
        <Select {...register("bloodGroup")}>
          <option value="">Not set</option>
          {BLOOD_GROUPS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField label="Address" error={errors.address?.message}>
        <Input {...register("address")} />
      </FormField>
      <div className="flex gap-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" loading={update.isPending} className="flex-1">
          Save changes
        </Button>
      </div>
    </form>
  );
}
