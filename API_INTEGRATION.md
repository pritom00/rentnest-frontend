# API Integration Map

This document maps every frontend route/component to the RentNest backend endpoint(s) it consumes. Backend repo: see root README for the live API URL and Swagger docs.

All requests go through a single typed client — `src/lib/api/client.ts` — which attaches the JWT (from a cookie) to every authenticated call and normalizes the backend's `{ success, message, data, errorDetails }` envelope into typed results or a thrown `ApiError`.

## Public Pages

| Frontend Route | Component(s) | Backend Endpoint(s) |
|---|---|---|
| `/` | `app/page.tsx` (Home, featured properties) | `GET /api/properties?limit=3` |
| `/properties` | `app/properties/page.tsx` + `PropertyFiltersPanel` | `GET /api/properties` (with query filters), `GET /api/categories` |
| `/properties/[id]` | `app/properties/[id]/page.tsx` | `GET /api/properties/:id` |

## Auth

| Frontend Route | Component(s) | Backend Endpoint(s) |
|---|---|---|
| `/auth/register` | `app/auth/register/page.tsx` | `POST /api/auth/register` |
| `/auth/login` | `app/auth/login/page.tsx` | `POST /api/auth/login` |
| (all authenticated pages) | `useAuthStore` / `Navbar` | `GET /api/auth/me` (implicitly trusted via stored JWT; re-validated by every subsequent authenticated call) |

## Tenant

| Frontend Route | Component(s) | Backend Endpoint(s) |
|---|---|---|
| `/properties/[id]` (request form) | `RentalRequestForm` section of property detail page | `POST /api/rentals` |
| `/dashboard/tenant` | `app/dashboard/tenant/page.tsx` | `GET /api/rentals`, `GET /api/payments` |
| `/dashboard/tenant/requests/[id]/pay` | Pay page | `GET /api/rentals/:id`, `POST /api/payments/create` (redirects to Stripe Checkout) |
| `/payment/success` | Success page | `POST /api/payments/confirm` (using the `session_id` query param Stripe appends on redirect) |
| `/payment/cancel` | Cancel page | — (no API call; informs the user the request is still `APPROVED` and can be paid later) |
| `/properties/[id]` (review form) | Review form section, shown only when a completed rental exists | `POST /api/reviews` |

## Landlord

| Frontend Route | Component(s) | Backend Endpoint(s) |
|---|---|---|
| `/dashboard/landlord` | `app/dashboard/landlord/page.tsx` | `GET /api/landlord/properties/mine`, `DELETE /api/landlord/properties/:id` |
| `/dashboard/landlord/properties/new` | `PropertyForm` (create mode) | `POST /api/landlord/properties`, `GET /api/categories` |
| `/dashboard/landlord/properties/[id]/edit` | `PropertyForm` (edit mode) | `GET /api/properties/:id`, `PUT /api/landlord/properties/:id` |
| `/dashboard/landlord/requests` | `app/dashboard/landlord/requests/page.tsx` | `GET /api/landlord/requests`, `PATCH /api/landlord/requests/:id`, `PATCH /api/landlord/requests/:id/complete` |

## Admin

| Frontend Route | Component(s) | Backend Endpoint(s) |
|---|---|---|
| `/dashboard/admin` (Users tab) | `UsersTab` | `GET /api/admin/users`, `PATCH /api/admin/users/:id` |
| `/dashboard/admin` (Properties tab) | `PropertiesTab` | `GET /api/admin/properties` |
| `/dashboard/admin` (Rentals tab) | `RentalsTab` | `GET /api/admin/rentals` |
| `/dashboard/admin` (Categories tab) | `CategoriesTab` | `GET /api/categories`, `POST /api/admin/categories`, `DELETE /api/admin/categories/:id` |

## Cross-cutting concerns

- **Auth/session**: `src/lib/store/auth-store.ts` (Zustand) holds the current user + JWT in memory, mirrored into cookies (`rentnest_token`, `rentnest_role`) so `src/middleware.ts` can protect `/dashboard/*` routes at the edge before any page code runs.
- **Error handling**: `src/lib/handle-error.ts` centralizes every mutation's error handling — it shows a toast (via `sonner`) with the backend's `message`, and if the error is a 400 validation failure, maps the backend's Zod `errorDetails` array onto the exact form fields using React Hook Form's `setError`.
- **Data fetching/caching**: all reads and writes go through TanStack Query hooks in `src/hooks/`, which handle caching, loading states, and cache invalidation after mutations (e.g. approving a rental invalidates the landlord's request list).
