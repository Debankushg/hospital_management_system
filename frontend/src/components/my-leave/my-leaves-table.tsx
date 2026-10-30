"use client";

import { CalendarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { RowActions, Table, Td, Th, THead, Tr } from "@/components/ui/table";
import { LEAVE_LABELS } from "@/config/hr.config";
import { LeavePeriod } from "@/components/leaves/leave-period";
import { LeaveStatusBadge } from "@/components/leaves/leave-status-badge";
import { useDeleteLeave } from "@/hooks/use-delete-leave";
import { useDialogs } from "@/hooks/use-dialogs";
import type { Leave } from "@/types/leave.types";

export function MyLeavesTable({ leaves }: { leaves: Leave[] }) {
  const cancel = useDeleteLeave();
  const { confirm } = useDialogs();

  const onCancel = async (leave: Leave) => {
    const ok = await confirm({
      title: "Cancel this request?",
      message: `Your ${LEAVE_LABELS[leave.leaveType].toLowerCase()} request will be withdrawn.`,
      confirmLabel: "Cancel request",
      cancelLabel: "Keep it",
      tone: "danger",
    });
    if (ok) cancel.mutate(leave.id);
  };

  if (!leaves.length) {
    return <EmptyState icon={CalendarOff} title="No leave requests" message="Requests you submit will appear here with their status." />;
  }

  return (
    <Table>
      <THead>
        <tr>
          <Th>Type</Th>
          <Th>Period</Th>
          <Th>Reason</Th>
          <Th>Status</Th>
          <Th />
        </tr>
      </THead>
      <tbody>
        {leaves.map((l) => (
          <Tr key={l.id}>
            <Td className="font-medium text-slate-900">{LEAVE_LABELS[l.leaveType]}</Td>
            <Td className="whitespace-nowrap">
              <LeavePeriod startDate={l.startDate} endDate={l.endDate} />
            </Td>
            <Td className="max-w-56 text-slate-600">{l.reason ?? "–"}</Td>
            <Td>
              <LeaveStatusBadge status={l.status} />
              {l.reviewNote && <p className="mt-1 text-xs text-slate-500">{l.reviewNote}</p>}
            </Td>
            <Td className="text-right">
              <RowActions>
                {l.status === "pending" && (
                  <Button size="sm" variant="secondary" disabled={cancel.isPending} onClick={() => onCancel(l)}>
                    Cancel request
                  </Button>
                )}
              </RowActions>
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}
