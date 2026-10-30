import { analyticsRepository } from "../repositories";
import type { AnalyticsQuery } from "../types/dto.types";

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

export const analyticsService = {
  /** Hospital-wide patient volume. Aggregate counts only, safe for every signed-in user. */
  async patients(q: AnalyticsQuery) {
    const [series, totalPatients] = await Promise.all([
      analyticsRepository.patientSeries(q.from, q.to, q.groupBy),
      analyticsRepository.totalPatients(),
    ]);
    return {
      groupBy: q.groupBy,
      series,
      totals: {
        totalPatients,
        newPatients: sum(series.map((s) => s.newPatients)),
        appointments: sum(series.map((s) => s.requested + s.approved + s.checked + s.cancelled)),
        checked: sum(series.map((s) => s.checked)),
        pending: sum(series.map((s) => s.requested + s.approved)),
      },
    };
  },

  /** Revenue from checked visits, split into collected (paid via Stripe) and pending. Reception, accounts and the super admin. */
  async revenue(q: AnalyticsQuery) {
    const [rows, bySpecialty] = await Promise.all([
      analyticsRepository.revenueSeries(q.from, q.to, q.groupBy),
      analyticsRepository.revenueBySpecialty(q.from, q.to),
    ]);
    const series = rows.map((r) => {
      const collected = Number(r.collected);
      const pending = Number(r.pending);
      return { bucket: r.bucket, collected, pending, revenue: collected + pending, visits: r.visits };
    });
    const collected = sum(series.map((s) => s.collected));
    const pending = sum(series.map((s) => s.pending));
    const billed = collected + pending;
    const visits = sum(series.map((s) => s.visits));
    return {
      groupBy: q.groupBy,
      series,
      bySpecialty: bySpecialty.map((s) => ({ specialty: s.specialty, revenue: Number(s.revenue), visits: s.visits })),
      totals: {
        collected,
        pending,
        revenue: billed,
        visits,
        averagePerVisit: visits ? billed / visits : 0,
        collectionRate: billed ? collected / billed : 0,
      },
    };
  },

  /** Checked vs still-to-see patients for every doctor. */
  async doctors(q: AnalyticsQuery) {
    const doctors = await analyticsRepository.doctorWorkload(q.from, q.to);
    return {
      doctors,
      totals: { checked: sum(doctors.map((d) => d.checked)), unchecked: sum(doctors.map((d) => d.unchecked)) },
    };
  },
};
