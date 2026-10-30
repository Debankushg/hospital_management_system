import { attendanceService } from "../services";
import { asyncHandler } from "../utils/async-handler.util";

export const attendanceController = {
  mark: asyncHandler(async (req, res) => {
    res.status(201).json({ attendance: await attendanceService.mark(req.user!, req.body) });
  }),

  sheet: asyncHandler(async (req, res) => {
    const { date } = req.query as { date: string };
    res.json({ date, entries: await attendanceService.sheet(req.user!, date) });
  }),
};
