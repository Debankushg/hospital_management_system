import { db } from "../db";
import { adminAssignmentRepository, userRepository } from "../repositories";
import type { Role, User } from "../types/domain.types";
import type { CreateAdminInput, UpdateAdminWorkInput } from "../types/dto.types";
import { HttpError } from "../utils/http-error.util";
import { hashPassword } from "../utils/password.util";
import { BASE_ROLES } from "../schemas/admin.schema";
import { toPublicUser } from "../utils/user.mapper";

const toAssignmentView = (a: { area: string; notes: string | null; createdAt: Date }) => ({
  area: a.area,
  notes: a.notes,
  createdAt: a.createdAt,
});

async function requireAdmin(userId: string): Promise<User> {
  const target = await userRepository.findById(userId);
  if (!target || target.role !== "admin") throw new HttpError(404, "Admin not found");
  return target;
}

export const adminService = {
  async listAdmins() {
    const [admins, assignments] = await Promise.all([
      userRepository.list({ roles: ["admin"] }),
      adminAssignmentRepository.listAll(),
    ]);
    return admins.map((a) => ({
      ...toPublicUser(a),
      assignments: assignments.filter((x) => x.adminId === a.id).map(toAssignmentView),
    }));
  },

  /** Create a brand-new admin account and assign their work in one step. */
  async createAdmin(actor: User, input: CreateAdminInput) {
    const passwordHash = await hashPassword(input.password);
    const admin = await db.transaction(async (tx) => {
      const user = await userRepository.create(
        {
          email: input.email,
          fullName: input.fullName,
          phone: input.phone,
          passwordHash,
          role: "admin",
          baseRole: input.baseRole,
          createdBy: actor.id,
        },
        tx,
      );
      const reassigned = await adminAssignmentRepository.replaceForAdmin(user.id, actor.id, input.assignments, tx);
      return { user, reassigned };
    });
    return { user: toPublicUser(admin.user), assignments: input.assignments, reassigned: admin.reassigned };
  },

  /**
   * Promote an existing user to admin and assign their work.
   * A doctor/receptionist/pathologist/accounts user keeps that as their department role ("Doctor, Admin").
   */
  async promote(actor: User, userId: string, input: UpdateAdminWorkInput) {
    const target = await userRepository.findById(userId);
    if (!target) throw new HttpError(404, "User not found");
    if (target.role === "super_admin") throw new HttpError(400, "Cannot change a super admin");
    if (target.role === "patient") throw new HttpError(400, "Patients cannot be promoted to admin; create the admin as staff instead");

    const previousStaffRole = (BASE_ROLES as readonly Role[]).includes(target.role) ? target.role : null;
    const baseRole = input.baseRole ?? previousStaffRole ?? target.baseRole;
    if (!baseRole) {
      throw new HttpError(
        400,
        "Choose the profession this admin works as (doctor, receptionist, pathologist or accounts)",
        { baseRole: ["Required for users who are not already doctors, receptionists, pathologists or accounts staff"] },
      );
    }

    const updated = await db.transaction(async (tx) => {
      const user = await userRepository.update(target.id, { role: "admin", baseRole }, tx);
      const reassigned = await adminAssignmentRepository.replaceForAdmin(target.id, actor.id, input.assignments, tx);
      return { user, reassigned };
    });
    return { user: toPublicUser(updated.user), assignments: input.assignments, reassigned: updated.reassigned };
  },

  async replaceAssignments(actor: User, userId: string, input: UpdateAdminWorkInput) {
    const target = await requireAdmin(userId);
    const reassigned = await db.transaction(async (tx) => {
      const moved = await adminAssignmentRepository.replaceForAdmin(target.id, actor.id, input.assignments, tx);
      if (input.baseRole !== undefined) await userRepository.update(target.id, { baseRole: input.baseRole }, tx);
      return moved;
    });
    return { assignments: input.assignments, reassigned };
  },

  async getAssignments(userId: string) {
    return (await adminAssignmentRepository.listByAdmin(userId)).map(toAssignmentView);
  },

  /** Revoke admin rights: the user falls back to the given role and loses all assignments. */
  async demote(userId: string, role: Exclude<Role, "super_admin" | "admin" | "doctor">) {
    const target = await requireAdmin(userId);
    const updated = await db.transaction(async (tx) => {
      await adminAssignmentRepository.deleteByAdmin(target.id, tx);
      return userRepository.update(target.id, { role, baseRole: null }, tx);
    });
    return toPublicUser(updated);
  },
};
