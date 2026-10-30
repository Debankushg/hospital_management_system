import { and, eq, inArray, ne } from "drizzle-orm";
import { db } from "../db";
import { adminAssignments, users } from "../models";
import type { DbExecutor } from "../types/db.types";
import type { AdminArea } from "../types/domain.types";
import type { AssignmentInput } from "../types/dto.types";

export const adminAssignmentRepository = {
  listAll(ex: DbExecutor = db) {
    return ex.select().from(adminAssignments);
  },

  listByAdmin(adminId: string, ex: DbExecutor = db) {
    return ex.select().from(adminAssignments).where(eq(adminAssignments.adminId, adminId));
  },

  async hasArea(adminId: string, area: AdminArea, ex: DbExecutor = db): Promise<boolean> {
    const [row] = await ex
      .select({ id: adminAssignments.id })
      .from(adminAssignments)
      .where(and(eq(adminAssignments.adminId, adminId), eq(adminAssignments.area, area)));
    return !!row;
  },

  /**
   * Replaces the whole set of work areas for an admin. Every department has exactly one admin, so any
   * area in `list` that another admin holds is taken away from them. Returns who lost what.
   * Call inside a transaction.
   */
  async replaceForAdmin(adminId: string, assignedBy: string, list: AssignmentInput, ex: DbExecutor = db) {
    const areas = list.map((a) => a.area);
    const displaced = areas.length
      ? await ex
          .select({ area: adminAssignments.area, fromAdminId: adminAssignments.adminId, fromAdminName: users.fullName })
          .from(adminAssignments)
          .innerJoin(users, eq(users.id, adminAssignments.adminId))
          .where(and(inArray(adminAssignments.area, areas), ne(adminAssignments.adminId, adminId)))
      : [];
    if (displaced.length) {
      await ex
        .delete(adminAssignments)
        .where(and(inArray(adminAssignments.area, areas), ne(adminAssignments.adminId, adminId)));
    }
    await ex.delete(adminAssignments).where(eq(adminAssignments.adminId, adminId));
    await ex.insert(adminAssignments).values(list.map((a) => ({ adminId, assignedBy, ...a })));
    return displaced;
  },

  deleteByAdmin(adminId: string, ex: DbExecutor = db) {
    return ex.delete(adminAssignments).where(eq(adminAssignments.adminId, adminId));
  },
};
