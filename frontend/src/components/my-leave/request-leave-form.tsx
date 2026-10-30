"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { LEAVE_LABELS, LEAVE_TYPES } from "@/config/hr.config";
import { useRequestLeave } from "@/hooks/use-request-leave";
import type { LeaveRequestFormValues } from "@/types/form.types";
import { todayLocal } from "@/utils/format-duty.util";
import { getErrorMessage } from "@/utils/get-error-message.util";
import { leaveRequestValidator } from "@/validators/leave.validator";

export function RequestLeaveForm({ onDone }: { onDone: () => void }) {
  const request = useRequestLeave();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeaveRequestFormValues>({
    resolver: zodResolver(leaveRequestValidator),
    defaultValues: { leaveType: "casual", startDate: todayLocal(), endDate: todayLocal() },
  });

  return (
    <form
      onSubmit={handleSubmit((v) => request.mutate(v, { onSuccess: onDone }))}
      className="space-y-4"
      noValidate
    >
      {request.isError && <Alert tone="error">{getErrorMessage(request.error)}</Alert>}
      <FormField label="Leave type" error={errors.leaveType?.message}>
        <Select {...register("leaveType")}>
          {LEAVE_TYPES.map((t) => (
            <option key={t} value={t}>
              {LEAVE_LABELS[t]}
            </option>
          ))}
        </Select>
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="From" error={errors.startDate?.message}>
          <Input type="date" {...register("startDate")} />
        </FormField>
        <FormField label="To" error={errors.endDate?.message}>
          <Input type="date" {...register("endDate")} />
        </FormField>
      </div>
      <FormField label="Reason (optional)" error={errors.reason?.message}>
        <Input {...register("reason")} />
      </FormField>
      <Button type="submit" loading={request.isPending} className="w-full">
        Submit request
      </Button>
    </form>
  );
}
