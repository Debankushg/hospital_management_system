"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { QueryState } from "@/components/ui/query-state";
import { useMyLeaves } from "@/hooks/use-my-leaves";
import { MyLeavesTable } from "./my-leaves-table";
import { RequestLeaveForm } from "./request-leave-form";

export function MyLeavePageContent() {
  const leaves = useMyLeaves();
  const [requesting, setRequesting] = useState(false);

  return (
    <>
      <PageHeader
        title="My leave"
        description="Request leave. Your department admin will approve or reject it."
        actions={
          <Button onClick={() => setRequesting(true)}>
            <Plus className="size-4" />
            Request leave
          </Button>
        }
      />
      <QueryState isLoading={leaves.isLoading} error={leaves.error}>
        <MyLeavesTable leaves={leaves.data ?? []} />
      </QueryState>
      {requesting && (
        <Modal title="Request leave" onClose={() => setRequesting(false)}>
          <RequestLeaveForm onDone={() => setRequesting(false)} />
        </Modal>
      )}
    </>
  );
}
