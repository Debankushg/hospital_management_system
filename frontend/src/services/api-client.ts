import { API_URL } from "@/config/env.config";
import { useAuthStore } from "@/store/auth.store";
import type { ApiErrorBody } from "@/types/api.types";
import { ApiError } from "./api-error";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | undefined>;
  /**
   * Bearer token to use. Leave undefined to use the signed-in user's token,
   * pass a string for short-lived MFA tokens, or `null` for no auth header.
   */
  token?: string | null;
  /** Extra request headers (e.g. the file name for uploads). */
  headers?: Record<string, string>;
  /** Return the response body as a Blob (PDF downloads). */
  asBlob?: boolean;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, query, token, headers, asBlob } = options;
  const authToken = token !== undefined ? token : useAuthStore.getState().token;

  const params = new URLSearchParams();
  Object.entries(query ?? {}).forEach(([k, v]) => v && params.set(k, v));
  const qs = params.size ? `?${params}` : "";

  const res = await fetch(`${API_URL}/api${path}${qs}`, {
    method,
    headers: {
      // A File/Blob body is sent as-is with its own type; everything else is JSON.
      ...(body !== undefined && !(body instanceof Blob) && { "Content-Type": "application/json" }),
      ...(body instanceof Blob && { "Content-Type": body.type }),
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...headers,
    },
    body: body === undefined ? undefined : body instanceof Blob ? body : JSON.stringify(body),
  });

  if (res.status === 204) return undefined as T;
  if (asBlob && res.ok) return (await res.blob()) as T;

  const data = (await res.json().catch(() => ({}))) as ApiErrorBody & T;
  if (!res.ok) {
    // An expired/invalid session token: sign the user out.
    if (res.status === 401 && token === undefined && authToken) useAuthStore.getState().logout();
    throw new ApiError(res.status, data.error ?? "Request failed", data.details);
  }
  return data;
}
