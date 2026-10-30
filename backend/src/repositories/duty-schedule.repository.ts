import { eq, inArray } from "drizzle-orm";
import { db } from "../db";
import { dutySchedules } from "../models";
import type { DbExecutor } from "../types/db.types";
import type { DutySchedule } from "../types/domain.types";

export const dutyScheduleRepository = {
  async findByUser(userId: string, ex: DbExecutor = db): Promise<DutySchedule | undefined> {
    const [row] = await ex.select().from(dutySchedules).where(eq(dutySchedules.userId, userId));
    return row;
  },

  async listByUserIds(userIds: string[], ex: DbExecutor = db): Promise<DutySchedule[]> {
    if (!userIds.length) return [];
    return ex.select().from(dutySchedules).where(inArray(dutySchedules.userId, userIds));
  },

  async upsert(values: typeof dutySchedules.$inferInsert, ex: DbExecutor = db): Promise<DutySchedule> {
    const { userId, ...rest } = values;
    const [row] = await ex
      .insert(dutySchedules)
      .values(values)
      .onConflictDoUpdate({ target: dutySchedules.userId, set: { ...rest, updatedAt: new Date() } })
      .returning();
    return row;
  },
};
