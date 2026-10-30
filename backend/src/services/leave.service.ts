import { db } from "../db";
import { attendanceRepository, leaveRepository } from "../repositories";
import type { LeaveRecord, User } from "../types/domain.types";
import type { CreateLeaveInput, LeaveQuery, RequestLeaveInput, ReviewLeaveInput } from "../types/dto.types";
import type { DbExecutor } from "../types/db.types";
import { eachDate } from "../utils/date.util";
import { HttpError } from "../utils/http-error.util";
import { departmentService } from "./department.service";
import { permissionService } from "./permission.service";

/** Approved leave shows up as "on leave" in the attendance sheet for every day of the leave. */
const applyToAttendance = (leave: LeaveRecord, markedBy: string, ex: DbExecutor) =>
  attendanceRepository.markDates(leave.userId, eachDate(leave.startDate, leave.endDate), "on_leave", markedBy, ex);

export const leaveService = {
  /** Admin records leave for a staff member: approved immediately. */
  async record(actor: User, input: CreateLeaveInput) {
    await permissionService.assertCanManageStaff(actor, input.userId);
    return db.transaction(async (tx) => {
      const leave = await leaveRepository.create(
        { ...input, status: "approved", reviewedBy: actor.id, reviewedAt: new Date(), recordedBy: actor.id },
        tx,
      );
      await applyToAttendance(leave, actor.id, tx);
      return leave;
    });
  },

  /** Staff member asks for leave; an admin of their department reviews it. */
  async request(actor: User, input: RequestLeaveInput) {
    if (actor.role === "patient" || actor.role === "super_admin") {
      throw new HttpError(403, "Only staff members can request leave");
    }
    return leaveRepository.create({ ...input, userId: actor.id, status: "pending", recordedBy: actor.id });
  },

  async review(actor: User, id: string, input: ReviewLeaveInput) {
    const leave = await leaveRepository.findById(id);
    if (!leave) throw new HttpError(404, "Leave record not found");
    await permissionService.assertCanManageStaff(actor, leave.userId);
    if (leave.status !== "pending") throw new HttpError(409, `Leave was already ${leave.status}`);

    return db.transaction(async (tx) => {
      const updated = await leaveRepository.update(
        id,
        { status: input.status, reviewNote: input.note ?? null, reviewedBy: actor.id, reviewedAt: new Date() },
        tx,
      );
      if (input.status === "approved") await applyToAttendance(updated, actor.id, tx);
      return updated;
    });
  },

  mine(actor: User) {
    return leaveRepository.list({ userIds: [actor.id] });
  },

  async list(actor: User, query: LeaveQuery) {
    let userIds: string[];
    if (query.userId) {
      await permissionService.assertCanManageStaff(actor, query.userId);
      userIds = [query.userId];
    } else {
      userIds = (await departmentService.listStaff(actor)).map((s) => s.id);
    }
    return leaveRepository.list({ userIds, status: query.status, from: query.from, to: query.to });
  },

  /** Staff may cancel their own pending request; admins may delete leave of staff they manage. */
  async remove(actor: User, id: string) {
    const leave = await leaveRepository.findById(id);
    if (!leave) throw new HttpError(404, "Leave record not found");
    if (leave.userId === actor.id) {
      if (leave.status !== "pending") throw new HttpError(403, "Only pending requests can be cancelled");
    } else {
      await permissionService.assertCanManageStaff(actor, leave.userId);
    }
    await leaveRepository.delete(id);
  },
};
