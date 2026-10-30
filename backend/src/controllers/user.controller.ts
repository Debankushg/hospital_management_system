import type { Role, Specialty } from "../types/domain.types";
import { userService } from "../services";
import { asyncHandler } from "../utils/async-handler.util";

export const userController = {
  create: asyncHandler(async (req, res) => {
    res.status(201).json({ user: await userService.createUser(req.user!, req.body) });
  }),

  list: asyncHandler(async (req, res) => {
    const { role } = req.query as { role?: Role };
    res.json({ users: await userService.listUsers(req.user!, role) });
  }),

  setActive: asyncHandler(async (req, res) => {
    res.json({ user: await userService.setActive(req.user!, req.params.id, req.body.isActive) });
  }),

  remove: asyncHandler(async (req, res) => {
    await userService.deleteUser(req.user!, req.params.id);
    res.status(204).end();
  }),

  listDoctors: asyncHandler(async (req, res) => {
    const { specialty } = req.query as { specialty?: Specialty };
    res.json({ doctors: await userService.listDoctors(specialty) });
  }),
};
