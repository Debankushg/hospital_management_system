import type { AnalyticsQuery, AttendanceCalendarQuery } from "../types/dto.types";
import { analyticsService, attendanceCalendarService } from "../services";
import { asyncHandler } from "../utils/async-handler.util";

export const analyticsController = {
  patients: asyncHandler(async (req, res) => {
    res.json(await analyticsService.patients(req.query as unknown as AnalyticsQuery));
  }),

  revenue: asyncHandler(async (req, res) => {
    res.json(await analyticsService.revenue(req.query as unknown as AnalyticsQuery));
  }),

  doctors: asyncHandler(async (req, res) => {
    res.json(await analyticsService.doctors(req.query as unknown as AnalyticsQuery));
  }),

  attendanceCalendar: asyncHandler(async (req, res) => {
    res.json(await attendanceCalendarService.month(req.user!, req.query as unknown as AttendanceCalendarQuery));
  }),
};
