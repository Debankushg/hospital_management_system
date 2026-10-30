import { and, desc, eq, gte, inArray, lte } from "drizzle-orm";
import { db } from "../db";
import { leaveRecords, users } from "../models";
import type { DbExecutor } from "../types/db.types";
import type { LeaveRecord } from "../types/domain.types";

export const leaveRepository = {
  async create(values: typeof leaveRecords.$inferInsert, ex: DbExecutor = db): Promise<LeaveRecord> {
    const [row] = await ex.insert(leaveRecords).values(values).returning();
    return row;
  },

  async findById(id: string, ex: DbExecutor = db): Promise<LeaveRecord | undefined> {
    const [row] = await ex.select().from(leaveRecords).where(eq(leaveRecords.id, id));
    return row;
  },

  async update(id: string, values: Partial<typeof leaveRecords.$inferInsert>, ex: DbExecutor = db) {
    const [row] = await ex.update(leaveRecords).set(values).where(eq(leaveRecords.id, id)).returning();
    return row;
  },

  async delete(id: string, ex: DbExecutor = db) {
    await ex.delete(leaveRecords).where(eq(leaveRecords.id, id));
  },

  /** Leaves overlapping the optional [from, to] window, joined with the staff member's name and role. */
  async list(
    filter: { userIds: string[]; status?: LeaveRecord["status"]; from?: string; to?: string },
    ex: DbExecutor = db,
  ) {
    if (!filter.userIds.length) return [];
    const conditions = [inArray(leaveRecords.userId, filter.userIds)];
    if (filter.status) conditions.push(eq(leaveRecords.status, filter.status));
    if (filter.from) conditions.push(gte(leaveRecords.endDate, filter.from));
    if (filter.to) conditions.push(lte(leaveRecords.startDate, filter.to));

    return ex
      .select({
        id: leaveRecords.id,
        userId: leaveRecords.userId,
        userName: users.fullName,
        userRole: users.role,
        leaveType: leaveRecords.leaveType,
        startDate: leaveRecords.startDate,
        endDate: leaveRecords.endDate,
        reason: leaveRecords.reason,
        status: leaveRecords.status,
        reviewNote: leaveRecords.reviewNote,
        reviewedAt: leaveRecords.reviewedAt,
        createdAt: leaveRecords.createdAt,
      })
      .from(leaveRecords)
      .innerJoin(users, eq(users.id, leaveRecords.userId))
      .where(and(...conditions))
      .orderBy(desc(leaveRecords.startDate));
  },
};
