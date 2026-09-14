# Architecture — Highland Roots Trading PLC

## Overview

Three distinct Next.js websites that share one Supabase backend and one shared design system package. Each site is independently deployable to Vercel.

```
┌─────────────────────────────────────────────────────────────────┐
│                   Browser / Public Internet                     │
└────────────┬──────────────────────┬────────────────────────────-┘
             │                      │                      │
    ┌────────▼───────┐   ┌──────────▼──────┐   ┌──────────▼──────┐
    │   main-site    │   │  coffee-site    │   │  leather-site   │
    │  (port 3000)   │   │  (port 3001)    │   │  (port 3002)    │
    │  Corporate     │   │  Coffee trading │   │  Coming soon    │
    │  website       │   │  platform       │   │  shell only     │
    └────────┬───────┘   └──────────┬──────┘   └──────────┬──────┘
             │                      │                      │
             └──────────────────────┼──────────────────────┘
                                    │
                    ┌───────────────▼────────────────┐
                    │          Supabase              │
                    │  • Postgres (shared DB)        │
                    │  • Auth (staff only)           │
                    │  • Storage (contract PDFs)     │
                    │  • Row Level Security          │
                    └────────────────────────────────┘
```

## Packages

| Directory       | Type        | Port | Description                                     |
| --------------- | ----------- | ---- | ----------------------------------------------- |
| `shared/`       | npm package | —    | Brand tokens, Tailwind base config, site-config |
| `main-site/`    | Next.js app | 3000 | Corporate website                               |
| `coffee-site/`  | Next.js app | 3001 | Coffee trading platform                         |
| `leather-site/` | Next.js app | 3002 | Coming-soon shell                               |
| `supabase/`     | SQL files   | —    | Schema, RLS policies, seed data                 |
| `docs/`         | Markdown    | —    | Project documentation                           |

## Shared Package (`@highland/shared`)

All three apps import from here:

- `tailwind-base.js` — base Tailwind theme (colors, fonts, spacing)
- `site-config.ts` — **single source of truth** for the company name and brand constants
- `tokens.ts` — TypeScript re-export of design tokens

## Cross-site Navigation

- `main-site` → **Our Businesses** section links to coffee-site and leather-site
- `coffee-site` and `leather-site` → both have a **"Back to Highland Roots"** link
- Cross-site URLs are driven by env vars (`NEXT_PUBLIC_COFFEE_SITE_URL`, etc.) so they work in all environments

## Authentication

- **Public users**: no account needed. Can browse, submit sample requests, contract requests, and contact forms.
- **Staff/Admin**: Supabase Auth (email+password). Staff rows are tracked in the `public.staff` table with a `role` column. The coffee-site admin dashboard is protected by middleware checking `auth.uid()` against this table.
- No customer accounts yet (leather store not built, coffee is B2B via forms).

## Data Flow — Coffee Buyer Journey

```
Product Catalog (public)
        │
        ▼
Request Sample → sample_requests (INSERT, anon)
        │
        ▼
Review Sample (offline) → Request Contract → contract_requests (INSERT, anon)
        │
        ▼
Mocked Payment Step → contract_requests.status = 'paid_pending_contract'
        │
        ▼
Admin uploads PDF → contract_documents (INSERT, staff)
        │
        ▼
contract_requests.status = 'contract_sent'
        │
        ▼
Mock "email notification" logged to notifications table
```

## Environment Variables

See `.env.example` in the repo root and `/docs/SETUP.md` for details.
