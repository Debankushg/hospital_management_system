import rateLimit from "express-rate-limit";
import { AUTH_RATE_LIMIT } from "../config/constants";

export const authRateLimiter = rateLimit({
  ...AUTH_RATE_LIMIT,
  standardHeaders: true,
  legacyHeaders: false,
});
