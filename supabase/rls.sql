-- =============================================================================
-- Highland Roots Trading PLC — Row Level Security (RLS) Policies
-- Run AFTER schema.sql
-- =============================================================================

-- ── Enable RLS on all public tables ──────────────────────────────────────────
alter table public.site_settings       enable row level security;
alter table public.coffee_products     enable row level security;
alter table public.sample_requests     enable row level security;
alter table public.contract_requests   enable row level security;
alter table public.contract_documents  enable row level security;
alter table public.staff               enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.notifications       enable row level security;

-- =============================================================================
-- Helper: check if current auth user is a staff or admin member
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

-- =============================================================================
-- site_settings
-- Public can read. Only admins can update.
-- =============================================================================
create policy "site_settings: public read"
  on public.site_settings for select
  using (true);

create policy "site_settings: admin update"
  on public.site_settings for update
  using (public.is_admin());

-- =============================================================================
-- coffee_products
-- Public can read active products. Staff can do full CRUD.
-- =============================================================================
create policy "coffee_products: public read active"
  on public.coffee_products for select
  using (is_active = true);

create policy "coffee_products: staff read all"
  on public.coffee_products for select
  using (public.is_staff());

create policy "coffee_products: staff insert"
  on public.coffee_products for insert
  with check (public.is_staff());

create policy "coffee_products: staff update"
  on public.coffee_products for update
  using (public.is_staff());

create policy "coffee_products: admin delete"
  on public.coffee_products for delete
  using (public.is_admin());

-- =============================================================================
-- sample_requests
-- Anonymous (public) buyers can INSERT (submit a request).
-- They cannot read other buyers' rows.
-- Staff can read and update all rows.
-- =============================================================================
create policy "sample_requests: public insert"
  on public.sample_requests for insert
  with check (true);   -- anon can submit

-- Public cannot SELECT (no row matches for anonymous users)
-- Staff can read/update everything
create policy "sample_requests: staff read"
  on public.sample_requests for select
  using (public.is_staff());

create policy "sample_requests: staff update"
  on public.sample_requests for update
  using (public.is_staff());

-- =============================================================================
-- contract_requests
-- Same pattern as sample_requests.
-- =============================================================================
create policy "contract_requests: public insert"
  on public.contract_requests for insert
  with check (true);

create policy "contract_requests: staff read"
  on public.contract_requests for select
  using (public.is_staff());

create policy "contract_requests: staff update"
  on public.contract_requests for update
  using (public.is_staff());

-- =============================================================================
-- contract_documents
-- Only staff can insert (upload) and read documents.
-- =============================================================================
create policy "contract_documents: staff insert"
  on public.contract_documents for insert
  with check (public.is_staff());

create policy "contract_documents: staff read"
  on public.contract_documents for select
  using (public.is_staff());

-- =============================================================================
-- staff
-- Staff can read their own row. Admins can read all rows.
-- Only service-role (backend) can insert/update/delete (via Supabase dashboard or migration).
-- =============================================================================
create policy "staff: read own row"
  on public.staff for select
  using (id = auth.uid());

create policy "staff: admin read all"
  on public.staff for select
  using (public.is_admin());

-- =============================================================================
-- contact_submissions
-- Anonymous users can INSERT. Only staff can read.
-- =============================================================================
create policy "contact_submissions: public insert"
  on public.contact_submissions for insert
  with check (true);

create policy "contact_submissions: staff read"
  on public.contact_submissions for select
  using (public.is_staff());

-- =============================================================================
-- notifications
-- Only staff can read (this is an internal event log, not buyer-facing).
-- Service role inserts (from server-side functions / supabase client with service key).
-- =============================================================================
create policy "notifications: staff read"
  on public.notifications for select
  using (public.is_staff());

-- Note: INSERT on notifications is done server-side using the service role key,
-- which bypasses RLS by design.
