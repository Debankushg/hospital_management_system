import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { patientService } from "@/services/patient.service";

export const usePatient = (id: string | null) =>
  useQuery({
    queryKey: queryKeys.patients.detail(id ?? ""),
    queryFn: () => patientService.get(id!),
    enabled: !!id,
  });
