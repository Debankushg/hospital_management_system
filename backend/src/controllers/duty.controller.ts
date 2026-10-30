import { dutyService } from "../services";
import { asyncHandler } from "../utils/async-handler.util";

export const dutyController = {
  get: asyncHandler(async (req, res) => {
    res.json({ duty: await dutyService.getDuty(req.user!, req.params.userId) });
  }),

  set: asyncHandler(async (req, res) => {
    res.json({ duty: await dutyService.setDuty(req.user!, req.params.userId, req.body) });
  }),
};
