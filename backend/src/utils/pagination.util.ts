import type { Paginated } from "../types/pagination.types";

export const offsetOf = (page: number, pageSize: number) => (page - 1) * pageSize;

export const toPage = <T>(items: T[], total: number, page: number, pageSize: number): Paginated<T> => ({
  items,
  page,
  pageSize,
  total,
  totalPages: Math.max(1, Math.ceil(total / pageSize)),
});

/** Escapes % and _ so user input is matched literally by ILIKE. */
export const likePattern = (search: string) => `%${search.replace(/[\\%_]/g, "\\$&")}%`;
