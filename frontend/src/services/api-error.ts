import type { ApiErrorBody } from "@/types/api.types";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: ApiErrorBody["details"],
  ) {
    super(message);
  }
}
