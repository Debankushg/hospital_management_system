# Hospital Management System

A full-stack hospital management app with role-based access, mandatory MFA for staff, appointments, doctor
consultations with PDF prescriptions, attendance and leave management, Stripe payments, and dashboards with charts.

| Part | Stack | Docs |
|---|---|---|
| **Backend** (REST API) | Node.js · Express · TypeScript · Drizzle ORM · PostgreSQL | **[backend/README.md](backend/README.md)** – architecture diagrams, all 58 API endpoints in tables, database, security, Stripe |
| **Frontend** (web app) | Next.js 16 · TypeScript · Tailwind CSS · Zustand · TanStack Query · Recharts | **[frontend/README.md](frontend/README.md)** – folder structure, pages, UI conventions |

## Roles

Super admin · Admin (assigned to departments) · Doctor (OPD, Gynecologist, Cardiologist, ENT, Dermatologist,
Pediatrician) · Receptionist · Pathologist · Accounts · Patient.

## Quick start

Requires Node.js 20+ and a running PostgreSQL with an empty database (for example `createdb hospital`).

```bash
# 1. Backend  (http://localhost:4000, Swagger at /api/docs)
cd backend
cp .env.example .env      # set DATABASE_URL, JWT_SECRET, MFA_ENCRYPTION_KEY, SUPER_ADMIN_*
npm install
npm run db:migrate
npm run db:seed           # creates the first super admin
npm run dev

# 2. Frontend (http://localhost:3000)
cd ../frontend
npm install
npm run dev
```

Generate secrets with `openssl rand -hex 32`. Never commit your real `.env` (it is git-ignored); keep API keys such as
Stripe's out of `.env.example`.

See the [backend README](backend/README.md) for the full setup, environment variables, API reference and Stripe configuration.
