import type { CheckedVisitsQuery, DoctorPatientsQuery } from "../types/dto.types";
import { consultationService, prescriptionService } from "../services";
import { asyncHandler } from "../utils/async-handler.util";

export const consultationController = {
  listPatients: asyncHandler(async (req, res) => {
    res.json(await consultationService.listPatients(req.user!, req.query as unknown as DoctorPatientsQuery));
  }),

  detail: asyncHandler(async (req, res) => {
    res.json(await consultationService.detail(req.user!, req.params.id));
  }),

  addPrescription: asyncHandler(async (req, res) => {
    const fileName = req.header("x-file-name") ?? undefined;
    res.status(201).json({ prescription: await consultationService.addPrescription(req.user!, req.params.id, req.body, fileName) });
  }),

  check: asyncHandler(async (req, res) => {
    await consultationService.check(req.user!, req.params.id);
    res.json({ checked: true });
  }),

  listChecked: asyncHandler(async (req, res) => {
    res.json(await consultationService.listChecked(req.user!, req.query as unknown as CheckedVisitsQuery));
  }),

  removePrescription: asyncHandler(async (req, res) => {
    await consultationService.removePrescription(req.user!, req.params.id);
    res.status(204).end();
  }),

  /** Streams the PDF inline. Auth is a bearer header, so the frontend fetches it as a blob. */
  prescriptionFile: asyncHandler(async (req, res) => {
    const { path, fileName } = await prescriptionService.getFile(req.user!, req.params.id);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename*=UTF-8''${encodeURIComponent(fileName)}`);
    res.setHeader("Cache-Control", "private, no-store");
    res.sendFile(path);
  }),
};
