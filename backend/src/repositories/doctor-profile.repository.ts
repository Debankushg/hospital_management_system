import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { doctorProfiles, users } from "../models";
import type { DbExecutor } from "../types/db.types";
import type { Specialty } from "../types/domain.types";

export const doctorProfileRepository = {
  async findByUser(userId: string, ex: DbExecutor = db) {
    const [row] = await ex.select().from(doctorProfiles).where(eq(doctorProfiles.userId, userId));
    return row;
  },

  async create(values: typeof doctorProfiles.$inferInsert, ex: DbExecutor = db) {
    const [row] = await ex.insert(doctorProfiles).values(values).returning();
    return row;
  },

  /** Active doctors joined with their user record, optionally filtered by specialty. */
  listActive(specialty?: Specialty, ex: DbExecutor = db) {
    return ex
      .select({
        id: users.id,
        fullName: users.fullName,
        specialty: doctorProfiles.specialty,
        consultationFee: doctorProfiles.consultationFee,
      })
      .from(doctorProfiles)
      .innerJoin(users, eq(users.id, doctorProfiles.userId))
      .where(and(eq(users.isActive, true), specialty ? eq(doctorProfiles.specialty, specialty) : undefined));
  },
};
