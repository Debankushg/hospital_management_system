import type { db } from "../db";

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

/** Repositories accept either the pool-backed db or an open transaction. */
export type DbExecutor = typeof db | Transaction;
