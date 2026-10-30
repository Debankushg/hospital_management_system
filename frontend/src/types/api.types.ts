export interface ApiErrorBody {
  error?: string;
  details?: Record<string, string[] | undefined>;
}
