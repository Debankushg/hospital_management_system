"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { LEAVE_LABELS, LEAVE_TYPES } from "@/config/hr.config";
import { ROLE_LABELS } from "@/config/roles.config";
import { useRecordLeave } from "@/hooks/use-record-leave";
import { useStaff } from "@/hooks/use-staff";
import type { LeaveFormValues } from "@/types/form.types";
import { todayLocal } from "@/utils/format-duty.util";
import { getErrorMessage } from "@/utils/get-error-message.util";
import { leaveValidator } from "@/validators/leave.validator";

export function RecordLeaveForm({ onDone }: { onDone: () => void }) {
  const staff = useStaff();
  const record = useRecordLeave();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveValidator),
    defaultValues: { userId: "", leaveType: "casual", startDate: todayLocal(), endDate: todayLocal() },
  });

  return (
    <form
      onSubmit={handleSubmit((v) => record.mutate(v, { onSuccess: onDone }))}
      className="space-y-4"
      noValidate
    >
      {record.isError && <Alert tone="error">{getErrorMessage(record.error)}</Alert>}
      <FormField label="Staff member" error={errors.userId?.message}>
        <Select {...register("userId")} disabled={staff.isLoading}>
          <option value="">Select staff member</option>
          {(staff.data ?? []).map((s) => (
            <option key={s.id} value={s.id}>
              {s.fullName} – {ROLE_LABELS[s.role]}
            </option>
          ))}
        </Select>
      </FormField>
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
      <Button type="submit" loading={record.isPending} className="w-full">
        Record leave
      </Button>
    </form>
  );
}
