import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys.config";
import { consultationService, type DoctorPatientsParams } from "@/services/consultation.service";

/** The signed-in doctor's assigned patients; refreshes every 30s so new assignments appear. */
export const useDoctorPatients = (params: DoctorPatientsParams) =>
  useQuery({
    queryKey: queryKeys.doctorPatients.list(params),
    queryFn: () => consultationService.listPatients(params),
    placeholderData: keepPreviousData,
    refetchInterval: 30_000,
  });
