import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";
import { HttpError } from "../utils/http-error.util";

type Source = "body" | "query" | "params";

/** Generic request validator: parses `req[source]` with a zod schema and replaces it with the parsed value. */
export const validate =
  (schema: ZodTypeAny, source: Source = "body") =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return next(new HttpError(400, "Validation failed", result.error.flatten().fieldErrors));
    }
    (req as any)[source] = result.data;
    next();
  };
