import type { AppointmentListQuery, AvailabilityQuery } from "../types/dto.types";
import { appointmentService } from "../services";
import { asyncHandler } from "../utils/async-handler.util";

export const appointmentController = {
  create: asyncHandler(async (req, res) => {
    res.status(201).json({ appointment: await appointmentService.create(req.user!, req.body) });
  }),

  mine: asyncHandler(async (req, res) => {
    res.json({ appointments: await appointmentService.mine(req.user!) });
  }),

  list: asyncHandler(async (req, res) => {
    res.json(await appointmentService.list(req.query as unknown as AppointmentListQuery));
  }),

  availability: asyncHandler(async (req, res) => {
    res.json({ doctors: await appointmentService.availability(req.query as unknown as AvailabilityQuery) });
  }),

  approve: asyncHandler(async (req, res) => {
    res.json({ appointment: await appointmentService.approve(req.user!, req.params.id, req.body) });
  }),

  reject: asyncHandler(async (req, res) => {
    res.json({ appointment: await appointmentService.reject(req.user!, req.params.id, req.body.note) });
  }),

  cancel: asyncHandler(async (req, res) => {
    res.json({ appointment: await appointmentService.cancel(req.user!, req.params.id) });
  }),
};
