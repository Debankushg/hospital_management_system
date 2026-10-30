import { attendanceRepository } from "../repositories";
import type { User } from "../types/domain.types";
import type { MarkAttendanceInput } from "../types/dto.types";
import { HttpError } from "../utils/http-error.util";
import { toPublicUser } from "../utils/user.mapper";
import { departmentService } from "./department.service";
import { permissionService } from "./permission.service";

/** Latest date any timezone could currently be on (UTC+14), so "today" is never rejected. */
const latestAllowedDate = () => new Date(Date.now() + 14 * 3_600_000).toISOString().slice(0, 10);

export const attendanceService = {
  async mark(actor: User, input: MarkAttendanceInput) {
    await permissionService.assertCanManageStaff(actor, input.userId);
    if (input.date > latestAllowedDate()) throw new HttpError(400, "Cannot mark attendance for a future date");
    return attendanceRepository.upsert({ ...input, markedBy: actor.id });
  },

  /** Daily sheet: every managed staff member with their record for the date (or null). */
  async sheet(actor: User, date: string) {
    const staff = await departmentService.listStaff(actor);
    const records = await attendanceRepository.listByDate(
      date,
      staff.map((s) => s.id),
    );
    const byUser = new Map(records.map((r) => [r.userId, r]));
    return staff.map((s) => {
      const r = byUser.get(s.id);
      return {
        user: toPublicUser(s),
        attendance: r ? { status: r.status, notes: r.notes } : null,
      };
    });
  },
};
