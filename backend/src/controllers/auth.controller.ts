import { authService, toSessionUser } from "../services/auth.service";
import { asyncHandler } from "../utils/async-handler.util";

export const authController = {
  register: asyncHandler(async (req, res) => {
    res.status(201).json({ user: await authService.registerPatient(req.body) });
  }),

  login: asyncHandler(async (req, res) => {
    res.json(await authService.login(req.body.email, req.body.password));
  }),

  verifyMfaLogin: asyncHandler(async (req, res) => {
    res.json(await authService.verifyMfaLogin(req.user!, req.body));
  }),

  me: asyncHandler(async (req, res) => {
    res.json({ user: await toSessionUser(req.user!) });
  }),
};
