"use client";

import { Check, ClipboardList, Trash2, X } from "lucide-react";
import { RoleBadge } from "@/components/users/role-badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { RowActions, Table, Td, Th, THead, Tr } from "@/components/ui/table";
import { LEAVE_LABELS } from "@/config/hr.config";
import { useDeleteLeave } from "@/hooks/use-delete-leave";
import { useDialogs } from "@/hooks/use-dialogs";
import { useReviewLeave } from "@/hooks/use-review-leave";
import type { Leave } from "@/types/leave.types";
import { LeavePeriod } from "./leave-period";
import { LeaveStatusBadge } from "./leave-status-badge";

/** Leave of the staff an admin manages, with approve / reject / delete actions (feedback via toasts). */
export function LeavesTable({ leaves, emptyMessage = "No leave found." }: { leaves: Leave[]; emptyMessage?: string }) {
  const review = useReviewLeave();
  const remove = useDeleteLeave();
  const { confirm, prompt } = useDialogs();
  const busy = review.isPending || remove.isPending;

  const reject = async (leave: Leave) => {
    const note = await prompt({
      title: "Reject leave request",
      message: `${leave.userName}'s request will be marked as rejected.`,
      label: "Reason (optional)",
      placeholder: "e.g. Short staffed that week",
      confirmLabel: "Reject request",
      tone: "danger",
    });
    if (note !== null) review.mutate({ id: leave.id, status: "rejected", note: note || undefined });
  };

  const del = async (leave: Leave) => {
    const ok = await confirm({
      title: "Delete this leave record?",
      message: `The ${LEAVE_LABELS[leave.leaveType].toLowerCase()} for ${leave.userName} will be removed.`,
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (ok) remove.mutate(leave.id);
  };

  if (!leaves.length) return <EmptyState icon={ClipboardList} title="No leave" message={emptyMessage} />;

  return (
    <Table>
      <THead>
        <tr>
          <Th>Staff member</Th>
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
            <Td>
              <p className="mb-1 font-medium text-slate-900">{l.userName}</p>
              <RoleBadge role={l.userRole} />
            </Td>
            <Td>{LEAVE_LABELS[l.leaveType]}</Td>
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
                {l.status === "pending" ? (
                  <>
                    <Button size="sm" disabled={busy} onClick={() => review.mutate({ id: l.id, status: "approved" })}>
                      <Check className="size-3.5" />
                      Approve
                    </Button>
                    <Button size="sm" variant="secondary" disabled={busy} onClick={() => reject(l)}>
                      <X className="size-3.5" />
                      Reject
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="ghost" disabled={busy} onClick={() => del(l)}>
                    <Trash2 className="size-3.5" />
                    Delete
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
