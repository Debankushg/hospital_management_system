import { dutyScheduleRepository } from "../repositories";
import type { DutySchedule, User } from "../types/domain.types";
import type { DutyScheduleInput } from "../types/dto.types";
import { permissionService } from "./permission.service";

export const toDutyView = (d: DutySchedule) => ({
  userId: d.userId,
  startTime: d.startTime.slice(0, 5),
  endTime: d.endTime.slice(0, 5),
  workDays: [...d.workDays].sort(),
  updatedAt: d.updatedAt,
});

export const dutyService = {
  async getDuty(actor: User, userId: string) {
    await permissionService.assertCanManageStaff(actor, userId);
    const duty = await dutyScheduleRepository.findByUser(userId);
    return duty ? toDutyView(duty) : null;
  },

  async setDuty(actor: User, userId: string, input: DutyScheduleInput) {
    await permissionService.assertCanManageStaff(actor, userId);
    const saved = await dutyScheduleRepository.upsert({ userId, ...input, updatedBy: actor.id });
    return toDutyView(saved);
  },
};
