-- =============================================================================
-- KIJIJ International Multi-Site Platform — Unified Production Schema
-- Compatible with all 3 sites:
--   1. Corporate: https://kijij.com
--   2. Coffee:    https://kijijcoffee.com
--   3. Leather:   https://kijijleather.com
--
-- Apply via: Supabase Dashboard → SQL Editor → Run
-- =============================================================================

create extension if not exists "pgcrypto";

-- =============================================================================
-- 1. site_settings
-- Global configuration for company branding, contact details, and locations.
-- =============================================================================
create table if not exists public.site_settings (
  id               uuid primary key default gen_random_uuid(),
  company_name     text not null default 'KIJIJ International LLC',
  tagline          text default 'Ethiopian Specialty Coffee & Premium Leather — Products, Not Just Opportunities',
  contact_email    text default 'kijjiinternational@gmail.com',
  contact_phone    text default '+1 (850) 264-5268',
  contact_address  text default '121 Gladys Lane, Saluda, SC 29138, USA',
  social_linkedin  text default 'https://linkedin.com/company/kijij-international',
  social_twitter   text default 'https://twitter.com/kijijiintl',
  social_instagram text default 'https://instagram.com/kijijiintl',
  updated_at       timestamptz not null default now()
);

-- =============================================================================
-- 2. staff
-- Verified staff and administrators. Grants dashboard access on both stores.
-- =============================================================================
create table if not exists public.staff (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null unique,
  full_name  text,
  role       text not null default 'staff' check (role in ('admin', 'staff')),
  created_at timestamptz not null default now()
);

-- =============================================================================
-- 3. buyer_profiles
-- B2B wholesale buyers for coffee trade (roasters, importers, brokers).
-- =============================================================================
create table if not exists public.buyer_profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  full_name        text,
  company          text,
  country          text,
  phone            text,
  shipping_address text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- =============================================================================
