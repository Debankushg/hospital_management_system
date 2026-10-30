import { and, desc, eq, inArray, ne, sql } from "drizzle-orm";
import { db } from "../db";
import { payments } from "../models";
import type { DbExecutor } from "../types/db.types";
import type { Payment } from "../types/domain.types";

export const paymentRepository = {
  async create(values: typeof payments.$inferInsert, ex: DbExecutor = db): Promise<Payment> {
    const [row] = await ex.insert(payments).values(values).returning();
    return row;
  },

  async findBySessionId(sessionId: string, ex: DbExecutor = db): Promise<Payment | undefined> {
    const [row] = await ex.select().from(payments).where(eq(payments.stripeSessionId, sessionId));
    return row;
  },

  listByAppointmentIds(ids: string[], ex: DbExecutor = db): Promise<Payment[]> {
    if (!ids.length) return Promise.resolve([]);
    return ex.select().from(payments).where(inArray(payments.appointmentId, ids)).orderBy(desc(payments.createdAt));
  },

  /** Idempotent: a payment that is already paid is left untouched. */
  async markPaid(sessionId: string, paymentIntentId: string | null, ex: DbExecutor = db) {
    const [row] = await ex
      .update(payments)
      .set({ status: "paid", paidAt: new Date(), stripePaymentIntentId: paymentIntentId })
      .where(and(eq(payments.stripeSessionId, sessionId), ne(payments.status, "paid")))
      .returning();
    return row;
  },

  async markExpired(sessionId: string, ex: DbExecutor = db) {
    await ex
      .update(payments)
      .set({ status: "expired" })
      .where(and(eq(payments.stripeSessionId, sessionId), eq(payments.status, "pending")));
  },

  /** Money collected vs still owed on checked visits. */
  async summary(ex: DbExecutor = db) {
    const { rows } = await ex.execute(sql`
      select
        coalesce((select sum(amount) from payments where status = 'paid'), 0)::text as collected,
        (select count(*)::int from payments where status = 'paid') as paid_count,
        coalesce((select sum(coalesce(a.checked_fee, d.consultation_fee)) from appointments a
                  left join doctor_profiles d on d.user_id = a.doctor_id
                  where a.status = 'checked' and coalesce(a.checked_fee, d.consultation_fee) > 0
                    and not exists (select 1 from payments p where p.appointment_id = a.id and p.status = 'paid')), 0)::text as outstanding,
        (select count(*)::int from appointments a
          left join doctor_profiles d on d.user_id = a.doctor_id
          where a.status = 'checked' and coalesce(a.checked_fee, d.consultation_fee) > 0
            and not exists (select 1 from payments p where p.appointment_id = a.id and p.status = 'paid')) as unpaid_count
    `);
    const r = rows[0] as { collected: string; paid_count: number; outstanding: string; unpaid_count: number };
    return {
      collected: r.collected,
      paidCount: r.paid_count,
      outstanding: r.outstanding,
      unpaidCount: r.unpaid_count,
    };
  },
};
