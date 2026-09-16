# Meridian Freight & Logistics — Digital Platform (Frontend)

A production-quality **frontend-only** implementation of the Import & Export Digital
Platform PRD: a public marketing site, a customer portal, and an internal
operations/admin dashboard, built with realistic mock data and a clean service
layer so a real backend can be connected later without touching the UI.

## Tech stack

- React 19 + TypeScript + Vite
- React Router v7 (client-side routing, protected routes by role)
- Tailwind CSS v4 (design tokens in `src/index.css`)
- lucide-react icons

## Getting started

```bash
npm install
npm run dev      # starts the Vite dev server
npm run build    # type-checks and produces a production build in dist/
```

## Project structure

```
src/
  App.tsx                     Route table (public, auth, portal, admin)
  index.css                   Design tokens (color/type/spacing) + Tailwind import
  app/
    types/                    Shared domain types (Shipment, ExportRequest, etc.)
    data/                     Mock data (destinations, shipments, requests, users...)
    services/                 Mock async "API" layer -- swap for real HTTP calls later
    context/AuthContext.tsx   Mock session/auth state
    components/
      ui/                     Button, form fields, StatusBadge
      layout/                 Public header/footer, dashboard shell (portal+admin)
      shared/                 PageHeader, EmptyState, TrackingTimeline, etc.
    pages/
      public/                 Home, About, Services, Destinations, Contact, Book a
                               Call, public Track
      auth/                   Login, Register, Forgot Password, Verify Email
      portal/                 Customer dashboard: overview, requests, shipments,
                               documents, notifications, profile
      admin/                  Operations dashboard: overview, customers, requests,
                               shipments (tracking events + documents), documents,
                               bookings, messages
```

## Connecting a real backend later

Every page reads and writes through `src/app/services/*.ts`. Each function in
that folder is written as if it were already calling a real endpoint (it's
`async`, it can throw, it returns typed domain objects). To connect a real
API:

1. Replace the body of each service function with a `fetch`/HTTP client call
   to the equivalent endpoint (e.g. `POST /auth/login`, `GET /shipments/:id`).
2. Keep the function signatures the same -- components never import mock data
   directly, so no UI code needs to change.
3. Remove `src/app/data/mockData.ts` and `destinations.ts` once they're no
   longer referenced by the services layer.

## Demo accounts

The login screen accepts any password (4+ characters) for two demo accounts:

- **Customer:** `adaeze.okonkwo@lagosfoodsexports.com`
- **Staff/Admin:** `michael.adeyemi@meridianfreight.com`

## Demo tracking numbers

Try `EXP-2026-001293` or `IMP-2026-000871` on the public **Track shipment** page.
