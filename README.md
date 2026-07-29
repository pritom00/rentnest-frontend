# RentNest — Frontend

A Next.js (App Router) frontend for RentNest, a rental property marketplace. Consumes the [RentNest backend API](https://rentnest-backend1.onrender.com) (Node/Express/Prisma/Postgres/Stripe).

## Design system: "Ledger & Plaque"

A deliberately editorial black-and-white look, built around the idea of a building directory or property ledger rather than a generic SaaS dashboard:

- **Fraunces** (serif, italic) for headings — evokes established real-estate signage
- **Inter** for body/UI text — legible in dense dashboards and tables
- **IBM Plex Mono** for prices, dates, and reference numbers — used functionally, not decoratively
- **Zero border-radius, hairline 1px borders, no shadows** — a "printed ledger" feel
- **Monochrome status system** — pending/approved/active/completed are distinguished by weight and fill (outline → filled → muted), with a single restrained **"stamp red"** accent reserved only for errors, rejections, and destructive actions — like a rubber ink-stamp on a paper form
- **The "plaque" motif** — every property, rental request, and payment carries a small reference tag (e.g. `UNIT No. A3F912`), echoed in loading skeletons and the 404 page

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS (custom design tokens, no default component library skin) |
| Forms | React Hook Form + Zod |
| Server state | TanStack Query |
| Client state | Zustand (auth session) |
| Auth | JWT from the backend, stored in cookies for middleware-based route protection |
| Payments | Stripe Checkout (redirect flow) |
| Notifications | Sonner (toasts) |

## ✅ Mandatory Requirements Checklist

| # | Requirement | Where |
|---|---|---|
| 1 | API Integration & Documentation | Every backend endpoint is consumed — see [`API_INTEGRATION.md`](./API_INTEGRATION.md) |
| 2 | Consistent UI error handling | `src/lib/handle-error.ts` — toasts for all API errors, inline field errors from Zod `errorDetails`, `error.tsx`/`not-found.tsx`/`global-error.tsx` boundaries |
| 3 | 20+ meaningful frontend commits | `git log --oneline` |
| 4 | Form validation (Zod + React Hook Form) | `src/lib/validations/*.ts`, used in every form |
| 5 | Admin credentials | See below |
| 6 | Payment integration (Stripe) | Real Stripe Checkout redirect — `src/app/dashboard/tenant/requests/[id]/pay`, `src/app/payment/success`, `src/app/payment/cancel` |

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
```
Set `NEXT_PUBLIC_API_URL` to your backend's API base URL (defaults to the live deployed backend):
```env
NEXT_PUBLIC_API_URL="https://rentnest-backend1.onrender.com/api"
```
For local backend development, use `http://localhost:5000/api` instead.

### 3. Run the dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 4. Build for production
```bash
npm run build
npm start
```

## 🔑 Test Accounts

Uses the same seeded accounts as the backend:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@rentnest.com` | `Admin@12345` |
| Landlord | `landlord@rentnest.com` | `Landlord@123` |
| Tenant | `tenant@rentnest.com` | `Tenant@123` |

## Role-based routing

`src/middleware.ts` protects dashboard routes at the edge:

- `/dashboard/tenant/*` — requires role `TENANT`
- `/dashboard/landlord/*` — requires role `LANDLORD`
- `/dashboard/admin/*` — requires role `ADMIN`

Unauthenticated visitors are redirected to `/auth/login?next=<original path>`. Authenticated users with the wrong role are redirected to their own dashboard instead of hitting a dead end.

## Payment flow

1. Tenant submits a rental request → landlord approves it
2. Tenant visits `/dashboard/tenant/requests/[id]/pay` and clicks **Pay with Stripe**
3. Frontend calls `POST /api/payments/create`, receives a real Stripe Checkout `checkoutUrl`, and redirects the browser to it
4. After paying (or cancelling) on Stripe's hosted page, the user is redirected back to `/payment/success?session_id=...` or `/payment/cancel`
5. The success page calls `POST /api/payments/confirm` with that `session_id` to verify the payment server-side and update the rental to `ACTIVE`

**Important deployment note:** the backend's `CLIENT_SUCCESS_URL` and `CLIENT_CANCEL_URL` environment variables must point at this frontend's deployed URL (e.g. `https://your-frontend.vercel.app/payment/success`), not at the backend itself. Update these on Render after deploying the frontend.

## Deployment (Vercel)

1. Push this repo to GitHub
2. Import it in [Vercel](https://vercel.com/new)
3. Set the environment variable `NEXT_PUBLIC_API_URL` to your backend's API URL
4. Deploy
5. Update the backend's `CLIENT_SUCCESS_URL`/`CLIENT_CANCEL_URL` env vars on Render to point at your new Vercel URL, then redeploy the backend

## Project Structure

```
src/
├── app/                     # Next.js App Router pages
│   ├── auth/                # register, login
│   ├── properties/          # public browse + detail
│   ├── dashboard/
│   │   ├── tenant/          # rental history, payments, pay flow
│   │   ├── landlord/        # property CRUD, request approval
│   │   └── admin/           # users, properties, rentals, categories
│   ├── payment/             # success/cancel redirect pages
│   ├── error.tsx / not-found.tsx / loading.tsx / global-error.tsx
│   └── layout.tsx, providers.tsx
├── components/
│   ├── ui/                  # Button, Input, Badge, Plaque, Skeleton, etc.
│   ├── layout/               # Navbar, Footer
│   └── property/             # PropertyCard, PropertyForm, PropertyFilters
├── hooks/                    # TanStack Query hooks per domain
├── lib/
│   ├── api/                  # typed client + endpoint modules + shared types
│   ├── store/                 # Zustand auth store
│   ├── validations/           # Zod schemas per form
│   └── utils.ts, handle-error.ts
└── middleware.ts              # role-based route protection
```
