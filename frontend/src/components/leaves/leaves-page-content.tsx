"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Toolbar } from "@/components/layout/toolbar";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { QueryState } from "@/components/ui/query-state";
import { Tabs } from "@/components/ui/tabs";
import { LEAVE_STATUSES, LEAVE_STATUS_LABELS } from "@/config/hr.config";
import { useLeaves } from "@/hooks/use-leaves";
import type { LeaveStatus } from "@/types/leave.types";
import { LeavesTable } from "./leaves-table";
import { RecordLeaveForm } from "./record-leave-form";

type Filter = LeaveStatus | "all";

const TABS: { value: Filter; label: string }[] = [
  ...LEAVE_STATUSES.map((s) => ({ value: s, label: LEAVE_STATUS_LABELS[s] })),
  { value: "all", label: "All" },
];

export function LeavesPageContent() {
  const [filter, setFilter] = useState<Filter>("pending");
  const [recording, setRecording] = useState(false);
  const leaves = useLeaves(filter === "all" ? undefined : filter);

  return (
    <>
      <PageHeader
        title="Leave requests"
        description="Approve or reject leave requested by staff in your departments, or record leave yourself."
        actions={
          <Button onClick={() => setRecording(true)}>
            <Plus className="size-4" />
            Record leave
          </Button>
        }
      />
      <Toolbar>
        <Tabs options={TABS} value={filter} onChange={setFilter} />
      </Toolbar>
      <QueryState isLoading={leaves.isLoading} error={leaves.error}>
        <LeavesTable
          leaves={leaves.data ?? []}
          emptyMessage={filter === "pending" ? "No pending leave requests." : "No leave found."}
        />
      </QueryState>
      {recording && (
        <Modal title="Record leave" description="Recorded leave is approved immediately." onClose={() => setRecording(false)}>
          <RecordLeaveForm onDone={() => setRecording(false)} />
        </Modal>
      )}
    </>
  );
}
