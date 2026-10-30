import { mfaService } from "../services";
import { asyncHandler } from "../utils/async-handler.util";

export const mfaController = {
  setup: asyncHandler(async (req, res) => {
    res.json(await mfaService.beginSetup(req.user!));
  }),

  enable: asyncHandler(async (req, res) => {
    res.json(await mfaService.enable(req.user!, req.body.code));
  }),

  revealSecret: asyncHandler(async (req, res) => {
    res.json(await mfaService.revealSecret(req.user!, req.body.password, req.body.code));
  }),

  disable: asyncHandler(async (req, res) => {
    await mfaService.disable(req.user!, req.body.password, req.body.code);
    res.status(204).end();
  }),
};
