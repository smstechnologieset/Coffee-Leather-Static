# Setup Guide — Highland Roots Trading PLC

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | 18+ | LTS recommended |
| npm | 9+ | Comes with Node |
| Git | any | — |

---

## 1. Clone the repo

```bash
git clone <repo-url>
cd Coffee-Leather-Static
```

---

## 2. Install dependencies

From the repo root (installs all workspace packages):

```bash
npm install
```

---

## 3. Configure environment variables

Copy the example file and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Then copy `.env.local` into each app directory:

```bash
cp .env.local main-site/.env.local
cp .env.local coffee-site/.env.local
cp .env.local leather-site/.env.local
```

**Values to fill in** (find these in the Supabase dashboard → Settings → API):

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` / `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` key — **server-side only, never expose to browser** |
| `NEXT_PUBLIC_MAIN_SITE_URL` | `http://localhost:3000` locally |
| `NEXT_PUBLIC_COFFEE_SITE_URL` | `http://localhost:3001` locally |
| `NEXT_PUBLIC_LEATHER_SITE_URL` | `http://localhost:3002` locally |

---

## 4. Apply the database schema

In the Supabase dashboard → **SQL Editor**, run these three files in order:

1. `supabase/schema.sql`
2. `supabase/rls.sql`
3. `supabase/seed.sql`

Or if you have the Supabase CLI installed:

```bash
supabase db push
```

---

## 5. Create the storage bucket

In Supabase dashboard → **Storage** → **New bucket**:
- Name: `contract-documents`
- Public: **off** (private)

---

## 6. Create the first admin user

1. In Supabase dashboard → **Authentication** → **Users** → **Invite user** → enter your email.
2. Click the confirmation link in the email.
3. In the SQL Editor, insert a staff row:

```sql
insert into public.staff (id, email, full_name, role)
values (
  '<paste-auth-user-uuid-here>',
  'your@email.com',
  'Your Name',
  'admin'
);
```

---

## 7. Run the apps locally

Open three terminals (or use three tabs):

```bash
# Terminal 1 — main site (port 3000)
npm run dev --workspace=main-site

# Terminal 2 — coffee site (port 3001)
npm run dev --workspace=coffee-site

# Terminal 3 — leather site (port 3002)
npm run dev --workspace=leather-site
```

Or from the root shortcut scripts:

```bash
npm run dev:main
npm run dev:coffee
npm run dev:leather
```

---

## 8. Build all apps (production check)

```bash
npm run build:all
```

All three apps should compile with zero errors before pushing.
