"use client";

import { ExternalLink, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useDeletePrescription } from "@/hooks/use-delete-prescription";
import { useDialogs } from "@/hooks/use-dialogs";
import { useOpenPrescription } from "@/hooks/use-open-prescription";
import type { Prescription } from "@/types/appointment.types";
import { formatDate } from "@/utils/format-date.util";
import { formatFileSize } from "@/utils/format-file-size.util";

interface PrescriptionListProps {
  prescriptions: Prescription[];
  /** Show delete for prescriptions the signed-in doctor attached. */
  allowDelete?: boolean;
  emptyText?: string;
}

/** PDF prescriptions with an "Open" button (downloaded with the user's token, shown in a new tab). */
export function PrescriptionList({ prescriptions, allowDelete, emptyText = "No prescription attached." }: PrescriptionListProps) {
  const me = useCurrentUser();
  const open = useOpenPrescription();
  const remove = useDeletePrescription();
  const { confirm } = useDialogs();

  const onDelete = async (p: Prescription) => {
    const ok = await confirm({
      title: "Delete prescription?",
      message: `${p.fileName} will be removed from this visit.`,
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (ok) remove.mutate(p.id);
  };

  if (!prescriptions.length) return <p className="text-sm text-slate-500">{emptyText}</p>;

  return (
    <ul className="divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200 bg-surface text-sm">
      {prescriptions.map((p) => (
        <li key={p.id} className="flex items-center justify-between gap-3 p-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <FileText className="size-[18px]" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-900">{p.fileName}</p>
              <p className="text-xs text-slate-500">
                {formatFileSize(p.sizeBytes)} · {formatDate(p.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="secondary" size="sm" disabled={open.isPending} onClick={() => open.mutate(p.id)}>
              <ExternalLink className="size-3.5" />
              Open
            </Button>
            {allowDelete && p.doctorId === me?.id && (
              <Button variant="ghost" size="sm" aria-label={`Delete ${p.fileName}`} disabled={remove.isPending} onClick={() => onDelete(p)}>
                <Trash2 className="size-3.5 text-red-600" />
              </Button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
