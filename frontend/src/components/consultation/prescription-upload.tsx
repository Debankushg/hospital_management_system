"use client";

import { Paperclip } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { MAX_PRESCRIPTION_MB } from "@/config/appointment.config";
import { useToast } from "@/hooks/use-toast";
import { useUploadPrescription } from "@/hooks/use-upload-prescription";

/** Pick a PDF and attach it to the visit (checked in the browser first, and again on the server). */
export function PrescriptionUpload({ appointmentId, onUploaded }: { appointmentId: string; onUploaded: () => void }) {
  const upload = useUploadPrescription(appointmentId);
  const toast = useToast();
  const input = useRef<HTMLInputElement>(null);

  const onPick = (file: File | undefined) => {
    if (input.current) input.current.value = "";
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return toast.error("Only PDF files can be attached.");
    }
    if (file.size > MAX_PRESCRIPTION_MB * 1024 * 1024) {
      return toast.error(`The file is larger than ${MAX_PRESCRIPTION_MB} MB.`);
    }
    upload.mutate(file, { onSuccess: onUploaded });
  };

  return (
    <div className="space-y-2">
      <input
        ref={input}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0])}
      />
      <Button variant="secondary" loading={upload.isPending} onClick={() => input.current?.click()}>
        <Paperclip className="size-4" />
        Attach prescription (PDF)
      </Button>
      <p className="text-xs text-slate-500">PDF only, up to {MAX_PRESCRIPTION_MB} MB, max 5 per visit.</p>
    </div>
  );
}
