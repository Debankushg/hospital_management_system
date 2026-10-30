import { WEEK_DAYS } from "@/config/hr.config";
import type { Duty } from "@/types/department.types";

export const formatWorkDays = (days: number[]) =>
  days.length === 7 ? "Every day" : WEEK_DAYS.filter((d) => days.includes(d.value)).map((d) => d.label).join(", ");

export const formatDuty = (duty: Duty | null) =>
  duty ? `${duty.startTime} – ${duty.endTime} · ${formatWorkDays(duty.workDays)}` : "Not set";

/** Today's date as YYYY-MM-DD in the user's local timezone. */
export const todayLocal = () => new Date().toLocaleDateString("en-CA");
