import {
  appointmentRepository,
  attendanceRepository,
  doctorProfileRepository,
  dutyScheduleRepository,
  leaveRepository,
} from "../repositories";
import type { Specialty } from "../types/domain.types";
import { toDutyView } from "./duty.service";

export type UnavailableReason = "absent" | "on_leave" | "not_on_duty";

const weekdayOf = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay();

export const doctorAvailabilityService = {
  /**
   * Active doctors of a specialty with their availability on a date.
   * Unavailable when: marked absent / on leave in attendance, covered by approved leave,
   * or the date is not one of their duty days. Doctors without a duty schedule count as available.
   */
  async forDate(specialty: Specialty, date: string) {
    const doctors = await doctorProfileRepository.listActive(specialty);
    const ids = doctors.map((d) => d.id);

    const [schedules, attendance, leaves, workload] = await Promise.all([
      dutyScheduleRepository.listByUserIds(ids),
      attendanceRepository.listByDate(date, ids),
      leaveRepository.list({ userIds: ids, status: "approved", from: date, to: date }),
      appointmentRepository.countApprovedByDoctors(ids, date),
    ]);
    const scheduleBy = new Map(schedules.map((s) => [s.userId, s]));
    const attendanceBy = new Map(attendance.map((a) => [a.userId, a.status]));
    const onLeave = new Set(leaves.map((l) => l.userId));

    return doctors.map((d) => {
      const schedule = scheduleBy.get(d.id);
      const status = attendanceBy.get(d.id);

      let reason: UnavailableReason | null = null;
      if (status === "absent") reason = "absent";
      else if (status === "on_leave" || onLeave.has(d.id)) reason = "on_leave";
      else if (schedule && !schedule.workDays.includes(weekdayOf(date))) reason = "not_on_duty";

      return {
        id: d.id,
        fullName: d.fullName,
        specialty: d.specialty,
        consultationFee: d.consultationFee,
        duty: schedule ? toDutyView(schedule) : null,
        appointmentsThatDay: workload.get(d.id) ?? 0,
        available: reason === null,
        reason,
      };
    });
  },
};
