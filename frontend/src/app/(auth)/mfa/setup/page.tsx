import type { Metadata } from "next";
import { MfaSetupScreen } from "@/components/auth/mfa-setup-screen";

export const metadata: Metadata = { title: "Set up MFA" };

export default function MfaSetupPage() {
  return <MfaSetupScreen />;
}
