"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { useUpdateDuty } from "@/hooks/use-update-duty";
import type { DepartmentMember } from "@/types/department.types";
import type { DutyFormValues } from "@/types/form.types";
import { getErrorMessage } from "@/utils/get-error-message.util";
import { dutyValidator } from "@/validators/duty.validator";
import { WorkDaysPicker } from "./work-days-picker";

interface EditDutyFormProps {
  member: DepartmentMember;
  onDone: () => void;
}

export function EditDutyForm({ member, onDone }: EditDutyFormProps) {
  const update = useUpdateDuty();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DutyFormValues>({
    resolver: zodResolver(dutyValidator),
    defaultValues: {
      startTime: member.duty?.startTime ?? "09:00",
      endTime: member.duty?.endTime ?? "17:00",
      workDays: member.duty?.workDays ?? [1, 2, 3, 4, 5],
    },
  });

  return (
    <form
      onSubmit={handleSubmit((values) => update.mutate({ userId: member.id, values }, { onSuccess: onDone }))}
      className="space-y-4"
    >
      {update.isError && <Alert tone="error">{getErrorMessage(update.error)}</Alert>}
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Duty starts" error={errors.startTime?.message}>
          <Input type="time" {...register("startTime")} />
        </FormField>
        <FormField label="Duty ends" error={errors.endTime?.message}>
          <Input type="time" {...register("endTime")} />
        </FormField>
      </div>
      <Controller
        control={control}
        name="workDays"
        render={({ field }) => (
          <WorkDaysPicker value={field.value} onChange={field.onChange} error={errors.workDays?.message} />
        )}
      />
      <Button type="submit" loading={update.isPending} className="w-full">
        Save duty time
      </Button>
    </form>
  );
}
