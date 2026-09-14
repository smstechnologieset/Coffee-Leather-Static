# Mock Data Register — Highland Roots Trading PLC

> ⚠️  Everything in this file is **placeholder/mock**. None of it should ship as real content.  
> Update this file whenever something fake is added or a placeholder is replaced with real data.

---

## Company Identity

| Item | Current mock value | Status |
|---|---|---|
| Company name | "Highland Roots Trading PLC" | **MOCK** — set in `shared/site-config.ts` and `supabase/seed.sql` |
| Tagline | "Ethiopia's Finest, Delivered to the World" | **MOCK** |
| Logo | None — text placeholder | **MOCK** — no logo asset yet |
| Brand colors | Warm amber/gold + forest green | **MOCK** — set in `shared/tailwind-base.js` |
| Founded year | 2019 | **MOCK** |

---

## Contact Details

| Item | Mock value | Status |
|---|---|---|
| Email | `info@highlandroots.example.com` | **MOCK** `.example.com` domain |
| Phone | `+251 11 234 5678` | **MOCK** |
| Address | "Bole Road, Addis Ababa, Ethiopia" | **MOCK** |

---

## Social Media

| Platform | Mock URL | Status |
|---|---|---|
| LinkedIn | `linkedin.com/company/highland-roots` | **MOCK** placeholder |
| Twitter/X | `twitter.com/highland_roots` | **MOCK** placeholder |
| Instagram | `instagram.com/highland_roots` | **MOCK** placeholder |

---

## Coffee Products (`coffee_products` table)

All six products in the catalog are mock data from the spec (§6.1). None of these prices, certifications, or availability details are real.

| Field | Status |
|---|---|
| All 6 products (names, regions, grades, tasting notes) | **MOCK** — realistic placeholders, not real inventory |
| Certifications labeled "(mock)" | **MOCK** — not real Organic or Fair Trade certifications |
| `price_indicative` / `price_note` | **MOCK** — "Contact for quote" / "Indicative — TBD" |
| Sample size (250g) | **MOCK** — best guess from questionnaire draft |
| Bulk sizes (60kg / 1t / 19.2t container) | **MOCK** — standard export sizes, not yet confirmed by client |

---

## Main Site Content

| Item | Status |
|---|---|
| About Us copy | **MOCK** — AI-generated professional placeholder text |
| News/blog posts (3–4) | **MOCK** — fictional news items |
| Gallery images | **MOCK** — Picsum placeholder images (`picsum.photos`) |
| Mission/vision/values | **MOCK** |

---

## Payment

| Item | Status |
|---|---|
| Stripe integration | **NOT BUILT** — mocked. `processPayment()` simulates a payment by updating DB status only |
| Payment UI | **MOCK** — "Simulate Payment (Test Mode)" button, clearly labeled |

---

## Email / Notifications

| Item | Status |
|---|---|
| Email notifications | **NOT BUILT** — logged to `notifications` table only, no real emails sent |

---

## Leather Store

| Item | Status |
|---|---|
| Entire leather e-commerce store | **SCAFFOLD ONLY** — Coming Soon page only; no products, cart, checkout, or admin |

---

## What triggers removal from this list

An item comes off this list when:
1. The client returns the relevant questionnaire and confirms the real value.
2. The real value is entered via the admin dashboard (for content/products).
3. The real system is integrated (for Stripe and email).

Always update this file when making a replacement.
