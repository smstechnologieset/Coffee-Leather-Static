# Highland Roots Trading PLC — Web Platform Build Spec
### Persistent reference document for the AI coding agent (Antigravity / Gemini)

> **Read this file at the start of every session and whenever you're unsure what's
> in scope.** It is the single source of truth for this project. If you make an
> assumption that isn't covered here, write it down in `/docs/PROGRESS.md` rather
> than guessing silently.

---

## 0. Current Phase & What "Mock Data" Means Here

We are building **before** the client has returned two content questionnaires and
**before** a live Stripe account exists. Rather than wait, we are building the
real system now, seeded with realistic placeholder content, so that:

- The database schema, queries, and admin dashboards are all **real and fully
  tested**.
- Swapping in the client's real answers later is just replacing seed data —
  through the same admin dashboard the client will actually use — not a rebuild.
- Only the *content* and *payment processor* are fake. The *system* is real.

**Build fully, with mock data:**
- ✅ Main corporate website
- ✅ Coffee business website (including its admin dashboard)

**Scaffold only (structure, not functionality):**
- 🧱 Leather e-commerce store — a "Coming Soon" shell with correct navigation
  and folder structure, ready to be built out in a later phase. Do **not** build
  cart, checkout, product management, or any real e-commerce logic yet.

**Explicitly mocked, not real:**
- 💳 Payment — build a clearly-labeled **fake/simulated payment step** (see
  §7.4). Do not integrate the real Stripe SDK yet, not even in test mode. Isolate
  the payment logic behind one function so it can be swapped for real Stripe
  later without touching the rest of the flow.

Use the placeholder brand name **"Highland Roots Trading PLC"** everywhere a
company name is needed. It is fictional and must be visibly replaceable — don't
hardcode it in more than one place (put it in a single site-config file).

---

## 1. Project Overview

Highland Roots Trading PLC is a parent company with (eventually) two business
lines, presented through three connected websites sharing one brand identity:

1. **Main corporate website** — the company's primary presence and entry point.
2. **Coffee business website** — a dedicated platform for international
   (primarily US) buyers to browse Ethiopian coffee, request samples, and move
   into bulk purchase contracts. This is a wholesale/export trading flow, not a
   simple retail cart.
3. **Leather e-commerce store** — a future Shein-style retail store for leather
   goods, on hold for now (scaffold only in this phase).

The three sites share consistent branding and link to one another, while each
has its own content, functionality, and user journey.

---

## 2. Tech Stack & Why

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js (App Router) + TypeScript | Role-gated routes, good fit for multiple dashboards, clean Vercel deploys |
| Styling | Tailwind CSS + shadcn/ui | Fast, consistent design system across 3 sites |
| Forms/validation | React Hook Form + Zod | Needed for sample/contract request forms |
| Admin tables | TanStack Table | Sample/contract request queues, product management |
| Charts | Recharts | Admin dashboard overview stats |
| Backend | **Supabase** (Postgres + Auth + RLS + Storage) | This data is relational (products, requests, contracts, staff roles) and needs joins/reporting for the admin dashboard — a natural fit for Postgres. Row Level Security cleanly separates what staff vs. the public can do. Auto-generated TypeScript types pair well with this stack. |
| Payments | Stripe (**not integrated yet** — mocked, see §7.4) | Real integration blocked on the client's US entity; build the flow so it's a drop-in swap later |
| Deployment (future) | Vercel (frontend) + Supabase (backend) | — |

---

## 3. Repository Structure

Build as **three separate Next.js apps** sharing one Supabase backend and one
shared set of brand tokens, since these are meant to be three distinct
deployable websites (not just route groups in one app):

```
/main-site       → Next.js app, Highland Roots corporate site
/coffee-site     → Next.js app, coffee trading platform
/leather-site    → Next.js app, "Coming Soon" shell only for now
/shared          → shared Tailwind config, brand tokens, logo assets, UI primitives
/docs            → project documentation (see §12)
```

All three apps read from the same Supabase project (separate tables/prefixes
per business line where relevant — see §9).

---

## 4. Shared Branding & Cross-Site Navigation

- One shared Tailwind config / design tokens file in `/shared`, imported by all
  three apps, so colors, type scale, and spacing stay consistent.
- Consistent header/footer pattern across all three sites.
- Main site → **"Our Businesses"** section with two cards:
  - **Coffee** → links to the live coffee site.
  - **Leather** → links to the leather site's "Coming Soon" page.
- Coffee site and leather site both include a **"Back to Highland Roots Trading
  PLC"** link back to the main site.

---

## 5. Main Corporate Website — Full Spec

