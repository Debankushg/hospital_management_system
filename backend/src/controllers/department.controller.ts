import { departmentService } from "../services";
import { asyncHandler } from "../utils/async-handler.util";
import { toPublicUser } from "../utils/user.mapper";

export const departmentController = {
  overview: asyncHandler(async (req, res) => {
    const [departments, unplacedAdmins] = await Promise.all([
      departmentService.overview(req.user!),
      departmentService.adminsWithoutProfession(req.user!),
    ]);
    res.json({ departments, unplacedAdmins });
  }),

  staff: asyncHandler(async (req, res) => {
    res.json({ staff: (await departmentService.listStaff(req.user!)).map(toPublicUser) });
  }),
};
