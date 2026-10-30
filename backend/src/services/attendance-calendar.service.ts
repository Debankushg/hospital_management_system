import {
  attendanceRepository,
  dutyScheduleRepository,
  leaveRepository,
} from "../repositories";
import type { AttendanceStatus, User } from "../types/domain.types";
import type { AttendanceCalendarQuery } from "../types/dto.types";
import { eachDate } from "../utils/date.util";
import { HttpError } from "../utils/http-error.util";
import { toPublicUser } from "../utils/user.mapper";
import { toDutyView } from "./duty.service";
import { permissionService } from "./permission.service";

const STAFF_ROLES = ["admin", "doctor", "receptionist", "pathologist", "accounts"];

const weekdayOf = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay();

const lastDayOf = (month: string) => {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y!, m!, 0)).toISOString().slice(0, 10); // day 0 of next month
};

export const attendanceCalendarService = {
  /**
   * One month of a staff member's attendance: per day the status, note, approved leave and whether it is a
   * duty day, plus a summary. Staff see their own; managers may pass `userId` for staff they manage.
   */
  async month(actor: User, q: AttendanceCalendarQuery) {
    let target: User;
    if (q.userId && q.userId !== actor.id) {
      target = await permissionService.assertCanManageStaff(actor, q.userId);
    } else {
      if (!STAFF_ROLES.includes(actor.role)) {
        throw new HttpError(400, "Attendance is tracked for staff only. Choose a staff member to view.");
      }
      target = actor;
    }

    const from = `${q.month}-01`;
    const to = lastDayOf(q.month);
    const [records, leaves, duty] = await Promise.all([
      attendanceRepository.listByUser(target.id, from, to),
      leaveRepository.list({ userIds: [target.id], status: "approved", from, to }),
      dutyScheduleRepository.findByUser(target.id),
    ]);

    const byDate = new Map(records.map((r) => [r.date, r]));
    const leaveByDate = new Map<string, string>();
    for (const l of leaves) for (const d of eachDate(l.startDate, l.endDate)) leaveByDate.set(d, l.leaveType);

    const today = q.today ?? new Date().toISOString().slice(0, 10);
    const dutyView = duty ? toDutyView(duty) : null;

    const days = eachDate(from, to).map((date) => {
      const rec = byDate.get(date);
      return {
        date,
        weekday: weekdayOf(date),
        status: (rec?.status ?? null) as AttendanceStatus | null,
        notes: rec?.notes ?? null,
        leaveType: leaveByDate.get(date) ?? null,
        isWorkDay: dutyView ? dutyView.workDays.includes(weekdayOf(date)) : null,
      };
    });

    const count = (s: AttendanceStatus) => days.filter((d) => d.status === s).length;
    const unmarked = dutyView
      ? days.filter((d) => d.date <= today && d.isWorkDay && !d.status && !d.leaveType).length
      : null;

    return {
      month: q.month,
      user: toPublicUser(target),
      duty: dutyView,
      days,
      summary: {
        present: count("present"),
        late: count("late"),
        halfDay: count("half_day"),
        absent: count("absent"),
        onLeave: days.filter((d) => d.status === "on_leave" || (!d.status && d.leaveType)).length,
        unmarked,
      },
    };
  },
};
