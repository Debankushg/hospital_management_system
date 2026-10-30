import type { TokenStage, User } from "./domain.types";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      stage?: TokenStage;
    }
  }
}

export {};
