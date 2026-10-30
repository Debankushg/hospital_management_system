import { ROLE_AREA } from "../config/permissions.config";
import { adminAssignmentRepository, userRepository } from "../repositories";
import type { Role, User } from "../types/domain.types";
import { HttpError } from "../utils/http-error.util";

type Actor = Pick<User, "id" | "role">;

export const permissionService = {
  /**
   * Roles the actor may manage. `null` means unrestricted (super admin).
   * Admins get only the roles covered by the work areas assigned to them.
   */
  async manageableRoles(actor: Actor): Promise<Role[] | null> {
    if (actor.role === "super_admin") return null;
    if (actor.role !== "admin") return [];

    const areas = new Set((await adminAssignmentRepository.listByAdmin(actor.id)).map((a) => a.area));
    return (Object.entries(ROLE_AREA) as [Role, string][])
      .filter(([, area]) => areas.has(area as never))
      .map(([role]) => role);
  },

  async canManageRole(actor: Actor, target: Role): Promise<boolean> {
    if (actor.role === "super_admin") return true;
    if (actor.role !== "admin") return false;
    const area = ROLE_AREA[target];
    if (!area) return false; // admins can never manage admin / super_admin
    return adminAssignmentRepository.hasArea(actor.id, area);
  },

  /** Staff roles (everyone except patients) the actor may manage. Super admin also covers admins. */
  async manageableStaffRoles(actor: Actor): Promise<Role[]> {
    if (actor.role === "super_admin") return ["admin", "doctor", "receptionist", "pathologist", "accounts"];
    return ((await this.manageableRoles(actor)) ?? []).filter((r) => r !== "patient");
  },

  /** Loads the target and throws unless the actor may manage this staff member's duty/attendance/leave. */
  async assertCanManageStaff(actor: Actor, userId: string): Promise<User> {
    const target = await userRepository.findById(userId);
    if (!target) throw new HttpError(404, "User not found");
    if (target.role === "patient" || target.role === "super_admin") {
      throw new HttpError(400, "This user is not a staff member");
    }
    if (!(await this.canManageRole(actor, target.role))) {
      throw new HttpError(403, "This staff member is outside your assigned areas");
    }
    return target;
  },

  /**
   * Reception work (patient list, booking, assigning doctors): receptionists, the super admin, and admins
   * who work as a receptionist (`baseRole`) or are assigned Reception management.
   */
  async canUseReception(actor: User): Promise<boolean> {
    if (actor.role === "receptionist" || actor.role === "super_admin") return true;
    if (actor.role !== "admin") return false;
    if (actor.baseRole === "receptionist") return true;
    return adminAssignmentRepository.hasArea(actor.id, "reception_management");
  },

  /** Deleting patients: the super admin and the admin of the reception department only. */
  async canDeletePatients(actor: User): Promise<boolean> {
    if (actor.role === "super_admin") return true;
    return actor.role === "admin" && adminAssignmentRepository.hasArea(actor.id, "reception_management");
  },

  /** Seeing patients as a doctor: doctors and admins who work as a doctor. */
  isDoctor(actor: User): boolean {
    return actor.role === "doctor" || (actor.role === "admin" && actor.baseRole === "doctor");
  },

  /** Accounts work: accounts staff, admins who work as accounts / are assigned Accounts management, super admin. */
  async canUseAccounts(actor: User): Promise<boolean> {
    if (actor.role === "accounts" || actor.role === "super_admin") return true;
    if (actor.role !== "admin") return false;
    if (actor.baseRole === "accounts") return true;
    return adminAssignmentRepository.hasArea(actor.id, "accounts_management");
  },

  /**
   * Taking payments (Stripe): accounts staff, the super admin, and admins assigned the Accounts department.
   * Narrower than canUseAccounts: an admin who merely works as accounts (`baseRole`) is not enough.
   */
  async canTakePayments(actor: User): Promise<boolean> {
    if (actor.role === "accounts" || actor.role === "super_admin") return true;
    return actor.role === "admin" && adminAssignmentRepository.hasArea(actor.id, "accounts_management");
  },

  /** The list of patients a doctor has checked is shared with reception and accounts. */
  async canViewCheckedVisits(actor: User): Promise<boolean> {
    return (await this.canUseReception(actor)) || (await this.canUseAccounts(actor));
  },

  /** What the UI may offer this user (computed here so the rules live in one place). */
  async capabilitiesOf(actor: User) {
    const [reception, deletePatients, accounts, payments] = await Promise.all([
      this.canUseReception(actor),
      this.canDeletePatients(actor),
      this.canUseAccounts(actor),
      this.canTakePayments(actor),
    ]);
    return {
      reception,
      editPatients: reception,
      deletePatients,
      doctor: this.isDoctor(actor),
      accounts,
      payments,
      viewChecked: reception || accounts,
    };
  },
};
