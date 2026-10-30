import type { Metadata } from "next";
import { MfaVerifyForm } from "@/components/auth/mfa-verify-form";

export const metadata: Metadata = { title: "Verify code" };

export default function MfaVerifyPage() {
  return <MfaVerifyForm />;
}
