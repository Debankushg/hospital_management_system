import type { NextFunction, Request, Response } from "express";
import { permissionService } from "../services/permission.service";
import type { Role } from "../types/domain.types";
import { HttpError } from "../utils/http-error.util";

/** Allows the request only if the authenticated user has one of the given roles. */
export const requireRole =
  (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new HttpError(403, "You do not have permission to perform this action"));
    }
    next();
  };

const unauthorized = () => new HttpError(403, "You do not have permission to perform this action");

/** Reception access: receptionists, reception-role admins, Reception-management admins and the super admin. */
export const requireReception = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    next((await permissionService.canUseReception(req.user!)) ? undefined : unauthorized());
  } catch (e) {
    next(e);
  }
};

/** Patients (for themselves) or reception staff. */
export const requirePatientOrReception = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const ok = req.user!.role === "patient" || (await permissionService.canUseReception(req.user!));
    next(ok ? undefined : unauthorized());
  } catch (e) {
    next(e);
  }
};

/** Only the super admin and the admin of the reception department. */
export const requireReceptionAdmin = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    next((await permissionService.canDeletePatients(req.user!)) ? undefined : unauthorized());
  } catch (e) {
    next(e);
  }
};

/** Doctors and admins who work as a doctor. */
export const requireDoctor = (req: Request, _res: Response, next: NextFunction) =>
  next(permissionService.isDoctor(req.user!) ? undefined : unauthorized());

/** Reception or accounts: may see the list of checked patients. */
export const requireCheckedVisitsAccess = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    next((await permissionService.canViewCheckedVisits(req.user!)) ? undefined : unauthorized());
  } catch (e) {
    next(e);
  }
};

/** Doctor workload chart: doctors (and admins working as a doctor) and the super admin. */
export const requireDoctorInsights = (req: Request, _res: Response, next: NextFunction) =>
  next(permissionService.isDoctor(req.user!) || req.user!.role === "super_admin" ? undefined : unauthorized());

/** Taking payments: accounts staff, Accounts-department admins and the super admin. */
export const requirePayments = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    next((await permissionService.canTakePayments(req.user!)) ? undefined : unauthorized());
  } catch (e) {
    next(e);
  }
};
