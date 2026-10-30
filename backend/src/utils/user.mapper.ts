import type { PublicUser, User } from "../types/domain.types";

export const toPublicUser = (u: User): PublicUser => ({
  id: u.id,
  email: u.email,
  fullName: u.fullName,
  phone: u.phone,
  role: u.role,
  baseRole: u.baseRole,
  isActive: u.isActive,
  mfaEnabled: u.mfaEnabled,
  createdAt: u.createdAt,
});
