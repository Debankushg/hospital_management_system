import { useContext } from "react";
import { DialogContext, type DialogApi } from "@/components/providers/dialog-provider";

/** `const { confirm, prompt } = useDialogs()` - in-app replacements for window.confirm / window.prompt. */
export function useDialogs(): DialogApi {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useDialogs must be used inside <DialogProvider>");
  return ctx;
}
