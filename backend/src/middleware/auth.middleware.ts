import type { NextFunction, Request, Response } from "express";
import { userRepository } from "../repositories";
import type { TokenStage } from "../types/domain.types";
import { HttpError } from "../utils/http-error.util";
import { verifyToken } from "../utils/jwt.util";

/** Verifies the bearer token and only accepts the listed stages (default: full). */
export const authenticate =
  (...stages: TokenStage[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const allowed: TokenStage[] = stages.length ? stages : ["full"];
      const header = req.headers.authorization;
      if (!header?.startsWith("Bearer ")) throw new HttpError(401, "Missing bearer token");

      let claims;
      try {
        claims = verifyToken(header.slice(7));
      } catch {
        throw new HttpError(401, "Invalid or expired token");
      }
      if (!allowed.includes(claims.stage)) {
        throw new HttpError(
          403,
          claims.stage === "mfa_setup" ? "MFA enrolment required" : "Insufficient authentication stage",
        );
      }

      const user = await userRepository.findById(claims.sub);
      if (!user || !user.isActive) throw new HttpError(401, "Account unavailable");

      req.user = user;
      req.stage = claims.stage;
      next();
    } catch (e) {
      next(e);
    }
  };
