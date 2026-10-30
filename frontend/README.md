# Hospital Management – Frontend

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Zustand · TanStack Query · Zod · React Hook Form

## Run
```bash
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:4000
npm install
npm run dev                  # http://localhost:3000
```
The backend (`../backend`) must be running.

## Structure (`src/`)
| Folder | Purpose |
|---|---|
| `app/` | Routes only (thin pages). `(auth)` = login, register, MFA; `(dashboard)` = signed-in pages |
| `components/ui` | Reusable primitives: button, input, select, modal, table, badge, alert… |
| `components/layout` | Sidebar, topbar, dashboard shell, page header |
| `components/auth` | Login/register/MFA forms, guards (`AuthGuard`, `GuestOnly`, `RoleGuard`) |
| `components/users` `admins` `department` `calendar` `charts` `attendance` `leaves` `patients` `appointments` `consultation` `checked-visits` `doctors` `security` `dashboard` | Feature components |
| `components/providers` | React Query provider, store hydrator |
| `services/` | API calls (`api-client.ts` + one file per backend module) |
| `hooks/` | TanStack Query hooks (one per query/mutation) and auth/guard hooks |
| `store/` | Zustand stores: `auth.store` (session), `mfa-flow.store` (temporary MFA tokens) |
| `validators/` | Zod schemas (mirror backend rules) |
| `types/` | Shared TypeScript types |
| `config/` | env, routes, roles/labels, nav, query keys, HR enums |
| `utils/` | cn, formatting, error messages, helpers |

Request flow: `page → component → hook (TanStack Query) → service → api-client → backend`.

## UI conventions
- **No browser dialogs.** Never use `window.alert/confirm/prompt`. Use `useDialogs()` → `await confirm({...})` / `await prompt({...})` (in-app dialogs) and toasts for feedback.
- **Toasts via mutation meta.** A mutation hook adds `meta: { successMessage: "…", toastError: true }`; the QueryProvider shows the toast. Forms keep inline error text.
- **Modal vs Drawer.** `Modal` = short forms and confirmations. `Drawer` (right side) = detail views: patient, consultation, assign doctor.
- **List page layout.** `PageHeader` (title + primary action) → `Toolbar` (search / filters / tabs) → table → `Pagination`. Use `PersonCell`, `RowActions`, `Badge`, `EmptyState`, `QueryState` (skeleton loading).
- **Dark / light theme with neon glow.** `ThemeToggle` (Light · System · Dark) in the top bar and on the sign-in pages; the choice is saved and "System" follows the OS. An inline script in `layout.tsx` applies it before first paint (no flash). The dark palette lives in `globals.css` under `.dark`: it remaps the Tailwind colour variables (slate inverted, tinted backgrounds darkened), so components use the normal classes. Use `bg-surface` (not `bg-white`) for cards/inputs and `text-brand-ink` for brand text; `text-white` stays white. Glow colours are `--glow` / `--glow-2`, used like `shadow-[0_0_18px_-4px_var(--glow)]`.
- **Dashboard charts (Recharts).** `DashboardCharts` picks charts by priority: patient volume → everyone; revenue → super admin, accounts, reception; checked vs to-see per doctor → doctors and super admin. Revenue = consultation fee of *checked* visits (the fee is stored when the doctor checks the patient). Chart colours are the `--chart-*` CSS variables; the `neon-chart` class adds the glow. Staff also get their own `AttendanceCalendar` on the dashboard.
- Icons: `lucide-react`. Dev overlays (Next.js indicator, React Query devtools) are disabled.

## Pages
| Route | Who |
|---|---|
| `/login`, `/register`, `/mfa/verify`, `/mfa/setup` | public / login flow |
| `/dashboard`, `/doctors`, `/security` | any signed-in user |
| `/users` | super admin, admin (within assigned areas) |
| `/department`, `/attendance`, `/leaves` | super admin, admin – departments, duty time, attendance, approve/reject leave |
| `/patients`, `/appointments` | reception access (receptionist, admin who works as a receptionist or is assigned Reception management, super admin) – patient list, edit patient, assign an available doctor and approve. Deleting a patient: reception admin / super admin only |
| `/attendance-calendar` | all staff (own calendar) · admins & super admin (any staff they manage): month grid + day list of attendance |
| `/my-patients` | doctors (and admins who work as a doctor) – assigned patients with details & records, attach prescription PDF, mark as checked |
| `/checked-patients` | reception, accounts, super admin – patients checked by doctors (auto-refreshing) |
| `/payments` | accounts, admins assigned the Accounts department, super admin – collect fees via Stripe Checkout (redirects to Stripe, returns and confirms) |
| `/my-appointments` | patient – request an appointment, track status |
| `/my-leave` | admin and all staff roles – request leave, see status |
| `/admins` | super admin |

## Auth flow
1. `/login` → backend returns `authenticated`, `mfa_required` or `mfa_setup_required`.
2. `mfa_required` → `/mfa/verify` (authenticator or recovery code).
3. `mfa_setup_required` (all staff on first login) → `/mfa/setup` (QR code → confirm → save recovery codes).
4. The session token is kept in `localStorage` (zustand persist); temporary MFA tokens live in `sessionStorage`.