**Pages:** Home, About Us, Our Businesses, Gallery, News/Updates, Contact

- Home: hero, brief company intro, "Our Businesses" preview, mission teaser
- About Us: company overview, mission/vision/values, mock founding story
- Our Businesses: two cards (Coffee — live, Leather — coming soon) with short
  descriptions and imagery
- Gallery: placeholder image grid (use a free placeholder image source, e.g.
  `picsum.photos`, clearly noted as temporary)
- News/Updates: 3–4 mock news/blog posts (title, date, short body, image)
- Contact: form (name, email, message) that writes to a `contact_submissions`
  table in Supabase, plus a console-logged "email notification" stub — no real
  email service yet
- Social media icon links (placeholder URLs)
- Standard SEO basics: meta tags, sitemap.xml, OpenGraph tags
- Fully responsive: mobile, tablet, desktop

**Mock content needed:** company name (Highland Roots Trading PLC), a short
mission statement, 3–4 paragraphs of About copy, 3–4 news posts, contact
details (placeholder phone/email/address) — write all of this yourself with
realistic, professional placeholder text; flag it clearly as mock in
`/docs/MOCK_DATA.md`.

---

## 6. Coffee Business Website — Full Spec

This is the core of the project. The buyer journey is:

**Browse coffees → request a sample → review sample → request a contract →
pay → receive contract.**

### 6.1 Product Catalog

Seed the `coffee_products` table with these six realistic mock products (use
exactly this data so the catalog looks credible during testing):

| Name | Region | Process | Grade | Altitude | Tasting Notes | Harvest Window |
|---|---|---|---|---|---|---|
| Yirgacheffe Washed | Yirgacheffe, Gedeo Zone | Washed | Grade 1 | 1,900–2,200 masl | Floral, jasmine, bergamot, bright citrus | Oct–Jan |
| Sidamo Natural | Sidamo | Natural (sun-dried) | Grade 2 | 1,700–2,000 masl | Blueberry, red wine, dark chocolate | Nov–Feb |
| Guji Honey | Guji Zone | Honey | Grade 1 | 1,850–2,100 masl | Stone fruit, honey sweetness, tropical | Nov–Jan |
| Harar Natural | Harar | Natural | Grade 4 | 1,500–2,100 masl | Blueberry, wine, warm spice | Oct–Dec |
| Limu Washed | Limu | Washed | Grade 2 | 1,600–1,900 masl | Balanced, mild spice, citrus | Oct–Jan |
| Jimma Natural | Jimma | Natural | Grade 3 | 1,400–1,800 masl | Earthy, full body, dried fruit | Nov–Feb |

Each product also needs:
- Placeholder certifications (mark 2–3 products "Organic (mock)", one
  "Fair Trade (mock)" — clearly labeled as placeholder, not a real claim)
- Sample size offered: 250g
- Bulk sizes offered: 60kg bag / 1 ton / 20ft container (~19.2 tons)
- Mock indicative pricing (clearly labeled "illustrative — TBD")
- Filter/search by region, process method, certification

### 6.2 Sample Request Flow

Public form capturing: company name, buyer name, country, email, phone,
intended purchase volume, shipping address, notes. On submit:
- Insert into `sample_requests` (status: `new`)
- Trigger a mock "email notification" (console log or a `notifications` table
  row — no real email service yet)

### 6.3 Contract Request Flow

From a product page (or a general request), buyer submits: product, quantity,
delivery term (dropdown: FOB / CIF / EXW — mock options), target delivery
window, notes. On submit:
- Insert into `contract_requests` (status: `pending_payment`)

### 6.4 Payment Step — MOCKED

Build a clearly-labeled test/mock checkout screen:
- Shows an order summary (product, quantity, indicative total)
- A **"Simulate Payment (Test Mode)"** button, visually marked so it's obvious
  this isn't real payment processing
- On click: updates `contract_requests.status` to `paid_pending_contract`

**Implementation requirement:** isolate this behind a single function, e.g.
`processPayment(contractRequestId)`, so a real Stripe Checkout session can
replace only that function later without restructuring the surrounding flow.

### 6.5 Contract Delivery (manual, via admin)

Once `paid_pending_contract`:
- Admin dashboard shows it in a queue
- Admin uploads a contract PDF (Supabase Storage) — a generic placeholder
  contract template is fine for now
- Marks it `contract_sent`; triggers a mock "email notification" to the buyer

### 6.6 Coffee Site Admin Dashboard

- Supabase Auth login, staff-only (role: `admin` / `staff`)
- Dashboard overview: counts of new sample requests, pending contracts, paid
  contracts awaiting document upload
