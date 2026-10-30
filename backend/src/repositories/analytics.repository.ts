import { sql } from "drizzle-orm";
import { db } from "../db";
import type { DbExecutor } from "../types/db.types";

type Unit = "day" | "month";

/** `unit` is whitelisted by the zod schema, so it is safe to inline as a SQL literal. */
const unitSql = (unit: Unit) => sql.raw(`'${unit}'`);
const stepSql = (unit: Unit) => sql.raw(`interval '1 ${unit}'`);

const rowsOf = async <T>(ex: DbExecutor, query: ReturnType<typeof sql>) =>
  (await ex.execute(query)).rows as unknown as T[];

export const analyticsRepository = {
  /** Appointments per bucket by status, plus new patient registrations. Empty buckets are included. */
  patientSeries(from: string, to: string, unit: Unit, ex: DbExecutor = db) {
    return rowsOf<{
      bucket: string;
      requested: number;
      approved: number;
      checked: number;
      cancelled: number;
      newPatients: number;
    }>(
      ex,
      sql`
      with buckets as (
        select generate_series(date_trunc(${unitSql(unit)}, ${from}::date), date_trunc(${unitSql(unit)}, ${to}::date), ${stepSql(unit)})::date as bucket
      ),
      appts as (
        select date_trunc(${unitSql(unit)}, appointment_date)::date as bucket,
          count(*) filter (where status = 'requested')::int as requested,
          count(*) filter (where status = 'approved')::int as approved,
          count(*) filter (where status = 'checked')::int as checked,
          count(*) filter (where status in ('rejected', 'cancelled'))::int as cancelled
        from appointments
        where appointment_date between ${from}::date and ${to}::date
        group by 1
      ),
      regs as (
        select date_trunc(${unitSql(unit)}, (created_at at time zone 'UTC'))::date as bucket, count(*)::int as n
        from users
        where role = 'patient'
          and (created_at at time zone 'UTC')::date between ${from}::date and ${to}::date
        group by 1
      )
      select b.bucket::text as bucket,
        coalesce(a.requested, 0) as requested, coalesce(a.approved, 0) as approved,
        coalesce(a.checked, 0) as checked, coalesce(a.cancelled, 0) as cancelled,
        coalesce(r.n, 0) as "newPatients"
      from buckets b
      left join appts a on a.bucket = b.bucket
      left join regs r on r.bucket = b.bucket
      order by b.bucket`,
    );
  },

  async totalPatients(ex: DbExecutor = db) {
    const [row] = await rowsOf<{ n: number }>(ex, sql`select count(*)::int as n from users where role = 'patient'`);
    return row?.n ?? 0;
  },

  /**
   * Revenue per bucket (visit date): `collected` = fees of checked visits with a paid Stripe payment,
   * `pending` = fees of checked visits not paid yet.
   */
  revenueSeries(from: string, to: string, unit: Unit, ex: DbExecutor = db) {
    return rowsOf<{ bucket: string; collected: string; pending: string; visits: number }>(
      ex,
      sql`
      with buckets as (
        select generate_series(date_trunc(${unitSql(unit)}, ${from}::date), date_trunc(${unitSql(unit)}, ${to}::date), ${stepSql(unit)})::date as bucket
      ),
      v as (
        select date_trunc(${unitSql(unit)}, a.appointment_date)::date as bucket,
          sum(f.fee) filter (where f.paid) as collected,
          sum(f.fee) filter (where not f.paid) as pending,
          count(*)::int as visits
        from appointments a
        left join doctor_profiles dp on dp.user_id = a.doctor_id
        cross join lateral (
          select coalesce(a.checked_fee, dp.consultation_fee, 0) as fee,
                 exists (select 1 from payments p where p.appointment_id = a.id and p.status = 'paid') as paid
        ) f
        where a.status = 'checked' and a.appointment_date between ${from}::date and ${to}::date
        group by 1
      )
      select b.bucket::text as bucket,
        coalesce(v.collected, 0)::text as collected,
        coalesce(v.pending, 0)::text as pending,
        coalesce(v.visits, 0) as visits
      from buckets b left join v on v.bucket = b.bucket
      order by b.bucket`,
    );
  },

  revenueBySpecialty(from: string, to: string, ex: DbExecutor = db) {
    return rowsOf<{ specialty: string; revenue: string; visits: number }>(
      ex,
      sql`
      select a.specialty::text as specialty,
        sum(coalesce(a.checked_fee, dp.consultation_fee, 0))::text as revenue,
        count(*)::int as visits
      from appointments a
      left join doctor_profiles dp on dp.user_id = a.doctor_id
      where a.status = 'checked' and a.appointment_date between ${from}::date and ${to}::date
      group by a.specialty
      order by sum(coalesce(a.checked_fee, dp.consultation_fee, 0)) desc`,
    );
  },

  /** Every active doctor with how many of their patients are checked / still to be seen in the window. */
  doctorWorkload(from: string, to: string, ex: DbExecutor = db) {
    return rowsOf<{ doctorId: string; doctorName: string; specialty: string; checked: number; unchecked: number }>(
      ex,
      sql`
      select u.id as "doctorId", u.full_name as "doctorName", dp.specialty::text as specialty,
        count(a.id) filter (where a.status = 'checked')::int as checked,
        count(a.id) filter (where a.status = 'approved')::int as unchecked
      from doctor_profiles dp
      join users u on u.id = dp.user_id and u.is_active
      left join appointments a on a.doctor_id = u.id
        and a.status in ('approved', 'checked')
        and a.appointment_date between ${from}::date and ${to}::date
      group by u.id, u.full_name, dp.specialty
      order by (count(a.id)) desc, u.full_name`,
    );
  },
};
