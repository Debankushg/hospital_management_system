import type { GroupBy } from "@/types/analytics.types";

export type RangeKey = "7d" | "30d" | "90d" | "12m";
export type WorkloadRangeKey = "today" | "week" | "month";

/** Local YYYY-MM-DD (the user's calendar, not UTC). */
const iso = (d: Date) => d.toLocaleDateString("en-CA");
const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

export const RANGE_OPTIONS: { value: RangeKey; label: string }[] = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "12m", label: "12 months" },
];

export function rangeFor(key: RangeKey): { from: string; to: string; groupBy: GroupBy } {
  const to = iso(new Date());
  if (key === "12m") {
    const start = new Date();
    start.setMonth(start.getMonth() - 11, 1);
    return { from: iso(start), to, groupBy: "month" };
  }
  const days = { "7d": 6, "30d": 29, "90d": 89 }[key];
  return { from: iso(daysAgo(days)), to, groupBy: "day" };
}

export const WORKLOAD_OPTIONS: { value: WorkloadRangeKey; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
];

export function workloadRangeFor(key: WorkloadRangeKey): { from: string; to: string } {
  const now = new Date();
  if (key === "today") return { from: iso(now), to: iso(now) };
  if (key === "week") {
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay()); // Sunday
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { from: iso(start), to: iso(end) };
  }
  return { from: iso(new Date(now.getFullYear(), now.getMonth(), 1)), to: iso(new Date(now.getFullYear(), now.getMonth() + 1, 0)) };
}

/** "30 Oct" for days, "Oct 26" for months. */
export function formatBucket(bucket: string, groupBy: GroupBy): string {
  const d = new Date(`${bucket}T00:00:00`);
  return groupBy === "month"
    ? d.toLocaleDateString(undefined, { month: "short", year: "2-digit" })
    : d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

export const formatNumber = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 0 });
