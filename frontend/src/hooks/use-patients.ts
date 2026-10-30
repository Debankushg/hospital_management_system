import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { patientService } from "@/services/patient.service";
import type { PatientListParams } from "@/types/patient.types";

/** Paginated patient list; keeps the previous page on screen while the next one loads. */
export const usePatients = (params: PatientListParams) =>
  useQuery({
    queryKey: queryKeys.patients.list(params),
    queryFn: () => patientService.list(params),
    placeholderData: keepPreviousData,
  });
