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

## Phase 2 — Main Site Pages (Completed 2026-09-14)

### What was built

- **Full Corporate Website (`main-site`)**:
  - `Header.tsx`: sticky header with scroll backdrop blur, responsive mobile drawer menu, logo and navigation.
  - `Footer.tsx`: brand info, navigation, social media icons, copyright, mock disclaimer, and quick business links.
  - `SocialIcons.tsx`: inline SVG icons for LinkedIn, Twitter, and Instagram (replacing icons removed from recent `lucide-react` releases).
  - `app/page.tsx` (Home): Hero section with Ethiopian landscape imagery, 3-metric statistics strip, Our Businesses preview cards (Coffee Trading live + Leather store coming soon), Mission teaser quote, and News highlights preview.
  - `app/about/page.tsx` (About Us): Company overview, Mission/Vision/Values three-card layout, Founding story narrative, and Leadership team cards.
  - `app/businesses/page.tsx` (Our Businesses): Detailed showcases for both business divisions (Coffee Trading Platform and Leather Goods).
  - `app/gallery/page.tsx` (Gallery): Curated 12-image grid with category tags, hover overlays, and placeholder flags.
  - `app/news/page.tsx` (News & Updates): Featured hero post and grid of 3 industry updates/press releases.
  - `app/contact/page.tsx` & `ContactForm.tsx`: Interactive contact page with contact details sidebar and live React 19 Server Action form.
  - `app/contact/actions.ts`: Zod schema validation, Supabase insert into `contact_submissions`, and mock notification logged to `notifications` table.
  - `app/sitemap.ts` & `app/robots.ts`: Automated SEO sitemap and robots.txt generation.
- **Verification**: `npm run build` exits 0 with all routes generated as static content.

---

## Phase 7 — Leather Store Coming Soon Scaffold (Completed 2026-09-14)

- `leather-site/app/page.tsx`: Branded Coming Soon landing page with clean minimalist design, linking back to `main-site`.
- Configured `@highland/shared` workspace imports and transpilePackages.
- Verified build exits 0.

---

## Phase 3–6 — Coffee Business Website & Admin Dashboard (Current)

Next step: Build out the dedicated Coffee Trading Platform (`coffee-site`), covering:
1. Product catalog browsing & filtering (Phase 3)
2. Sample request & contract request flows (Phase 4)
3. Simulated checkout/payment step & admin contract upload (Phase 5)
4. Staff admin dashboard with metrics, request queues, and catalog management (Phase 6)

