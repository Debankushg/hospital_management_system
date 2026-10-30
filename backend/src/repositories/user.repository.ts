import { and, eq, inArray } from "drizzle-orm";
import { db } from "../db";
import { users } from "../models";
import type { DbExecutor } from "../types/db.types";
import type { NewUser, Role, User } from "../types/domain.types";

export const userRepository = {
  async findById(id: string, ex: DbExecutor = db): Promise<User | undefined> {
    const [row] = await ex.select().from(users).where(eq(users.id, id));
    return row;
  },

  async findByEmail(email: string, ex: DbExecutor = db): Promise<User | undefined> {
    const [row] = await ex.select().from(users).where(eq(users.email, email.toLowerCase()));
    return row;
  },

  async create(values: NewUser, ex: DbExecutor = db): Promise<User> {
    const [row] = await ex
      .insert(users)
      .values({ ...values, email: values.email.toLowerCase() })
      .returning();
    return row;
  },

  async update(id: string, values: Partial<Omit<NewUser, "id">>, ex: DbExecutor = db): Promise<User> {
    const [row] = await ex
      .update(users)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return row;
  },

  async delete(id: string, ex: DbExecutor = db) {
    await ex.delete(users).where(eq(users.id, id));
  },

  async list(filter: { roles?: Role[] } = {}, ex: DbExecutor = db): Promise<User[]> {
    const conditions = [];
    if (filter.roles) conditions.push(inArray(users.role, filter.roles));
    return ex
      .select()
      .from(users)
      .where(conditions.length ? and(...conditions) : undefined);
  },
};
