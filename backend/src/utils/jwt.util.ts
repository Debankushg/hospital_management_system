import jwt from "jsonwebtoken";
import { TOKEN_TTL } from "../config/constants";
import { env } from "../config/env";
import type { TokenStage } from "../types/domain.types";

export const signToken = (userId: string, stage: TokenStage) =>
  jwt.sign({ stage }, env.JWT_SECRET, { subject: userId, expiresIn: TOKEN_TTL[stage] });

export function verifyToken(token: string): { sub: string; stage: TokenStage } {
  const p = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
  return { sub: p.sub as string, stage: p.stage as TokenStage };
}
