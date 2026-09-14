-- =============================================================================
-- Highland Roots Trading PLC — Supabase Schema
-- Apply via: Supabase Dashboard → SQL Editor → Run
-- Or: supabase db push (if using CLI)
-- =============================================================================

-- Enable the pgcrypto extension for gen_random_uuid() on older Postgres versions
-- (Supabase's Postgres already has it, but being explicit doesn't hurt)
create extension if not exists "pgcrypto";

-- =============================================================================
-- 1. site_settings
-- Single-row config driving all three sites.
-- The company name lives here (and in /shared/site-config.ts for the frontend).
-- =============================================================================
create table if not exists public.site_settings (
  id               uuid primary key default gen_random_uuid(),
  company_name     text not null default 'Highland Roots Trading PLC',
  tagline          text,
  contact_email    text,
  contact_phone    text,
  contact_address  text,
  social_linkedin  text,
  social_twitter   text,
  social_instagram text,
  updated_at       timestamptz not null default now()
);

-- =============================================================================
-- 2. coffee_products
-- The exportable Ethiopian coffee catalog.
-- =============================================================================
create table if not exists public.coffee_products (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,          -- URL-safe identifier
  name             text not null,
  region           text not null,
  process_method   text not null,                 -- Washed / Natural / Honey
  grade            text not null,                 -- Grade 1–4
  altitude_masl    text not null,                 -- e.g. "1,900–2,200 masl"
  tasting_notes    text not null,
  harvest_window   text not null,                 -- e.g. "Oct–Jan"
  certifications   text[] not null default '{}',  -- array of strings, marked [MOCK]
  sample_size_g    integer not null default 250,
  bulk_options     jsonb not null default '[]',   -- [{label, quantity_kg, price_indicative}]
  price_note       text default 'Indicative — TBD', -- clearly labeled as illustrative
  is_active        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- =============================================================================
-- 3. sample_requests
-- Public buyers requesting a coffee sample.
-- =============================================================================
create table if not exists public.sample_requests (
  id                     uuid primary key default gen_random_uuid(),
  product_id             uuid references public.coffee_products(id) on delete set null,
  company_name           text not null,
  buyer_name             text not null,
  country                text not null,
  email                  text not null,
  phone                  text,
  intended_volume        text,                    -- free-text description of purchase volume
  shipping_address       text not null,
  notes                  text,
  status                 text not null default 'new'
                           check (status in ('new', 'sample_shipped', 'closed')),
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- =============================================================================
-- 4. contract_requests
-- Buyer initiating a bulk purchase contract.
-- =============================================================================
create table if not exists public.contract_requests (
  id                   uuid primary key default gen_random_uuid(),
  product_id           uuid references public.coffee_products(id) on delete set null,
  buyer_name           text not null,
  company_name         text not null,
  email                text not null,
  phone                text,
  quantity_kg          numeric not null,
  delivery_term        text not null              -- FOB / CIF / EXW (mock options)
                         check (delivery_term in ('FOB', 'CIF', 'EXW')),
  target_delivery      text,                      -- free-text window
  notes                text,
  indicative_total_usd numeric,                   -- calculated/entered by admin; illustrative
  status               text not null default 'pending_payment'
                         check (status in (
                           'pending_payment',
                           'paid_pending_contract',
                           'contract_sent',
                           'closed'
                         )),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- =============================================================================
-- 5. contract_documents
-- Storage references to PDFs uploaded by admin staff.
-- =============================================================================
create table if not exists public.contract_documents (
  id                  uuid primary key default gen_random_uuid(),
  contract_request_id uuid not null references public.contract_requests(id) on delete cascade,
  storage_path        text not null,              -- Supabase Storage path (bucket/filename)
  uploaded_by         uuid references auth.users(id) on delete set null,
  uploaded_at         timestamptz not null default now()
);

-- =============================================================================
-- 6. staff
-- Staff accounts linked to Supabase Auth users.
-- After sign-up, insert a row here with the auth user id to grant access.
-- =============================================================================
create table if not exists public.staff (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  full_name  text,
  role       text not null default 'staff'
               check (role in ('admin', 'staff')),
  created_at timestamptz not null default now()
);

-- =============================================================================
-- 7. contact_submissions
-- Main site contact form entries.
-- =============================================================================
create table if not exists public.contact_submissions (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  message    text not null,
  created_at timestamptz not null default now()
);

-- =============================================================================
-- 8. notifications (optional — mock email event log)
-- Used in place of a real email service during this build phase.
-- =============================================================================
create table if not exists public.notifications (
  id           uuid primary key default gen_random_uuid(),
  event_type   text not null,     -- e.g. 'sample_request_received', 'contract_sent'
  recipient    text not null,     -- email address (mock — not actually sent)
  subject      text,
  body         text,
  metadata     jsonb,             -- optional extra context
  created_at   timestamptz not null default now()
);

-- =============================================================================
-- Indexes
-- =============================================================================
create index if not exists idx_sample_requests_status   on public.sample_requests(status);
create index if not exists idx_contract_requests_status on public.contract_requests(status);
create index if not exists idx_coffee_products_slug     on public.coffee_products(slug);
create index if not exists idx_coffee_products_region   on public.coffee_products(region);
create index if not exists idx_coffee_products_process  on public.coffee_products(process_method);

-- =============================================================================
-- Updated-at triggers
-- =============================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger trg_coffee_products_updated_at
  before update on public.coffee_products
  for each row execute function public.set_updated_at();

create or replace trigger trg_sample_requests_updated_at
  before update on public.sample_requests
  for each row execute function public.set_updated_at();

create or replace trigger trg_contract_requests_updated_at
  before update on public.contract_requests
  for each row execute function public.set_updated_at();
