import { and, between, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "../db";
import { attendanceRecords } from "../models";
import type { DbExecutor } from "../types/db.types";
import type { AttendanceRecord } from "../types/domain.types";

export const attendanceRepository = {
  /** Creates the record for (user, date) or overwrites it if one already exists. */
  async upsert(values: typeof attendanceRecords.$inferInsert, ex: DbExecutor = db): Promise<AttendanceRecord> {
    const [row] = await ex
      .insert(attendanceRecords)
      .values(values)
      .onConflictDoUpdate({
        target: [attendanceRecords.userId, attendanceRecords.date],
        set: {
          status: values.status,
          notes: values.notes ?? null,
          markedBy: values.markedBy,
          updatedAt: new Date(),
        },
      })
      .returning();
    return row;
  },

  /** Marks the same status on many dates at once (used when leave is approved). */
  async markDates(
    userId: string,
    dates: string[],
    status: AttendanceRecord["status"],
    markedBy: string,
    ex: DbExecutor = db,
  ) {
    if (!dates.length) return;
    await ex
      .insert(attendanceRecords)
      .values(dates.map((date) => ({ userId, date, status, markedBy })))
      .onConflictDoUpdate({
        target: [attendanceRecords.userId, attendanceRecords.date],
        set: {
          status: sql`excluded.status`,
          markedBy: sql`excluded.marked_by`,
          updatedAt: new Date(),
        },
      });
  },

  async listByDate(date: string, userIds: string[], ex: DbExecutor = db): Promise<AttendanceRecord[]> {
    if (!userIds.length) return [];
    return ex
      .select()
      .from(attendanceRecords)
      .where(and(eq(attendanceRecords.date, date), inArray(attendanceRecords.userId, userIds)));
  },

  listByUser(userId: string, from: string, to: string, ex: DbExecutor = db): Promise<AttendanceRecord[]> {
    return ex
      .select()
      .from(attendanceRecords)
      .where(and(eq(attendanceRecords.userId, userId), between(attendanceRecords.date, from, to)))
      .orderBy(desc(attendanceRecords.date));
  },
};