-- 4. coffee_products
-- Exportable Ethiopian specialty green coffee catalog & retail packaging.
-- =============================================================================
create table if not exists public.coffee_products (
  id                 text primary key default ('cp_' || substr(md5(random()::text || clock_timestamp()::text), 1, 8)),
  slug               text not null unique,
  name               text not null,
  category           text default 'Specialty Coffee',
  region             text not null,
  process            text not null,
  grade              text not null,
  altitude           text,
  harvest            text,
  tasting_notes      text not null,
  price_per_quintal  numeric(10,2) not null,
  price_per_kg       numeric(10,2) not null,
  current_price      numeric(10,2) not null,
  previous_price     numeric(10,2),
  unit               text default '/Quintal',
  min_order_quintals numeric(10,2) default 10,
  min_order_kg       numeric(10,2) default 1000,
  min_order          text default '10 Quintals (1,000 kg)',
  image              text not null,
  availability       text default 'In Stock',
  is_top_product     boolean default false,
  sample_tiers       jsonb not null default '[]',
  owner              text,
  profile            text,
  price_history      jsonb not null default '[]',
  is_active          boolean not null default true,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- =============================================================================
-- 5. leather_products
-- Handcrafted Ethiopian luxury leather goods catalog.
-- =============================================================================
create table if not exists public.leather_products (
  id                text primary key default ('lp_' || substr(md5(random()::text || clock_timestamp()::text), 1, 8)),
  slug              text not null unique,
  name              text not null,
  tagline           text,
  category          text not null,
  sub_category      text,
  price             numeric(10,2) not null,
  original_price    numeric(10,2),
  description       text not null,
  crafting_note     text,
  features          text[] not null default '{}',
  material          text not null,
  origin            text,
  care_instructions text,
  images            text[] not null default '{}',
  colors            jsonb not null default '[]',
  sizes             text[] default '{}',
  weight            text,
  dimensions        text,
  in_stock          boolean not null default true,
  stock_count       integer default 10,
  is_new            boolean default false,
  is_bestseller     boolean default false,
  is_featured       boolean default false,
  is_on_sale        boolean default false,
  tags              text[] default '{}',
  rating            numeric(3,2) default 5.0,
  review_count      integer default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- =============================================================================
-- 6. orders
-- Unified financial & fulfillment order table for both stores.
-- =============================================================================
create table if not exists public.orders (
  id                       text primary key default ('ord_' || substr(md5(random()::text || clock_timestamp()::text), 1, 10)),
  order_number             text unique,
  site_source              text not null check (site_source in ('coffee', 'leather')),
  user_id                  uuid references auth.users(id) on delete set null,
  customer_name            text not null,
  customer_email           text not null,
  customer_phone           text,
  shipping_address         jsonb not null,
  billing_address          jsonb,
  items                    jsonb not null,
  subtotal                 numeric(10,2) not null,
  discount_amount          numeric(10,2) not null default 0,
  shipping_fee             numeric(10,2) not null default 0,
  total_amount             numeric(10,2) not null,
  currency                 text not null default 'USD',
  promo_code               text,
  payment_status           text not null default 'pending'
                             check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  fulfillment_status       text not null default 'processing'
                             check (fulfillment_status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  stripe_session_id        text,
  stripe_payment_intent_id text,
  carrier                  text,
  tracking_number          text,
  delivery_notes           text,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

-- =============================================================================
-- 7. promo_codes
-- Dynamic discount codes for leather and coffee checkouts.
-- =============================================================================
create table if not exists public.promo_codes (
  id                      text primary key default ('prm_' || substr(md5(random()::text || clock_timestamp()::text), 1, 8)),
  code                    text not null unique,
  discount_type           text not null check (discount_type in ('percentage', 'fixed')),
  discount_value          numeric(10,2) not null,
  minimum_order           numeric(10,2) default 0,
  usage_limit             integer,
  used_count              integer not null default 0,
  single_use_per_customer boolean not null default false,
  valid_from              timestamptz not null default now(),
  expires_at              timestamptz,
  is_active               boolean not null default true,
  created_at              timestamptz not null default now()
);

-- =============================================================================
-- 8. leather_wishlists
-- Per-user saved wishlists for direct consumers on https://kijijleather.com.
-- =============================================================================
create table if not exists public.leather_wishlists (
  user_id    uuid not null references auth.users(id) on delete cascade,
  product_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- =============================================================================
-- 9. sample_requests
-- Commercial green coffee sample evaluations requested by roasters/importers.
-- =============================================================================
create table if not exists public.sample_requests (
  id               text primary key default ('smp_' || substr(md5(random()::text || clock_timestamp()::text), 1, 8)),
  buyer_id         uuid references auth.users(id) on delete set null,
  product_id       text references public.coffee_products(id) on delete set null,
  product_name     text,
  company_name     text not null,
  buyer_name       text not null,
  country          text not null,
  email            text not null,
  phone            text,
  sample_size      text default '250g',
  sample_price     numeric(10,2) default 0,
  delivery_method  text default 'DHL Express',
  shipping_address text not null,
  intended_volume  text,
  notes            text,
  status           text not null default 'new'
                     check (status in ('new', 'sample_shipped', 'closed', 'cancelled')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- =============================================================================
-- 10. contract_requests
-- Bulk container export agreements initiated by commercial coffee buyers.
-- =============================================================================
create table if not exists public.contract_requests (
  id                   text primary key default ('ctr_' || substr(md5(random()::text || clock_timestamp()::text), 1, 8)),
  buyer_id             uuid references auth.users(id) on delete set null,
  product_id           text references public.coffee_products(id) on delete set null,
  product_name         text,
  buyer_name           text not null,
  company_name         text not null,
  email                text not null,
  phone                text,
  quantity_quintals    numeric(10,2),
  quantity_kg          numeric(10,2) not null,
  delivery_term        text not null default 'FOB' check (delivery_term in ('FOB', 'CIF', 'EXW')),
  target_delivery      text,
  indicative_total_usd numeric(12,2),
  deposit_amount       numeric(12,2),
  notes                text,
  status               text not null default 'pending_payment'
                         check (status in ('pending_payment', 'paid_pending_contract', 'contract_sent', 'closed', 'cancelled')),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- =============================================================================
-- 11. contract_documents
-- Digital agreements, export licenses, or invoices attached to contract requests.
-- =============================================================================
create table if not exists public.contract_documents (
  id                  uuid primary key default gen_random_uuid(),
  contract_request_id text not null references public.contract_requests(id) on delete cascade,
  storage_path        text not null,
  file_name           text not null,
  uploaded_by         uuid references auth.users(id) on delete set null,
  uploaded_at         timestamptz not null default now()
);

-- =============================================================================
-- 12. contact_submissions
-- Inquiries captured across Corporate, Coffee, and Leather contact forms.
-- =============================================================================
create table if not exists public.contact_submissions (
  id          uuid primary key default gen_random_uuid(),
  source_site text not null default 'main' check (source_site in ('main', 'coffee', 'leather')),
  name        text not null,
  email       text not null,
  phone       text,
  company     text,
  message     text not null,
  status      text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  created_at  timestamptz not null default now()
);

-- =============================================================================
-- 13. notifications
-- System event notifications and audit log.
-- =============================================================================
create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  event_type text not null,
  recipient  text not null,
  subject    text not null,
  body       text not null,
  metadata   jsonb default '{}',
  created_at timestamptz not null default now()
);

-- =============================================================================
-- Indexes for Performance
-- =============================================================================
create index if not exists idx_orders_site_source         on public.orders(site_source);
create index if not exists idx_orders_user_id             on public.orders(user_id);
create index if not exists idx_orders_payment_status      on public.orders(payment_status);
create index if not exists idx_orders_fulfillment_status  on public.orders(fulfillment_status);
create index if not exists idx_coffee_products_slug       on public.coffee_products(slug);
create index if not exists idx_leather_products_slug      on public.leather_products(slug);
create index if not exists idx_leather_products_category  on public.leather_products(category);
create index if not exists idx_promo_codes_code           on public.promo_codes(code);
create index if not exists idx_sample_requests_status     on public.sample_requests(status);
create index if not exists idx_contract_requests_status   on public.contract_requests(status);
create index if not exists idx_contact_submissions_source on public.contact_submissions(source_site);

-- =============================================================================
-- Trigger: Automated updated_at
-- =============================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger trg_site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

create or replace trigger trg_buyer_profiles_updated_at
  before update on public.buyer_profiles
  for each row execute function public.set_updated_at();

create or replace trigger trg_coffee_products_updated_at
  before update on public.coffee_products
  for each row execute function public.set_updated_at();

create or replace trigger trg_leather_products_updated_at
  before update on public.leather_products
  for each row execute function public.set_updated_at();

create or replace trigger trg_orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

create or replace trigger trg_sample_requests_updated_at
  before update on public.sample_requests
  for each row execute function public.set_updated_at();

create or replace trigger trg_contract_requests_updated_at
  before update on public.contract_requests
  for each row execute function public.set_updated_at();

-- =============================================================================
-- Row Level Security (RLS) Helper Functions
-- =============================================================================
create or replace function public.is_staff()
returns boolean language sql security definer as $$
  select exists (
    select 1 from public.staff
    where id = auth.uid()
  );
$$;

create or replace function public.is_admin()
returns boolean language sql security definer as $$
  select exists (
    select 1 from public.staff
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Enable RLS across all tables
alter table public.site_settings       enable row level security;
alter table public.staff               enable row level security;
alter table public.buyer_profiles      enable row level security;
alter table public.coffee_products     enable row level security;
alter table public.leather_products    enable row level security;
alter table public.orders              enable row level security;
alter table public.promo_codes         enable row level security;
alter table public.leather_wishlists   enable row level security;
alter table public.sample_requests     enable row level security;
alter table public.contract_requests   enable row level security;
alter table public.contract_documents  enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.notifications       enable row level security;

-- Drop existing policies if re-running
drop policy if exists "site_settings_select" on public.site_settings;
drop policy if exists "site_settings_update" on public.site_settings;
drop policy if exists "staff_select" on public.staff;
drop policy if exists "buyer_profiles_select_own" on public.buyer_profiles;
drop policy if exists "buyer_profiles_insert_own" on public.buyer_profiles;
drop policy if exists "buyer_profiles_update_own" on public.buyer_profiles;
drop policy if exists "buyer_profiles_staff" on public.buyer_profiles;
drop policy if exists "coffee_products_select_active" on public.coffee_products;
drop policy if exists "coffee_products_staff_all" on public.coffee_products;
drop policy if exists "leather_products_select_active" on public.leather_products;
drop policy if exists "leather_products_staff_all" on public.leather_products;
drop policy if exists "orders_public_insert" on public.orders;
drop policy if exists "orders_select_own" on public.orders;
drop policy if exists "orders_staff_all" on public.orders;
drop policy if exists "promo_codes_select" on public.promo_codes;
drop policy if exists "promo_codes_staff" on public.promo_codes;
drop policy if exists "leather_wishlists_own" on public.leather_wishlists;
drop policy if exists "sample_requests_insert" on public.sample_requests;
drop policy if exists "sample_requests_select_own" on public.sample_requests;
drop policy if exists "sample_requests_staff" on public.sample_requests;
drop policy if exists "contract_requests_insert" on public.contract_requests;
drop policy if exists "contract_requests_select_own" on public.contract_requests;
drop policy if exists "contract_requests_staff" on public.contract_requests;
drop policy if exists "contract_documents_staff" on public.contract_documents;
drop policy if exists "contact_submissions_insert" on public.contact_submissions;
drop policy if exists "contact_submissions_staff" on public.contact_submissions;
drop policy if exists "notifications_staff" on public.notifications;

-- 1. site_settings
create policy "site_settings_select" on public.site_settings for select using (true);
create policy "site_settings_update" on public.site_settings for update using (public.is_admin());

-- 2. staff
create policy "staff_select" on public.staff for select using (id = auth.uid() or public.is_admin());

-- 3. buyer_profiles
create policy "buyer_profiles_select_own" on public.buyer_profiles for select using (auth.uid() = id);
create policy "buyer_profiles_insert_own" on public.buyer_profiles for insert with check (auth.uid() = id);
create policy "buyer_profiles_update_own" on public.buyer_profiles for update using (auth.uid() = id);
create policy "buyer_profiles_staff" on public.buyer_profiles for all using (public.is_staff());

-- 4. coffee_products
create policy "coffee_products_select_active" on public.coffee_products for select using (is_active = true or public.is_staff());
create policy "coffee_products_staff_all" on public.coffee_products for all using (public.is_staff());

-- 5. leather_products
create policy "leather_products_select_active" on public.leather_products for select using (in_stock = true or public.is_staff());
create policy "leather_products_staff_all" on public.leather_products for all using (public.is_staff());

-- 6. orders
create policy "orders_public_insert" on public.orders for insert with check (true);
create policy "orders_select_own" on public.orders for select using (auth.uid() = user_id or public.is_staff());
create policy "orders_staff_all" on public.orders for all using (public.is_staff());

-- 7. promo_codes
create policy "promo_codes_select" on public.promo_codes for select using (is_active = true or public.is_staff());
create policy "promo_codes_staff" on public.promo_codes for all using (public.is_staff());

-- 8. leather_wishlists
create policy "leather_wishlists_own" on public.leather_wishlists for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 9. sample_requests
create policy "sample_requests_insert" on public.sample_requests for insert with check (true);
create policy "sample_requests_select_own" on public.sample_requests for select using (auth.uid() = buyer_id or public.is_staff());
create policy "sample_requests_staff" on public.sample_requests for all using (public.is_staff());

-- 10. contract_requests
create policy "contract_requests_insert" on public.contract_requests for insert with check (true);
create policy "contract_requests_select_own" on public.contract_requests for select using (auth.uid() = buyer_id or public.is_staff());
create policy "contract_requests_staff" on public.contract_requests for all using (public.is_staff());

-- 11. contract_documents
create policy "contract_documents_staff" on public.contract_documents for all using (public.is_staff());

-- 12. contact_submissions
create policy "contact_submissions_insert" on public.contact_submissions for insert with check (true);
create policy "contact_submissions_staff" on public.contact_submissions for all using (public.is_staff());

-- 13. notifications
create policy "notifications_staff" on public.notifications for select using (public.is_staff());

-- =============================================================================
-- Initial Production Seed Data
-- =============================================================================

-- Seed site_settings
insert into public.site_settings (
  company_name, tagline, contact_email, contact_phone, contact_address,
  social_linkedin, social_twitter, social_instagram
) values (
  'KIJIJ International LLC',
  'Ethiopian Specialty Coffee & Premium Leather — Products, Not Just Opportunities',
  'kijjiinternational@gmail.com',
  '+1 (850) 264-5268',
  '121 Gladys Lane, Saluda, SC 29138, USA',
  'https://linkedin.com/company/kijij-international',
  'https://twitter.com/kijijiintl',
  'https://instagram.com/kijijiintl'
) on conflict do nothing;

-- Seed promo codes
insert into public.promo_codes (
  id, code, discount_type, discount_value, minimum_order, usage_limit, used_count, is_active
) values
  ('prm_kijij20', 'KIJIJ20', 'percentage', 20.00, 100.00, 500, 0, true),
  ('prm_welcome10', 'WELCOME10', 'percentage', 10.00, 50.00, 1000, 0, true)
on conflict (code) do nothing;

-- Seed coffee_products
insert into public.coffee_products (
  id, slug, name, category, region, process, grade, altitude, harvest, tasting_notes,
  price_per_quintal, price_per_kg, current_price, previous_price, unit,
  min_order_quintals, min_order_kg, min_order, image, availability, is_top_product,
  sample_tiers, owner, profile, price_history, is_active
) values
  (
    'cp-1',
    'yirgacheffe-grade-1-washed',
    'Yirgacheffe Grade 1 Washed',
    'Washed',
    'Yirgacheffe',
    'Washed',
    'Grade 1',
    '1,900 – 2,200m',
    'November – January',
    'Jasmine, bergamot, lemongrass, bright peach acidity',
    420.00, 4.20, 420.00, 395.00, '/Quintal',
    10, 1000, '10 Quintals (1,000 kg)',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80',
    'In Stock', true,
    '[{"id":"st-250g","size":"250g","price":0,"isFree":true},{"id":"st-500g","size":"500g","price":0,"isFree":true},{"id":"st-1kg","size":"1kg","price":15,"isFree":false},{"id":"st-2kg","size":"2kg","price":25,"isFree":false}]'::jsonb,
    'Gedeo Highlands Cooperative',
    'Complex floral aroma with silky, honey-sweet tea-like body and vibrant lemon-verbena finish.',
    '[{"date":"2026-06-01","price":390},{"date":"2026-07-15","price":395},{"date":"2026-08-20","price":410},{"date":"2026-09-10","price":420}]'::jsonb,
    true
  ),
  (
    'cp-2',
    'sidama-grade-2-natural',
    'Sidama Grade 2 Natural',
    'Natural',
    'Sidama',
    'Natural',
    'Grade 2',
    '1,800 – 2,000m',
    'October – December',
    'Blueberry, dark chocolate, strawberry jam, winey mouthfeel',
    380.00, 3.80, 380.00, 360.00, '/Quintal',
    15, 1500, '15 Quintals (1,500 kg)',
    'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80',
    'In Stock', false,
    '[{"id":"st-250g","size":"250g","price":0,"isFree":true},{"id":"st-500g","size":"500g","price":0,"isFree":true},{"id":"st-1kg","size":"1kg","price":15,"isFree":false},{"id":"st-2kg","size":"2kg","price":25,"isFree":false}]'::jsonb,
    'Bensa Highland Farmers Union',
    'Intensely aromatic sun-dried natural with dense berry syrup texture and sweet cocoa aftertaste.',
    '[{"date":"2026-06-01","price":350},{"date":"2026-07-15","price":360},{"date":"2026-08-20","price":370},{"date":"2026-09-10","price":380}]'::jsonb,
    true
  ),
  (
    'cp-3',
    'guji-highland-specialty',
    'Guji Highland Specialty',
    'Honey',
    'Guji',
    'Honey',
    'Grade 1',
    '2,000 – 2,300m',
    'December – February',
    'Candied apricot, honeysuckle, red currants, sweet floral',
    460.00, 4.60, 460.00, 440.00, '/Quintal',
    8, 800, '8 Quintals (800 kg)',
    'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=600&q=80',
    'Limited', true,
    '[{"id":"st-250g","size":"250g","price":0,"isFree":true},{"id":"st-500g","size":"500g","price":0,"isFree":true},{"id":"st-1kg","size":"1kg","price":15,"isFree":false},{"id":"st-2kg","size":"2kg","price":25,"isFree":false}]'::jsonb,
    'Uraga Specialty Washing Station',
    'Yellow honey processed lot combining delicate florals with luscious stone-fruit sweetness.',
    '[{"date":"2026-06-01","price":420},{"date":"2026-07-15","price":435},{"date":"2026-08-20","price":450},{"date":"2026-09-10","price":460}]'::jsonb,
    true
  ),
  (
    'cp-4',
    'harar-longberry-wild-forest',
    'Harar Longberry Wild Forest',
    'Natural',
    'Harar',
    'Natural',
    'Grade 4',
    '1,600 – 1,900m',
    'November – January',
    'Ripe blackberry, dried spice, cardamom, rustic dark fruit',
    340.00, 3.40, 340.00, 350.00, '/Quintal',
    20, 2000, '20 Quintals (2,000 kg)',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
    'In Stock', false,
    '[{"id":"st-250g","size":"250g","price":0,"isFree":true},{"id":"st-500g","size":"500g","price":0,"isFree":true},{"id":"st-1kg","size":"1kg","price":15,"isFree":false},{"id":"st-2kg","size":"2kg","price":25,"isFree":false}]'::jsonb,
    'Eastern Highlands Heritage Collective',
    'Traditional dry-processed longberry with heavy body, spicy resonance, and unmistakable wild character.',
    '[{"date":"2026-06-01","price":355},{"date":"2026-07-15","price":350},{"date":"2026-08-20","price":345},{"date":"2026-09-10","price":340}]'::jsonb,
    true
  ),
  (
    'cp-5',
    'limu-washed-grade-2',
    'Limu Washed Grade 2',
    'Washed',
    'Limu',
    'Washed',
    'Grade 2',
    '1,750 – 1,950m',
    'October – December',
    'Sweet mandarin, caramel, green apple, balanced acidity',
    360.00, 3.60, 360.00, 345.00, '/Quintal',
    12, 1200, '12 Quintals (1,200 kg)',
    'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80',
    'In Stock', false,
    '[{"id":"st-250g","size":"250g","price":0,"isFree":true},{"id":"st-500g","size":"500g","price":0,"isFree":true},{"id":"st-1kg","size":"1kg","price":15,"isFree":false},{"id":"st-2kg","size":"2kg","price":25,"isFree":false}]'::jsonb,
    'Kaffa Highland Forest Reserve',
    'Exceptionally clean cup with snappy citrus crispness and brown sugar sweetness.',
    '[{"date":"2026-06-01","price":335},{"date":"2026-07-15","price":340},{"date":"2026-08-20","price":350},{"date":"2026-09-10","price":360}]'::jsonb,
    true
  ),
  (
    'cp-6',
    'jimma-honey-lot',
    'Jimma Honey Lot',
    'Honey',
    'Jimma',
    'Honey',
    'Grade 3',
    '1,650 – 1,850m',
    'November – January',
    'Wild honey, red plum, toasted hazelnut, velvety body',
    330.00, 3.30, 330.00, 315.00, '/Quintal',
    15, 1500, '15 Quintals (1,500 kg)',
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80',
    'In Stock', false,
    '[{"id":"st-250g","size":"250g","price":0,"isFree":true},{"id":"st-500g","size":"500g","price":0,"isFree":true},{"id":"st-1kg","size":"1kg","price":15,"isFree":false},{"id":"st-2kg","size":"2kg","price":25,"isFree":false}]'::jsonb,
    'Gera District Coffee Cooperative',
    'Semi-washed pulped natural showcasing rich dried fruit nuances and caramel undertones.',
    '[{"date":"2026-06-01","price":310},{"date":"2026-07-15","price":315},{"date":"2026-08-20","price":325},{"date":"2026-09-10","price":330}]'::jsonb,
    true
  )
on conflict (slug) do nothing;

-- Seed leather_products
insert into public.leather_products (
  id, slug, name, tagline, category, sub_category, price, original_price,
  description, crafting_note, features, material, origin, care_instructions,
  images, colors, sizes, weight, dimensions, in_stock, stock_count,
  is_new, is_bestseller, is_featured, is_on_sale, tags, rating, review_count
) values
  (
    'lp-001',
    'highland-weekender-duffle',
    'Highland Weekender Duffle',
    'Full-grain Ethiopian cowhide, vegetable tanned',
    'Bags',
    'Duffle',
    350.00, null,
    'A timeless travel companion, the Highland Weekender is shaped from a single continuous cut of full-grain Ethiopian cowhide, selected for its tight grain structure and natural resilience. Solid brass hardware, a reinforced leather-wrapped base, and a hand-stitched main seam ensure this bag outlasts trends and travels.',
    'Hand-stitched at our Addis Ababa atelier over 22 hours by a master cordwainer with over 15 years of experience.',
    array[
      'Full-grain Ethiopian cowhide, vegetable tanned, Harar region',
      'Solid brass hardware, tarnish-resistant',
      'Adjustable & removable shoulder strap with leather pad',
      'Internal zip pocket + two open slip pockets',
      'Reinforced leather base with brass feet',
      'Airline carry-on approved (48cm x 32cm x 22cm)'
    ],
    'Full-grain Ethiopian cowhide',
    'Mojo Leather Tannery, Oromia Region',
    'Condition every 3-6 months with a natural beeswax cream. Avoid prolonged exposure to direct sunlight. Store stuffed with tissue paper.',
    array[
      '/images/highland-weekender.jpg',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80'
    ],
    '[{"name":"Cognac","hex":"#8B4513"},{"name":"Espresso","hex":"#3C1A0E"},{"name":"Midnight Black","hex":"#1A1A1A"}]'::jsonb,
    array[]::text[],
    '1.4 kg',
    '48cm x 32cm x 22cm',
    true, 12, false, true, true, false,
    array['Travel', 'Unisex', 'Gift Idea'],
    4.9, 47
  ),
  (
    'lp-002',
    'addis-classic-biker-jacket',
    'Addis Classic Biker Jacket',
    'Premium Ethiopian sheepskin, butter-soft drape',
    'Jackets',
    'Biker Jacket',
    520.00, null,
    'Channeling a vintage silhouette with modern Ethiopian craftsmanship, the Addis Classic is cut from extraordinarily supple sheepskin hides sourced from the Ethiopian highlands. The asymmetric zip closure and quilted shoulder panels are finished by hand.',
    'Each jacket requires approximately 3 full sheepskins and 34 hours of hand-stitching. No two jackets are identical.',
    array[
      'Premium sheepskin, Ethiopian highland breed',
      'Asymmetrical brass zip closure, YKK mechanism',
      'Quilted shoulder detailing, hand-stitched',
      'Silk-twill lining',
      'Four zip pockets, two chest, two hip'
    ],
    'Ethiopian highland sheepskin',
    'Addis Ababa Leather Village Cooperative',
    'Dry clean only. Hang on a wide cedar hanger. Apply leather conditioner after any rain exposure.',
    array[
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
      'https://images.unsplash.com/photo-1520975954732-57dd22299614?w=800&q=80'
    ],
    '[{"name":"Jet Black","hex":"#0D0D0D"},{"name":"Distressed Brown","hex":"#5C3A1E"}]'::jsonb,
    array['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    '1.9 kg', null,
    true, 8, true, false, true, false,
    array['Outerwear', 'Unisex', 'Gift Idea'],
    4.8, 23
  ),
  (
    'lp-003',
    'rift-valley-messenger-bag',
    'Rift Valley Messenger',
    'Vegetable-tanned cowhide, Hawassa cooperative',
    'Bags',
    'Messenger',
    245.00, null,
    'The Rift Valley Messenger is engineered for the modern professional. The wide body holds a 15" laptop and daily essentials, secured behind a robust leather flap with solid brass turn-lock closure.',
    'Vegetable-tanned in the traditional Rift Valley method, a process requiring 4-6 weeks in bark extract pits before cutting.',
    array[
      'Vegetable-tanned cowhide, naturally water-resistant',
      'Padded laptop sleeve fits up to 15"',
      'Adjustable webbing crossbody strap with leather tab',
      'Quick-access back slip pocket',
      'Solid brass turn-lock closure'
    ],
    'Vegetable-tanned Ethiopian cowhide',
    'Rift Valley Leather Cooperative, Hawassa',
    null,
    array['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80'],
    '[{"name":"Vintage Brown","hex":"#7B4F2E"},{"name":"Black","hex":"#1A1A1A"}]'::jsonb,
    array[]::text[],
    '0.9 kg',
    '38cm x 28cm x 9cm',
    true, 20, false, false, false, false,
    array['Work', 'Daily', 'Laptop'],
    4.7, 61
  ),
  (
    'lp-004',
    'lalibela-bifold-wallet',
    'Lalibela Bifold Wallet',
    'Hand-burnished top-grain leather, slim profile',
    'Wallets',
    'Bifold',
    85.00, null,
    'Cut from a single hide of top-grain leather, hand-burnished at the edges, and stitched with waxed linen thread. It holds eight cards, folded cash, and slips flat into any front pocket.',
    null,
    array[
      'Top-grain leather, hand-burnished edges',
      '8 card slots + 2 cash compartments',
      'Waxed linen thread stitching, hand-finished',
      '7mm slim profile when empty'
    ],
    'Top-grain Ethiopian cowhide',
    null, null,
    array['https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80'],
    '[{"name":"Cognac","hex":"#8B4513"},{"name":"Midnight Black","hex":"#1A1A1A"},{"name":"Olive","hex":"#556B2F"}]'::jsonb,
    array[]::text[],
    null, null,
    true, 35, false, true, false, false,
    array['Gift Idea', 'Slim', 'Daily'],
    4.9, 112
  ),
  (
    'lp-005',
    'lalibela-cardholder',
    'Lalibela Minimalist Cardholder',
    'Top-grain leather, hand-stitched edges',
    'Small Leather Goods',
    'Cardholder',
    48.00, null,
    'Sleek, simple, essential. The Lalibela Cardholder carries up to 6 cards and folded cash without adding any unnecessary bulk. Each one is hand-stitched with waxed linen thread in our Addis Ababa workshop.',
    null,
    array[
      'Top-grain leather, tight grain, high durability',
      '4 card slots + 1 center cash pocket',
      'Hand-stitched edges with waxed linen thread',
      'Develops rich patina with use'
    ],
    'Top-grain Ethiopian cowhide',
    null, null,
    array['https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80'],
    '[{"name":"Cognac","hex":"#8B4513"},{"name":"Black","hex":"#1A1A1A"},{"name":"Olive","hex":"#556B2F"}]'::jsonb,
    array[]::text[],
    null, null,
    true, 48, false, false, false, false,
    array['Gift Idea', 'Slim'],
    4.8, 89
  ),
  (
    'lp-006',
    'harar-braided-belt',
    'Harar Braided Belt',
    'Woven full-grain leather, brushed brass hardware',
    'Belts & Accessories',
    'Belt',
    75.00, null,
    'Woven from four strands of full-grain leather by artisans in the Harar region using a technique passed down across three generations. The brushed brass buckle is cast in solid brass and polished by hand.',
    'Each belt is woven by hand. A single belt takes approximately 90 minutes to complete.',
    array[
      'Four-strand woven full-grain leather',
      'Brushed brass buckle, solid cast, hand-polished',
      '1.25" (32mm) width',
      'Burnished leather tip'
    ],
    'Full-grain Ethiopian cowhide',
    'Harar Leathercraft Collective',
    null,
    array['https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=80'],
    '[{"name":"Tan","hex":"#C19A6B"},{"name":"Chocolate","hex":"#4A2511"}]'::jsonb,
    array['30"', '32"', '34"', '36"', '38"', '40"'],
    null, null,
    true, 25, false, false, false, false,
    array['Unisex', 'Gift Idea'],
    4.7, 34
  ),
  (
    'lp-007',
    'awash-leather-tote',
    'Awash Leather Tote',
    'Soft-tumbled cowhide, unlined suede interior',
    'Bags',
    'Tote',
    195.00, null,
    'The Awash Tote is a study in honest materials. The exterior is soft-tumbled cowhide, and the unlined interior deliberately exposes the raw suede reverse, celebrating the hide rather than hiding it. Reinforced ring handles can bear the weight of a full day.',
    null,
    array[
      'Soft-tumbled cowhide, 72-hour barrel treatment',
      'Unlined suede interior, showcases raw leather beauty',
      'Reinforced ring-top handles, 9" drop',
      'Internal phone and key slip pocket'
    ],
    'Soft-tumbled Ethiopian cowhide',
    null, null,
    array['https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80'],
    '[{"name":"Saddle","hex":"#8B6347"},{"name":"Black","hex":"#1A1A1A"}]'::jsonb,
    array[]::text[],
    '0.7 kg',
    '40cm x 32cm x 12cm',
    true, 18, true, false, false, false,
    array['Daily', 'Work'],
    4.6, 29
  )
on conflict (slug) do nothing;
