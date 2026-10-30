import { db } from "../db";
import { doctorProfileRepository, prescriptionRepository, userRepository } from "../repositories";
import { deletePrescriptionFiles } from "../utils/file-storage.util";
import type { Role, Specialty, User } from "../types/domain.types";
import type { CreateUserInput } from "../types/dto.types";
import { HttpError } from "../utils/http-error.util";
import { hashPassword } from "../utils/password.util";
import { toPublicUser } from "../utils/user.mapper";
import { permissionService } from "./permission.service";

export const userService = {
  /** Super admin: any role. Admin: only roles within assigned areas. */
  async createUser(actor: User, input: CreateUserInput) {
    if (!(await permissionService.canManageRole(actor, input.role))) {
      throw new HttpError(403, `You are not assigned to manage ${input.role} accounts`);
    }
    const passwordHash = await hashPassword(input.password);

    const created = await db.transaction(async (tx) => {
      const user = await userRepository.create(
        {
          email: input.email,
          fullName: input.fullName,
          phone: input.phone,
          passwordHash,
          role: input.role,
          createdBy: actor.id,
        },
        tx,
      );
      if (input.role === "doctor") {
        await doctorProfileRepository.create(
          {
            userId: user.id,
            specialty: input.specialty!,
            licenseNo: input.licenseNo!,
            consultationFee: input.consultationFee?.toFixed(2),
          },
          tx,
        );
      }
      return user;
    });
    return toPublicUser(created);
  },

  async listUsers(actor: User, role?: Role) {
    const allowed = await permissionService.manageableRoles(actor);

    let roles: Role[] | undefined;
    if (allowed === null) {
      roles = role ? [role] : undefined;
    } else {
      if (!allowed.length) return [];
      if (role && !allowed.includes(role)) throw new HttpError(403, "Role outside your assigned areas");
      roles = role ? [role] : allowed;
    }
    return (await userRepository.list({ roles })).map(toPublicUser);
  },

  async setActive(actor: User, targetId: string, isActive: boolean) {
    const target = await userRepository.findById(targetId);
    if (!target) throw new HttpError(404, "User not found");
    if (target.id === actor.id) throw new HttpError(400, "You cannot change your own status");
    if (!(await permissionService.canManageRole(actor, target.role))) {
      throw new HttpError(403, "You cannot manage this user");
    }
    return toPublicUser(await userRepository.update(target.id, { isActive }));
  },

  /**
   * Super admin only (enforced by the route). Permanently deletes the account together with its
   * profile, MFA data, assignments, duty, attendance and leave records.
   */
  async deleteUser(actor: User, targetId: string) {
    const target = await userRepository.findById(targetId);
    if (!target) throw new HttpError(404, "User not found");
    if (target.id === actor.id) throw new HttpError(400, "You cannot delete your own account");
    if (target.role === "super_admin") throw new HttpError(403, "A super admin account cannot be deleted");
    const files = target.role === "patient" ? await prescriptionRepository.storedNamesForPatient(target.id) : [];
    await userRepository.delete(target.id);
    await deletePrescriptionFiles(files);
  },

  listDoctors(specialty?: Specialty) {
    return doctorProfileRepository.listActive(specialty);
  },
};
