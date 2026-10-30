import type { LeaveStatus } from "@/types/leave.types";
import type { Role, Specialty } from "@/types/role.types";

export const queryKeys = {
  users: {
    all: ["users"] as const,
    list: (role?: Role) => ["users", "list", role ?? "all"] as const,
  },
  doctors: {
    list: (specialty?: Specialty) => ["doctors", specialty ?? "all"] as const,
  },
  admins: {
    all: ["admins"] as const,
  },
  patients: {
    all: ["patients"] as const,
    list: (params: object) => ["patients", "list", params] as const,
    detail: (id: string) => ["patients", "detail", id] as const,
  },
  appointments: {
    all: ["appointments"] as const,
    list: (params: object) => ["appointments", "list", params] as const,
    mine: ["appointments", "mine"] as const,
    availability: (specialty: string, date: string) => ["appointments", "availability", specialty, date] as const,
  },
  doctorPatients: {
    list: (params: object) => ["doctor-patients", "list", params] as const,
    detail: (id: string) => ["doctor-patients", "detail", id] as const,
  },
  checkedVisits: {
    list: (params: object) => ["checked-visits", "list", params] as const,
  },
  payments: {
    all: ["payments"] as const,
    receivables: (params: object) => ["payments", "receivables", params] as const,
    summary: ["payments", "summary"] as const,
  },
  analytics: {
    patients: (p: object) => ["analytics", "patients", p] as const,
    revenue: (p: object) => ["analytics", "revenue", p] as const,
    doctors: (p: object) => ["analytics", "doctors", p] as const,
    calendar: (month: string, userId?: string) => ["analytics", "calendar", month, userId ?? "me"] as const,
  },
  department: {
    overview: ["department", "overview"] as const,
    staff: ["department", "staff"] as const,
  },
  attendance: {
    sheet: (date: string) => ["attendance", date] as const,
  },
  leaves: {
    all: ["leaves"] as const,
    list: (status?: LeaveStatus) => ["leaves", "list", status ?? "all"] as const,
    mine: ["leaves", "mine"] as const,
  },
};
