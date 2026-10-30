import type { Metadata } from "next";
import { DoctorsPageContent } from "@/components/doctors/doctors-page-content";

export const metadata: Metadata = { title: "Doctors" };

export default function DoctorsPage() {
  return <DoctorsPageContent />;
}
