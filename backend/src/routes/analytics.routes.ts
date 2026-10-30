import { Router } from "express";
import { analyticsController } from "../controllers";
import { authenticate } from "../middleware/auth.middleware";
import { requireCheckedVisitsAccess, requireDoctorInsights } from "../middleware/rbac.middleware";
import { validateAnalyticsQuery, validateCalendarQuery } from "../validators/analytics.validator";

const router = Router();
router.use(authenticate());

// Patient volume: aggregate counts, every signed-in user.
router.get("/patients", validateAnalyticsQuery, analyticsController.patients);

// Revenue (consultation fees of checked visits): reception, accounts, super admin.
router.get("/revenue", requireCheckedVisitsAccess, validateAnalyticsQuery, analyticsController.revenue);

// Checked vs unchecked per doctor: doctors and super admin.
router.get("/doctors", requireDoctorInsights, validateAnalyticsQuery, analyticsController.doctors);

// Attendance calendar: staff see their own; managers pass ?userId= for staff they manage.
router.get("/attendance-calendar", validateCalendarQuery, analyticsController.attendanceCalendar);

export default router;
