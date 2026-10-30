import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { departmentService } from "@/services/department.service";

export const useDepartmentOverview = () =>
  useQuery({ queryKey: queryKeys.department.overview, queryFn: departmentService.overview });