- Sample requests queue: view details, mark status (new / sample shipped /
  closed)
- Contract requests queue: view details, upload contract document, manually
  mark payment status if needed, mark contract sent
- Product catalog management: CRUD on `coffee_products`

---

## 7. Leather E-Commerce Store — Scaffold Only

Do the minimum to make the cross-site navigation feel real, nothing more:

- `/leather-site` Next.js app with a single landing page: brand header, a
  short "Coming Soon" message, and a **"Back to Highland Roots Trading PLC"**
  link
- Stub (empty, not implemented) folders for future `products/`, `cart/`,
  `checkout/`, and `admin/` routes, so the structure is ready when this phase
  is greenlit
- The main site's "Leather" card in **Our Businesses** links here

**Do not build:** product catalog, cart, checkout, Stripe integration, customer
accounts, or an admin dashboard for this site yet. That's a separate future
phase once the client confirms they're ready to proceed with it.

---

## 8. Database Schema (Supabase)

| Table | Purpose |
|---|---|
| `site_settings` | Single-row config: company name, contact info, social links (drives all 3 sites) |
| `coffee_products` | Coffee catalog (see §6.1 fields) |
| `sample_requests` | Buyer sample requests + status |
| `contract_requests` | Buyer contract requests, quantity, terms, status, linked payment/contract state |
| `contract_documents` | Storage reference to uploaded contract PDFs, linked to `contract_requests` |
| `staff` | Staff accounts, linked to `auth.users`, with a `role` column (`admin` / `staff`) |
| `contact_submissions` | Main site contact form entries |
| `notifications` (optional) | Log of mock "email" events, for testing without a real email service |

**RLS approach:** public (anonymous) users can `INSERT` into
`sample_requests`, `contract_requests`, and `contact_submissions`, but cannot
read others' rows. Authenticated `staff`/`admin` roles can read and update
everything relevant to their site. No tables for the leather store yet.

---

## 9. Process & Phases

Work through these in order, pausing for confirmation between phases:

1. Repo scaffold (`main-site`, `coffee-site`, `leather-site`, `shared`),
   Tailwind/design tokens, Supabase project + schema + RLS + staff auth
2. Main site: all pages, mock content, contact form
3. Coffee site: product catalog + browsing/filtering
4. Coffee site: sample request + contract request flows
5. Coffee site: mocked payment step (§6.4) + admin contract upload (§6.5)
6. Coffee site: admin dashboard (§6.6)
7. Leather site: "Coming Soon" scaffold + main site nav wiring
8. Seed all mock data (§6.1 + company info + news posts), then run through the
   full coffee buyer journey end-to-end as a test

**Before creating or connecting to a real Supabase project**, stop and tell me
exactly what to do: create a free project at supabase.com, and where to find
the Project URL, anon key, and service role key. Don't fabricate credentials.

Where something isn't specified in this document and matters, don't guess
silently — write the assumption down in `/docs/PROGRESS.md` and proceed with
the most sensible default.

---

## 10. Documentation Requirements

Maintain these actual files in the repo, in plain language (frontend-strong,
backend-newer developer is the audience):

- `/docs/ARCHITECTURE.md` — how the three sites and shared backend fit together
- `/docs/DATABASE.md` — every table, its purpose, and how RLS is structured
- `/docs/SETUP.md` — how to run all three apps locally, environment variables
  needed, how to connect Supabase
- `/docs/PROGRESS.md` — running log updated after each phase: what was built,
  decisions made and why
- `/docs/MOCK_DATA.md` — an explicit list of everything currently mocked or
  placeholder (see §11 below), so nothing fake accidentally ships as real

Comment non-obvious backend code directly, especially RLS policies and the
`processPayment()` mock function.

---

## 11. Open Items — What's Mock/Placeholder Right Now

Everything below is provisional and will be replaced once the client returns
the two questionnaires and Stripe is live. List these explicitly in
`/docs/MOCK_DATA.md` so they're never mistaken for real:

- Real company name, logo, and brand colors (currently "Highland Roots
  Trading PLC" placeholder)
- Real coffee catalog, pricing, and certifications (currently the 6 mock
  products in §6.1)
- Exact required fields for sample/contract requests (currently our best
  guess from the questionnaire draft)
- Real shipping/export terms — port, Incoterms offered, lead times (not yet
  represented in the UI at all — add once known)
- Real Stripe integration (currently fully mocked, see §6.4)
- Leather e-commerce store — entire functional build (currently scaffold
  only, see §7)

---

## 12. Start

Begin with Phase 1 (§9): repo scaffold, shared design tokens, and the
Supabase schema/RLS/auth design. Show the implementation plan before writing
any code.
