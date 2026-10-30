import { and, asc, count, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "../db";
import { patientProfiles, users } from "../models";
import type { DbExecutor } from "../types/db.types";
import { likePattern } from "../utils/pagination.util";

interface SearchParams {
  search?: string;
  sortBy: "name" | "joined";
  order: "asc" | "desc";
  limit: number;
  offset: number;
}

export const patientRepository = {
  /** Paginated, searchable patient list (account + profile). */
  async search(p: SearchParams, ex: DbExecutor = db) {
    const pattern = p.search ? likePattern(p.search) : undefined;
    const where = and(
      eq(users.role, "patient"),
      pattern
        ? or(ilike(users.fullName, pattern), ilike(users.email, pattern), ilike(users.phone, pattern))
        : undefined,
    );
    const dir = p.order === "asc" ? asc : desc;
    const orderCol = p.sortBy === "joined" ? users.createdAt : users.fullName;

    const rows = await ex
      .select({ user: users, profile: patientProfiles })
      .from(users)
      .leftJoin(patientProfiles, eq(patientProfiles.userId, users.id))
      .where(where)
      .orderBy(dir(orderCol), asc(users.id))
      .limit(p.limit)
      .offset(p.offset);
    const [{ total }] = await ex.select({ total: count() }).from(users).where(where);
    return { rows, total };
  },

  async findById(id: string, ex: DbExecutor = db) {
    const [row] = await ex
      .select({ user: users, profile: patientProfiles })
      .from(users)
      .leftJoin(patientProfiles, eq(patientProfiles.userId, users.id))
      .where(and(eq(users.id, id), eq(users.role, "patient")));
    return row;
  },
};
