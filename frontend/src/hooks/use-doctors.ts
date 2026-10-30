import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { userService } from "@/services/user.service";
import type { Specialty } from "@/types/role.types";

export const useDoctors = (specialty?: Specialty) =>
  useQuery({ queryKey: queryKeys.doctors.list(specialty), queryFn: () => userService.listDoctors(specialty) });
