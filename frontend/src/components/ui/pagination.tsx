import { ChevronLeft, ChevronRight } from "lucide-react";
import { PAGE_SIZES } from "@/config/appointment.config";
import { Button } from "./button";
import { Select } from "./select";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function Pagination({ page, totalPages, total, pageSize, onPageChange, onPageSizeChange }: PaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-3 text-sm text-slate-600 sm:flex-row">
      <span>
        Showing <strong className="font-semibold text-slate-900">{from}–{to}</strong> of{" "}
        <strong className="font-semibold text-slate-900">{total}</strong>
      </span>
      <div className="flex items-center gap-2">
        <Select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="h-9 w-28"
          aria-label="Rows per page"
        >
          {PAGE_SIZES.map((s) => (
            <option key={s} value={s}>
              {s} / page
            </option>
          ))}
        </Select>
        <Button variant="secondary" size="sm" className="h-9" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft className="size-4" />
          Prev
        </Button>
        <span className="min-w-16 text-center text-xs text-slate-500">
          {page} / {totalPages}
        </span>
        <Button
          variant="secondary"
          size="sm"
          className="h-9"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
