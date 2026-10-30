import { ApiError } from "@/services/api-error";

/** Turns any thrown value into a readable message (includes first field error if present). */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const firstField = error.details && Object.entries(error.details).find(([, msgs]) => msgs?.length);
    return firstField ? `${error.message}: ${firstField[0]} – ${firstField[1]![0]}` : error.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}
