import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { MfaSettings } from "@/components/security/mfa-settings";

export const metadata: Metadata = { title: "Security" };

export default function SecurityPage() {
  return (
    <>
      <PageHeader title="Security" description="Protect your account with two-factor authentication." />
      <MfaSettings />
    </>
  );
}
