"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Toolbar } from "@/components/layout/toolbar";
import { Pagination } from "@/components/ui/pagination";
import { QueryState } from "@/components/ui/query-state";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { usePatients } from "@/hooks/use-patients";
import type { PatientSortBy } from "@/types/patient.types";
import { PatientDetailDrawer } from "./patient-detail-drawer";
import { PatientsTable } from "./patients-table";

const SORT_OPTIONS = [
  { value: "name:asc", label: "Name (A–Z)" },
  { value: "name:desc", label: "Name (Z–A)" },
  { value: "joined:desc", label: "Newest first" },
  { value: "joined:asc", label: "Oldest first" },
];

export function PatientsPageContent() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name:asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const debouncedSearch = useDebouncedValue(search);

  const [sortBy, order] = sort.split(":") as [PatientSortBy, "asc" | "desc"];
  const patients = usePatients({ search: debouncedSearch, sortBy, order, page, pageSize });
  const data = patients.data;

  return (
    <>
      <PageHeader title="Patients" description="All registered patients. Open a patient to see details, edit, or book an appointment." />
      <Toolbar>
        <SearchInput
          placeholder="Search by name, email or phone…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <Select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="w-44"
          aria-label="Sort patients"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </Toolbar>
      <QueryState isLoading={patients.isLoading} error={patients.error}>
        <PatientsTable patients={data?.items ?? []} onView={(p) => setViewingId(p.id)} />
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
      {viewingId && <PatientDetailDrawer patientId={viewingId} onClose={() => setViewingId(null)} />}
    </>
  );
}
