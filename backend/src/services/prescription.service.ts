import { appointmentRepository, prescriptionRepository } from "../repositories";
import type { User } from "../types/domain.types";
import { HttpError } from "../utils/http-error.util";
import { prescriptionFilePath } from "../utils/file-storage.util";
import { permissionService } from "./permission.service";

export const prescriptionService = {
  /**
   * Who may open a prescription file: the patient it belongs to, doctors treating that patient,
   * reception staff (to hand it to the patient) and the super admin. Accounts only sees that one exists.
   */
  async getFile(actor: User, id: string) {
    const rx = await prescriptionRepository.findById(id);
    if (!rx) throw new HttpError(404, "Prescription not found");

    const allowed =
      rx.patientId === actor.id ||
      rx.doctorId === actor.id ||
      (permissionService.isDoctor(actor) && (await appointmentRepository.doctorTreatsPatient(actor.id, rx.patientId))) ||
      (await permissionService.canUseReception(actor));
    if (!allowed) throw new HttpError(403, "You do not have access to this prescription");

    return { path: prescriptionFilePath(rx.storedName), fileName: rx.fileName };
  },
};
