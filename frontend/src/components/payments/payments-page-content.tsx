"use client";

import { Suspense, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Toolbar } from "@/components/layout/toolbar";
import { Pagination } from "@/components/ui/pagination";
import { QueryState } from "@/components/ui/query-state";
import { SearchInput } from "@/components/ui/search-input";
import { Tabs } from "@/components/ui/tabs";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useReceivables } from "@/hooks/use-receivables";
import type { ReceivablesParams } from "@/services/payment.service";
import { PaymentReturnHandler } from "./payment-return-handler";
import { PaymentSummary } from "./payment-summary";
import { PaymentsTable } from "./payments-table";

const TABS: { value: ReceivablesParams["status"]; label: string }[] = [
  { value: "unpaid", label: "To collect" },
  { value: "paid", label: "Paid" },
  { value: "all", label: "All" },
];

export function PaymentsPageContent() {
  const [status, setStatus] = useState<ReceivablesParams["status"]>("unpaid");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const debouncedSearch = useDebouncedValue(search);

  const visits = useReceivables({ status, search: debouncedSearch, page, pageSize });
  const data = visits.data;

  return (
    <>
      <Suspense>
        <PaymentReturnHandler />
      </Suspense>
      <PageHeader
        title="Payments"
        description="Collect consultation fees for checked visits. Cards are entered on Stripe's secure page."
      />
      <PaymentSummary />
      <Toolbar>
        <Tabs
          options={TABS}
          value={status}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        />
        <SearchInput
          placeholder="Search patient…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </Toolbar>
      <QueryState isLoading={visits.isLoading} error={visits.error}>
        <PaymentsTable visits={data?.items ?? []} />
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
