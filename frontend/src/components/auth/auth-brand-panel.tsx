import { CalendarCheck, FileText, ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";

const FEATURES = [
  { icon: ShieldCheck, title: "Secure by design", text: "Two-factor authentication for every staff account." },
  { icon: CalendarCheck, title: "Smooth appointments", text: "Patients book, reception assigns an available doctor." },
  { icon: FileText, title: "Connected care", text: "Doctors, reception and accounts share one record." },
];

/** Left half of the sign-in screens (desktop only). */
export function AuthBrandPanel() {
  return (
    <aside className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-brand-700 via-brand-800 to-brand-900 dark:from-brand-800 dark:via-brand-900 dark:to-[#06131f] p-12 text-white lg:flex">
      <div className="pointer-events-none absolute -right-24 -top-24 size-[28rem] rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-16 size-[28rem] rounded-full bg-violet-500/30 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <BrandLogo light className="relative" />

      <div className="relative max-w-md space-y-8">
        <div>
          <h2 className="bg-linear-to-r from-white to-cyan-200 bg-clip-text text-3xl font-semibold leading-tight tracking-tight text-transparent">
            Run your hospital with clarity.
          </h2>
          <p className="mt-3 text-white/80">
            One place for patients, doctors, reception, accounts and administration.
          </p>
        </div>
        <ul className="space-y-5">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/20 shadow-[0_0_20px_-6px_rgb(94_234_212/0.9)]">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="font-medium">{title}</p>
                <p className="text-sm text-white/80">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-xs text-white/60">© {new Date().getFullYear()} Hospital Management System</p>
    </aside>
  );
}
