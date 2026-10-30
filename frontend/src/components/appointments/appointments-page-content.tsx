"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Toolbar } from "@/components/layout/toolbar";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { QueryState } from "@/components/ui/query-state";
import { SearchInput } from "@/components/ui/search-input";
import { Tabs } from "@/components/ui/tabs";
import { APPOINTMENT_STATUSES, APPOINTMENT_STATUS_LABELS } from "@/config/appointment.config";
import { useAppointments } from "@/hooks/use-appointments";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { Appointment, AppointmentStatus } from "@/types/appointment.types";
import { AppointmentsTable } from "./appointments-table";
import { AssignDoctorDrawer } from "./assign-doctor-drawer";

type StatusFilter = AppointmentStatus | "all";

const TAB_OPTIONS: { value: StatusFilter; label: string }[] = [
  ...APPOINTMENT_STATUSES.map((s) => ({ value: s, label: APPOINTMENT_STATUS_LABELS[s] })),
  { value: "all", label: "All" },
];

export function AppointmentsPageContent() {
  const [status, setStatus] = useState<StatusFilter>("requested");
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [assigning, setAssigning] = useState<Appointment | null>(null);
  const debouncedSearch = useDebouncedValue(search);

  const appointments = useAppointments({
    status: status === "all" ? undefined : status,
    date,
    search: debouncedSearch,
    page,
    pageSize,
  });
  const data = appointments.data;

  return (
    <>
      <PageHeader
        title="Appointments"
        description="Review patient requests, check the patient's details, assign an available doctor and approve."
      />
      <Toolbar>
        <Tabs
          options={TAB_OPTIONS}
          value={status}
          onChange={(v) => {
            setStatus(v);
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
      <QueryState isLoading={appointments.isLoading} error={appointments.error}>
        <AppointmentsTable appointments={data?.items ?? []} onAssign={setAssigning} />
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
      {assigning && <AssignDoctorDrawer appointment={assigning} onClose={() => setAssigning(null)} />}
    </>
  );
}
