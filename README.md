# RentNest — Frontend

A Next.js (App Router) frontend for RentNest, a rental property marketplace. Consumes the [RentNest backend API](https://rentnest-backend1.onrender.com) (Node/Express/Prisma/Postgres/Stripe).

**Live Frontend:** https://rentnest-frontend.onrender.com
**Live Backend:** https://rentnest-backend1.onrender.com
**Backend repo:** https://github.com/pritom00/rentnest-backend1

## Design system: "Ledger & Plaque"

A deliberately editorial black-and-white look, built around the idea of a building directory or property ledger rather than a generic SaaS dashboard:

- **Fraunces** (serif, italic) for headings — evokes established real-estate signage
- **Inter** for body/UI text — legible in dense dashboards and tables
- **IBM Plex Mono** for prices, dates, and reference numbers — used functionally, not decoratively
- **Zero border-radius, hairline 1px borders, no shadows** — a "printed ledger" feel
- **Status badges**: rental request status (Pending/Approved/Rejected/Active/Completed) uses color-coded badges (amber/blue/red/green/gray) since status is the single most important signal on the page — this is the one deliberate exception to the black-and-white system. Property, user, and payment status elsewhere stay monochrome, with a single restrained **"stamp red"** accent reserved for errors and destructive actions — like a rubber ink-stamp on a paper form
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

> ✅ **Manually verified end-to-end on the live deployment**, including a real completed Stripe test payment: registration/login/validation, full tenant journey (browse → request → pay → review), full landlord CRUD (including image URL upload), optimistic-update approve/reject and ban/unban, admin category CRUD, and role-based route protection via middleware.

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

> Note: since the live site has been used for manual and automated testing, `tenant@rentnest.com` may have existing rental requests/reviews attached. Registering a fresh tenant account works just as well for testing and avoids any state left over from earlier sessions.

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

**Deployment note:** the backend's `CLIENT_SUCCESS_URL` and `CLIENT_CANCEL_URL` environment variables on Render are already configured to point at the live frontend:
```
CLIENT_SUCCESS_URL=https://rentnest-frontend.onrender.com/payment/success
CLIENT_CANCEL_URL=https://rentnest-frontend.onrender.com/payment/cancel
```
If you redeploy the frontend to a new URL, update these two variables on the backend's Render service and redeploy it, or Stripe will reject the checkout session with an "invalid URL" error.

## 🎬 Automated End-to-End Tests

Instead of manually clicking through every test case, a Playwright suite drives a real browser through almost the entire app automatically — registration, login, role protection, full CRUD, the approve/reject optimistic updates, admin moderation, and the handoff to a real Stripe checkout session.

### One-time setup
```bash
npx playwright install chromium
```

### Run the tests
```bash
npm run test:e2e
```
By default this runs against the **live deployed frontend** (`https://rentnest-frontend.onrender.com`). To run against your local dev server instead:
```bash
# in one terminal
npm run dev

# in another terminal (Windows PowerShell)
$env:PLAYWRIGHT_BASE_URL="http://localhost:3000"; npm run test:e2e
```

### See a nice interactive run (great for recording your demo video)
```bash
npm run test:e2e:ui
```
This opens Playwright's UI mode — a visual, step-by-step runner showing exactly what the browser is doing in real time.

### View the HTML report after a run
```bash
npm run test:e2e:report
```

### What's covered

| File | Covers |
|---|---|
| `tests/e2e/public.spec.ts` | Home page, browsing, filtering, property detail, unauthenticated request-blocking |
| `tests/e2e/auth.spec.ts` | Registration validation, duplicate email, wrong password, successful login, already-authenticated redirect, middleware route protection, sign out |
| `tests/e2e/full-rental-lifecycle.spec.ts` | The complete story: landlord creates a listing with a photo → tenant discovers and requests it → duplicate request blocked → landlord approves (optimistic UI) → delete-while-active blocked → tenant reaches a real Stripe checkout session |
| `tests/e2e/admin.spec.ts` | Ban/unban with optimistic updates, banned users rejected on login, category form validation, full category CRUD (create/edit/delete) |
| `tests/e2e/errors.spec.ts` | Custom 404 page, consistent error messaging |
| `tests/e2e/responsive.spec.ts` | Mobile navbar collapse, single-column property grid on small viewports |

**Intentionally not automated:** actually entering a card number on Stripe's hosted checkout page. That page lives on Stripe's own domain and is deliberately hardened against scripted form-filling for fraud-prevention reasons, so automating it reliably isn't realistic (or advisable) for a test suite. The suite instead verifies the handoff is genuine — a real `checkout.stripe.com` session is created and the browser is redirected to it — and completing an actual test payment (`4242 4242 4242 4242`) is a quick manual step, same as testing any real payment integration.

## Deployment

This project is currently deployed on **Render** (as a Node web service, same platform as the backend). Vercel also works fine as an alternative since this is a standard Next.js app — either is fine to use.

### Render (what's actually deployed)

1. Push this repo to GitHub
2. Render Dashboard → **New +** → **Web Service** → connect this repo
3. Settings:
   - Runtime: **Node**
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
4. Environment variable:
   - `NEXT_PUBLIC_API_URL` = `https://rentnest-backend1.onrender.com/api`
5. Deploy
6. Update the backend's `CLIENT_SUCCESS_URL` / `CLIENT_CANCEL_URL` env vars (on the backend's Render service) to point at this frontend's URL, then redeploy the backend — see the Payment flow section above

### Vercel (alternative)

1. Push this repo to GitHub
2. Import it in [Vercel](https://vercel.com/new)
3. Set the environment variable `NEXT_PUBLIC_API_URL` to your backend's API URL
4. Deploy
5. Same as above — update the backend's `CLIENT_SUCCESS_URL`/`CLIENT_CANCEL_URL` env vars to point at your new Vercel URL, then redeploy the backend

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

tests/
└── e2e/                       # Playwright end-to-end test suite (see above)

playwright.config.ts
API_INTEGRATION.md
```
