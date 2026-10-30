import type { LeaveQuery } from "../types/dto.types";
import { leaveService } from "../services";
import { asyncHandler } from "../utils/async-handler.util";

export const leaveController = {
  record: asyncHandler(async (req, res) => {
    res.status(201).json({ leave: await leaveService.record(req.user!, req.body) });
  }),

  request: asyncHandler(async (req, res) => {
    res.status(201).json({ leave: await leaveService.request(req.user!, req.body) });
  }),

  review: asyncHandler(async (req, res) => {
    res.json({ leave: await leaveService.review(req.user!, req.params.id, req.body) });
  }),

  mine: asyncHandler(async (req, res) => {
    res.json({ leaves: await leaveService.mine(req.user!) });
  }),

  list: asyncHandler(async (req, res) => {
    res.json({ leaves: await leaveService.list(req.user!, req.query as LeaveQuery) });
  }),

  remove: asyncHandler(async (req, res) => {
    await leaveService.remove(req.user!, req.params.id);
    res.status(204).end();
  }),
};
