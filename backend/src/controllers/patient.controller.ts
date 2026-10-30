import type { PatientListQuery } from "../types/dto.types";
import { patientService } from "../services";
import { asyncHandler } from "../utils/async-handler.util";

export const patientController = {
  list: asyncHandler(async (req, res) => {
    res.json(await patientService.list(req.query as unknown as PatientListQuery));
  }),

  get: asyncHandler(async (req, res) => {
    res.json(await patientService.get(req.params.id));
  }),

  update: asyncHandler(async (req, res) => {
    res.json({ patient: await patientService.update(req.params.id, req.body) });
  }),

  remove: asyncHandler(async (req, res) => {
    await patientService.remove(req.params.id);
    res.status(204).end();
  }),
};
