import {
  Building2,
  CalendarCheck,
  CalendarDays,
  CalendarClock,
  CalendarPlus,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Lock,
  ShieldCheck,
  Stethoscope,
  UserRoundCog,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/types/role.types";
import type { Capabilities } from "@/types/user.types";
import { ROUTES } from "./routes.config";

export interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
  /** Omit to allow every signed-in role. */
  roles?: Role[];
  /** Also visible to anyone with this server-granted capability. */
  capability?: keyof Capabilities;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: ROUTES.dashboard },
  { label: "Users", icon: UsersRound, href: ROUTES.users, roles: ["super_admin", "admin"] },
  { label: "My department", icon: Building2, href: ROUTES.department, roles: ["super_admin", "admin"] },
  { label: "Attendance", icon: CalendarCheck, href: ROUTES.attendance, roles: ["super_admin", "admin"] },
  {
    label: "Attendance calendar",
    icon: CalendarDays,
    href: ROUTES.attendanceCalendar,
    roles: ["super_admin", "admin", "doctor", "receptionist", "pathologist", "accounts"],
  },
  { label: "Leave requests", icon: ClipboardList, href: ROUTES.leaves, roles: ["super_admin", "admin"] },
  {
    label: "My leave",
    icon: CalendarPlus,
    href: ROUTES.myLeave,
    roles: ["admin", "doctor", "receptionist", "pathologist", "accounts"],
  },
  { label: "Admins", icon: ShieldCheck, href: ROUTES.admins, roles: ["super_admin"] },
  {
    label: "Patients",
    icon: Users,
    href: ROUTES.patients,
    roles: ["receptionist", "super_admin"],
    capability: "reception",
  },
  {
    label: "Appointments",
    icon: CalendarClock,
    href: ROUTES.appointments,
    roles: ["receptionist", "super_admin"],
    capability: "reception",
  },
  { label: "My patients", icon: Stethoscope, href: ROUTES.myPatients, roles: [], capability: "doctor" },
  {
    label: "Checked patients",
    icon: ClipboardCheck,
    href: ROUTES.checkedPatients,
    roles: [],
    capability: "viewChecked",
  },
  { label: "Payments", icon: CreditCard, href: ROUTES.payments, roles: [], capability: "payments" },
  { label: "My appointments", icon: CalendarClock, href: ROUTES.myAppointments, roles: ["patient"] },
  { label: "Doctors", icon: UserRoundCog, href: ROUTES.doctors },
  { label: "Security", icon: Lock, href: ROUTES.security },
];
