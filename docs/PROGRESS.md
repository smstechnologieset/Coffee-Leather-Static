# Progress Log — Highland Roots Trading PLC

---

## Phase 1 — Repo Scaffold + Schema (2026-09-14)

### What was built

- **Root workspace**: `package.json` with npm workspaces (`main-site`, `coffee-site`, `leather-site`, `shared`). `.gitignore` and `.env.example` added.
- **`/shared` package** (`@highland/shared`):
  - `tailwind-base.js` — base Tailwind v3 theme (warm amber/gold primary, forest-green accent, warm-slate neutral). Extends into each app.
  - `site-config.ts` — single source of truth for `"Highland Roots Trading PLC"` company name and brand constants.
  - `tokens.ts` — TypeScript re-export of design tokens.
- **Three Next.js apps scaffolded** via `create-next-app` (TypeScript, App Router, Tailwind, ESLint):
  - `main-site` — corporate website (port 3000)
  - `coffee-site` — coffee trading platform (port 3001)
  - `leather-site` — coming-soon shell (port 3002)
- **`/supabase` SQL files**:
  - `schema.sql` — all tables: `site_settings`, `coffee_products`, `sample_requests`, `contract_requests`, `contract_documents`, `staff`, `contact_submissions`, `notifications`. Includes indexes and auto-update triggers.
  - `rls.sql` — RLS enabled on all tables; `is_staff()` and `is_admin()` helper functions; full policy set.
  - `seed.sql` — `site_settings` row + all 6 mock coffee products from §6.1.
- **`/docs`**: `ARCHITECTURE.md`, `DATABASE.md`, `SETUP.md`, `PROGRESS.md`, `MOCK_DATA.md` all created.

### Supabase credentials
Client provided credentials in `.env.local` at repo root. URL and both keys confirmed present. Schema SQL has NOT yet been applied — waiting for user to run it (see `docs/SETUP.md` Step 4).

### Decisions made (assumptions)

| Decision | Rationale |
|---|---|
| npm workspaces | User preference (confirmed) |
| Tailwind v3 | Required by shadcn/ui; user confirmed |
| Warm amber/gold primary palette | Evokes Ethiopian coffee and leather; professional and distinctive. **MOCK** — will be replaced with real brand colors. |
| `is_staff()` / `is_admin()` as `security definer` functions | Cleaner than inline subqueries in every RLS policy; standard Supabase pattern |
| `notifications` table as mock email log | Spec §6.2 says "console log or notifications table"; table chosen so the admin dashboard can display sent notifications in a future phase |
| `delivery_term` CHECK constraint limited to `FOB/CIF/EXW` | Spec §6.3 lists these three as mock options; constraint is easily modified when real terms are confirmed |
| `leather-site` scaffold includes only `page.tsx` + empty stub dirs | Spec §7 explicitly says "scaffold only, nothing more" |

---

## Phase 2 — Main Site Pages (upcoming)

Next session will build all six pages of the main corporate website with mock content and the live Supabase contact form.

**Pre-requisite**: Apply `supabase/schema.sql`, `rls.sql`, `seed.sql` to the live Supabase project first.
