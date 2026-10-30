import type { Duty } from "@/types/department.types";
import type { DutyFormValues } from "@/types/form.types";
import { apiRequest } from "./api-client";

export const dutyService = {
  update: (userId: string, values: DutyFormValues) =>
    apiRequest<{ duty: Duty }>(`/staff/${userId}/duty`, { method: "PUT", body: values }).then((r) => r.duty),
};
