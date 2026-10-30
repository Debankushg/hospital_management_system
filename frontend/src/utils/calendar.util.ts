/** Current month as YYYY-MM in the user's local time. */
export const currentMonth = () => new Date().toLocaleDateString("en-CA").slice(0, 7);

export function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y!, m! - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export const monthTitle = (month: string) =>
  new Date(`${month}-01T00:00:00`).toLocaleDateString(undefined, { month: "long", year: "numeric" });

export const longDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

export const weekdayName = (weekday: number, style: "long" | "short" = "long") =>
  new Date(2024, 0, 7 + weekday).toLocaleDateString(undefined, { weekday: style });
