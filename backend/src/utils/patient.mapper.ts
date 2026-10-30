import type { patientProfiles } from "../models/patient-profile.model";
import type { User } from "../types/domain.types";
import { toPublicUser } from "./user.mapper";

type Profile = typeof patientProfiles.$inferSelect;

/** Patient account + profile details as returned to receptionists. */
export const toPatientView = (user: User, profile: Profile | null) => ({
  ...toPublicUser(user),
  dateOfBirth: profile?.dateOfBirth ?? null,
  gender: profile?.gender ?? null,
  bloodGroup: profile?.bloodGroup ?? null,
  address: profile?.address ?? null,
});
