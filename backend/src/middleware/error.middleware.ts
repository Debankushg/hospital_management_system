import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { HttpError } from "../utils/http-error.util";

export const notFound = (_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
};

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message, details: err.details });
  }
  if ((err as { type?: string })?.type === "entity.too.large") {
    return res.status(413).json({ error: "File too large (max 5 MB)" });
  }
  // Postgres unique violation
  if ((err as { code?: string })?.code === "23505") {
    return res.status(409).json({ error: "Resource already exists" });
  }
  console.error(err);
  res.status(500).json({ error: env.NODE_ENV === "production" ? "Internal server error" : String(err) });
};
