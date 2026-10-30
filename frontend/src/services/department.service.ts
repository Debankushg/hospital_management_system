import type { DepartmentOverview } from "@/types/department.types";
import type { PublicUser } from "@/types/user.types";
import { apiRequest } from "./api-client";

export const departmentService = {
  overview: () => apiRequest<DepartmentOverview>("/department/overview"),

  staff: () => apiRequest<{ staff: PublicUser[] }>("/department/staff").then((r) => r.staff),
};
