import { db } from "../db";
import { patientProfiles } from "../models";
import type { DbExecutor } from "../types/db.types";

export const patientProfileRepository = {
  async create(values: typeof patientProfiles.$inferInsert, ex: DbExecutor = db) {
    const [row] = await ex.insert(patientProfiles).values(values).returning();
    return row;
  },

  /** Creates the profile if missing, otherwise updates only the given fields. */
  async upsert(
    userId: string,
    fields: Partial<Omit<typeof patientProfiles.$inferInsert, "userId">>,
    ex: DbExecutor = db,
  ) {
    await ex
      .insert(patientProfiles)
      .values({ userId, ...fields })
      .onConflictDoUpdate({ target: patientProfiles.userId, set: fields });
  },
};
