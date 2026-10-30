import { CopyButton } from "@/components/ui/copy-button";
import type { MfaSetupResponse } from "@/types/auth.types";

/** QR code plus the manual-entry key (with a copy button) for authenticator apps. */
export function MfaKeyDisplay({ data }: { data: MfaSetupResponse }) {
  return (
    <div className="space-y-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={data.qrCodeDataUrl}
        alt="MFA QR code"
        className="mx-auto size-48 rounded-xl border border-slate-200 bg-surface p-2"
      />
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-medium text-slate-500">Setup key (type it into your authenticator app)</p>
        <div className="mt-1.5 flex items-center justify-between gap-3">
          <code className="break-all font-mono text-sm font-semibold tracking-wider text-slate-900">
            {data.secret.match(/.{1,4}/g)?.join(" ")}
          </code>
          <CopyButton text={data.secret} />
        </div>
      </div>
    </div>
  );
}
