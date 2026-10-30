"use client";

import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Toolbar } from "@/components/layout/toolbar";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { QueryState } from "@/components/ui/query-state";
import { SearchInput } from "@/components/ui/search-input";
import { useCheckedVisits } from "@/hooks/use-checked-visits";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { CheckedVisitsTable } from "./checked-visits-table";

export function CheckedVisitsPageContent() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const debouncedSearch = useDebouncedValue(search);

  const visits = useCheckedVisits({ date, search: debouncedSearch, page, pageSize });
  const data = visits.data;

  return (
    <>
      <PageHeader title="Checked patients" description="Patients the doctors have checked, newest first." />
      <Toolbar>
        <SearchInput
          placeholder="Search patient…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <Input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setPage(1);
          }}
          className="w-40"
          aria-label="Filter by visit date"
        />
        <span className="ml-auto flex items-center gap-1.5 text-xs text-slate-500">
          <RefreshCw className={`size-3.5 ${visits.isFetching ? "animate-spin" : ""}`} />
          Updates automatically
        </span>
      </Toolbar>
      <QueryState isLoading={visits.isLoading} error={visits.error}>
        <CheckedVisitsTable visits={data?.items ?? []} />
        {data && (
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            total={data.total}
            pageSize={data.pageSize}
            onPageChange={setPage}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setPage(1);
            }}
          />
        )}
      </QueryState>
    </>
  );
}
