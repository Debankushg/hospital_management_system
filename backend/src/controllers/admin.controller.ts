import { adminService } from "../services";
import { asyncHandler } from "../utils/async-handler.util";

export const adminController = {
  list: asyncHandler(async (_req, res) => {
    res.json({ admins: await adminService.listAdmins() });
  }),

  create: asyncHandler(async (req, res) => {
    res.status(201).json(await adminService.createAdmin(req.user!, req.body));
  }),

  promote: asyncHandler(async (req, res) => {
    res.json(await adminService.promote(req.user!, req.params.userId, req.body));
  }),

  replaceAssignments: asyncHandler(async (req, res) => {
    res.json(await adminService.replaceAssignments(req.user!, req.params.userId, req.body));
  }),

  getAssignments: asyncHandler(async (req, res) => {
    res.json({ assignments: await adminService.getAssignments(req.params.userId) });
  }),

  demote: asyncHandler(async (req, res) => {
    res.json({ user: await adminService.demote(req.params.userId, req.body.role) });
  }),
};
