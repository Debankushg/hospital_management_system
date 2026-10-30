import { AREA_ROLE } from "../config/permissions.config";
import { ADMIN_AREAS } from "../models/enums";
import { adminAssignmentRepository, dutyScheduleRepository, userRepository } from "../repositories";
import type { AdminArea, Role, User } from "../types/domain.types";
import { toPublicUser } from "../utils/user.mapper";
import { toDutyView } from "./duty.service";
import { permissionService } from "./permission.service";

export const departmentService = {
  /** Staff the actor manages (used by attendance and leave pickers). */
  async listStaff(actor: User): Promise<User[]> {
    const roles = await permissionService.manageableStaffRoles(actor);
    return roles.length ? userRepository.list({ roles }) : [];
  },

  /**
   * Departments (work areas) of the actor with their members and duty times.
   * Admin: only assigned areas. Super admin: every area.
   *
   * Admins appear only inside their own profession's department (their `baseRole`), tagged e.g.
   * "Doctor, Admin" - never under the other departments they administer.
   */
  async overview(actor: User) {
    let areas: { area: AdminArea; notes: string | null }[];
    if (actor.role === "super_admin") {
      areas = ADMIN_AREAS.map((area) => ({ area, notes: null }));
    } else {
      areas = (await adminAssignmentRepository.listByAdmin(actor.id)).map((a) => ({
        area: a.area,
        notes: a.notes,
      }));
    }
    if (!areas.length) return [];

    const roles: Role[] = areas.map((a) => AREA_ROLE[a.area]);
    const people = await userRepository.list({ roles: [...roles, "admin"] });
    const duties = await dutyScheduleRepository.listByUserIds(
      people.filter((m) => m.role !== "patient").map((m) => m.id),
    );
    const dutyByUser = new Map(duties.map((d) => [d.userId, toDutyView(d)]));

    return areas.map(({ area, notes }) => {
      const role = AREA_ROLE[area];
      const members = people.filter((m) => m.role === role || (m.role === "admin" && m.baseRole === role));
      return {
        area,
        role,
        notes,
        members: members.map((m) => ({ ...toPublicUser(m), duty: dutyByUser.get(m.id) ?? null })),
      };
    });
  },

  /**
   * Super admin only: admins with no profession set. They cannot be placed in a department until the
   * super admin chooses what they work as, so the UI points them out.
   */
  async adminsWithoutProfession(actor: User) {
    if (actor.role !== "super_admin") return [];
    return (await userRepository.list({ roles: ["admin"] }))
      .filter((a) => !a.baseRole)
      .map((a) => ({ id: a.id, fullName: a.fullName, email: a.email }));
  },
};
