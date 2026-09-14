# Database — Highland Roots Trading PLC

## Applying the Schema

Run these three files in order in the Supabase SQL Editor (or via `supabase db push`):

1. `supabase/schema.sql` — creates all tables, indexes, and triggers
2. `supabase/rls.sql` — enables Row Level Security and creates all policies
3. `supabase/seed.sql` — inserts mock data (company settings + 6 coffee products)

---

## Tables

### `site_settings`

Single-row config that drives all three sites. Update via admin dashboard.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `company_name` | text | **MOCK** — "Highland Roots Trading PLC" |
| `tagline` | text | **MOCK** |
| `contact_email` | text | **MOCK** |
| `contact_phone` | text | **MOCK** |
| `contact_address` | text | **MOCK** |
| `social_linkedin` | text | **MOCK** placeholder URL |
| `social_twitter` | text | **MOCK** placeholder URL |
| `social_instagram` | text | **MOCK** placeholder URL |
| `updated_at` | timestamptz | auto-updated |

**RLS:** Public can read. Admin can update.

---

### `coffee_products`

The exportable Ethiopian coffee catalog.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `slug` | text | Unique URL-safe ID (e.g. `yirgacheffe-washed`) |
| `name` | text | Display name |
| `region` | text | Ethiopian region |
| `process_method` | text | Washed / Natural / Honey |
| `grade` | text | Grade 1–4 |
| `altitude_masl` | text | e.g. "1,900–2,200 masl" |
| `tasting_notes` | text | Flavor descriptors |
| `harvest_window` | text | e.g. "Oct–Jan" |
| `certifications` | text[] | Array; mock values labeled "(mock)" |
| `sample_size_g` | integer | Default 250g |
| `bulk_options` | jsonb | Array of `{label, quantity_kg, price_indicative}` |
| `price_note` | text | "Indicative — TBD" (always illustrative) |
| `is_active` | boolean | Only active products shown publicly |
| `created_at` | timestamptz | — |
| `updated_at` | timestamptz | auto-updated |

**RLS:** Public reads active products only. Staff can CRUD all. Admin can delete.

---

### `sample_requests`

A buyer's request for a 250g sample.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `product_id` | uuid | FK → `coffee_products` (nullable if product deleted) |
| `company_name` | text | Buyer's company |
| `buyer_name` | text | — |
| `country` | text | — |
| `email` | text | — |
| `phone` | text | Optional |
| `intended_volume` | text | Free-text purchase intent |
| `shipping_address` | text | — |
| `notes` | text | Optional |
| `status` | text | `new` → `sample_shipped` → `closed` |
| `created_at` | timestamptz | — |
| `updated_at` | timestamptz | auto-updated |

**RLS:** Anonymous can INSERT. Staff can SELECT + UPDATE.

---

### `contract_requests`

A buyer's request to enter a bulk purchase contract.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `product_id` | uuid | FK → `coffee_products` |
| `buyer_name` | text | — |
| `company_name` | text | — |
| `email` | text | — |
| `phone` | text | Optional |
| `quantity_kg` | numeric | Requested quantity |
| `delivery_term` | text | `FOB` / `CIF` / `EXW` (mock options) |
| `target_delivery` | text | Free-text window |
| `notes` | text | Optional |
| `indicative_total_usd` | numeric | Set by admin; illustrative only |
| `status` | text | `pending_payment` → `paid_pending_contract` → `contract_sent` → `closed` |
| `created_at` | timestamptz | — |
| `updated_at` | timestamptz | auto-updated |

**RLS:** Anonymous can INSERT. Staff can SELECT + UPDATE.

---

### `contract_documents`

Supabase Storage references for contract PDFs uploaded by staff.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `contract_request_id` | uuid | FK → `contract_requests` |
| `storage_path` | text | Supabase Storage path (bucket + filename) |
| `uploaded_by` | uuid | FK → `auth.users` |
| `uploaded_at` | timestamptz | — |

**RLS:** Staff can INSERT + SELECT.

---

### `staff`

Maps Supabase Auth users to internal roles. A user must appear here to access any admin feature.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK = `auth.users.id` |
| `email` | text | — |
| `full_name` | text | Optional |
| `role` | text | `admin` or `staff` |
| `created_at` | timestamptz | — |

**RLS:** Users can read their own row. Admins can read all. Inserts are done via Supabase dashboard or service-role key (not public).

---

### `contact_submissions`

Main site contact form entries.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `name` | text | — |
| `email` | text | — |
| `message` | text | — |
| `created_at` | timestamptz | — |

**RLS:** Anonymous can INSERT. Staff can SELECT.

---

### `notifications` (optional)

Internal log of mock "email" events. Replaces a real email service during this phase.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `event_type` | text | e.g. `sample_request_received`, `contract_sent` |
| `recipient` | text | Email address (not actually sent) |
| `subject` | text | — |
| `body` | text | — |
| `metadata` | jsonb | Extra context |
| `created_at` | timestamptz | — |

**RLS:** Staff can SELECT. INSERT is done via service-role key (bypasses RLS).

---

## RLS Helper Functions

Two SQL functions in `rls.sql` simplify policy expressions:

- `public.is_staff()` → `true` if `auth.uid()` has a row in `public.staff`
- `public.is_admin()` → `true` if that row has `role = 'admin'`

Both are `security definer` so they run with elevated privileges without exposing the `staff` table directly.

---

## Storage Buckets

Create one private bucket in Supabase Storage:

| Bucket | Access | Purpose |
|---|---|---|
| `contract-documents` | Private (RLS) | Contract PDFs uploaded by staff |

Bucket policy: only staff/admin can upload and download. Buyers never get direct storage URLs — staff shares the file manually (or via a signed URL in a future phase).
