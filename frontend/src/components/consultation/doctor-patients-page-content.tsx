"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Toolbar } from "@/components/layout/toolbar";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { QueryState } from "@/components/ui/query-state";
import { SearchInput } from "@/components/ui/search-input";
import { Tabs } from "@/components/ui/tabs";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useDoctorPatients } from "@/hooks/use-doctor-patients";
import { ConsultationDrawer } from "./consultation-drawer";
import { DoctorPatientsTable } from "./doctor-patients-table";

type Tab = "approved" | "checked" | "all";

const TABS: { value: Tab; label: string }[] = [
  { value: "approved", label: "To see" },
  { value: "checked", label: "Checked" },
  { value: "all", label: "All" },
];

export function DoctorPatientsPageContent() {
  const [tab, setTab] = useState<Tab>("approved");
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openId, setOpenId] = useState<string | null>(null);
  const debouncedSearch = useDebouncedValue(search);

  const patients = useDoctorPatients({
    status: tab === "all" ? undefined : tab,
    date,
    search: debouncedSearch,
    page,
    pageSize,
  });
  const data = patients.data;

  return (
    <>
      <PageHeader
        title="My patients"
        description="Patients assigned to you. Open one to see their details and records, attach a prescription and mark them as checked."
      />
      <Toolbar>
        <Tabs
          options={TABS}
          value={tab}
          onChange={(v) => {
            setTab(v);
            setPage(1);
          }}
        />
        <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
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
            aria-label="Filter by appointment date"
          />
        </div>
      </Toolbar>
      <QueryState isLoading={patients.isLoading} error={patients.error}>
        <DoctorPatientsTable appointments={data?.items ?? []} onOpen={(a) => setOpenId(a.id)} />
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
      {openId && <ConsultationDrawer appointmentId={openId} onClose={() => setOpenId(null)} />}
    </>
  );
}
