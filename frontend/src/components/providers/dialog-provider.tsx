"use client";

import { AlertTriangle, HelpCircle } from "lucide-react";
import { createContext, useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/utils/cn";

export interface ConfirmOptions {
  title: string;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** `danger` = red confirm button for destructive actions. */
  tone?: "primary" | "danger";
}

export interface PromptOptions extends ConfirmOptions {
  label: string;
  placeholder?: string;
  /** Block confirming an empty value. */
  required?: boolean;
}

export interface DialogApi {
  /** In-app replacement for window.confirm(): resolves true when confirmed. */
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  /** In-app replacement for window.prompt(): resolves the text, or null when cancelled. */
  prompt: (options: PromptOptions) => Promise<string | null>;
}

export const DialogContext = createContext<DialogApi | null>(null);

type Active =
  | { kind: "confirm"; options: ConfirmOptions; resolve: (v: boolean) => void }
  | { kind: "prompt"; options: PromptOptions; resolve: (v: string | null) => void };

export function DialogProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<Active | null>(null);
  const [value, setValue] = useState("");
  const activeRef = useRef<Active | null>(null);
  activeRef.current = active;

  const api = useMemo<DialogApi>(
    () => ({
      confirm: (options) => new Promise((resolve) => setActive({ kind: "confirm", options, resolve })),
      prompt: (options) =>
        new Promise((resolve) => {
          setValue("");
          setActive({ kind: "prompt", options, resolve });
        }),
    }),
    [],
  );

  const close = useCallback((confirmed: boolean) => {
    const current = activeRef.current;
    if (!current) return;
    if (current.kind === "confirm") current.resolve(confirmed);
    else current.resolve(confirmed ? value.trim() : null);
    setActive(null);
  }, [value]);

  const danger = active?.options.tone === "danger";
  const blocked = active?.kind === "prompt" && !!active.options.required && !value.trim();

  return (
    <DialogContext.Provider value={api}>
      {children}
      {active && (
        <Modal
          size="sm"
          title={active.options.title}
          onClose={() => close(false)}
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => close(false)}>
                {active.options.cancelLabel ?? "Cancel"}
              </Button>
              <Button variant={danger ? "danger" : "primary"} disabled={blocked} onClick={() => close(true)}>
                {active.options.confirmLabel ?? "Confirm"}
              </Button>
            </div>
          }
        >
          <div className="flex gap-4">
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full",
                danger ? "bg-red-50 text-red-600" : "bg-brand-50 text-brand-ink",
              )}
            >
              {danger ? <AlertTriangle className="size-5" /> : <HelpCircle className="size-5" />}
            </span>
            <div className="min-w-0 flex-1 space-y-3 text-sm leading-relaxed text-slate-600">
              {active.options.message && <div>{active.options.message}</div>}
              {active.kind === "prompt" && (
                <label className="block space-y-1.5">
                  <span className="font-medium text-slate-700">{active.options.label}</span>
                  <Input
                    autoFocus
                    value={value}
                    placeholder={active.options.placeholder}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !blocked && close(true)}
                  />
                </label>
              )}
            </div>
          </div>
        </Modal>
      )}
    </DialogContext.Provider>
  );
}
