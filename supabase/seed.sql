-- =============================================================================
-- Highland Roots Trading PLC — Seed Data
-- Run AFTER schema.sql and rls.sql
-- All data below is MOCK — see /docs/MOCK_DATA.md
-- =============================================================================

-- ── site_settings (single row) ────────────────────────────────────────────────
insert into public.site_settings (
  company_name, tagline, contact_email, contact_phone, contact_address,
  social_linkedin, social_twitter, social_instagram
) values (
  'Highland Roots Trading PLC',
  'Ethiopia''s Finest, Delivered to the World',
  'info@highlandroots.example.com',
  '+251 11 234 5678',
  'Bole Road, Addis Ababa, Ethiopia',
  'https://linkedin.com/company/highland-roots',
  'https://twitter.com/highland_roots',
  'https://instagram.com/highland_roots'
)
on conflict do nothing;

-- ── coffee_products (6 mock products from §6.1) ───────────────────────────────
insert into public.coffee_products
  (slug, name, region, process_method, grade, altitude_masl, tasting_notes,
   harvest_window, certifications, bulk_options)
values
  (
    'yirgacheffe-washed',
    'Yirgacheffe Washed',
    'Yirgacheffe, Gedeo Zone',
    'Washed',
    'Grade 1',
    '1,900–2,200 masl',
    'Floral, jasmine, bergamot, bright citrus',
    'Oct–Jan',
    array['Organic (mock)', 'Fair Trade (mock)'],
    '[
      {"label": "60 kg bag", "quantity_kg": 60,      "price_indicative": "Contact for quote"},
      {"label": "1 ton",     "quantity_kg": 1000,    "price_indicative": "Contact for quote"},
      {"label": "20ft container (~19.2 t)", "quantity_kg": 19200, "price_indicative": "Contact for quote"}
    ]'::jsonb
  ),
  (
    'sidamo-natural',
    'Sidamo Natural',
    'Sidamo',
    'Natural (sun-dried)',
    'Grade 2',
    '1,700–2,000 masl',
    'Blueberry, red wine, dark chocolate',
    'Nov–Feb',
    array['Organic (mock)'],
    '[
      {"label": "60 kg bag", "quantity_kg": 60,      "price_indicative": "Contact for quote"},
      {"label": "1 ton",     "quantity_kg": 1000,    "price_indicative": "Contact for quote"},
      {"label": "20ft container (~19.2 t)", "quantity_kg": 19200, "price_indicative": "Contact for quote"}
    ]'::jsonb
  ),
  (
    'guji-honey',
    'Guji Honey',
    'Guji Zone',
    'Honey',
    'Grade 1',
    '1,850–2,100 masl',
    'Stone fruit, honey sweetness, tropical',
    'Nov–Jan',
    array['Organic (mock)'],
    '[
      {"label": "60 kg bag", "quantity_kg": 60,      "price_indicative": "Contact for quote"},
      {"label": "1 ton",     "quantity_kg": 1000,    "price_indicative": "Contact for quote"},
      {"label": "20ft container (~19.2 t)", "quantity_kg": 19200, "price_indicative": "Contact for quote"}
    ]'::jsonb
  ),
  (
    'harar-natural',
    'Harar Natural',
    'Harar',
    'Natural',
    'Grade 4',
    '1,500–2,100 masl',
    'Blueberry, wine, warm spice',
    'Oct–Dec',
    array[]::text[],
    '[
      {"label": "60 kg bag", "quantity_kg": 60,      "price_indicative": "Contact for quote"},
      {"label": "1 ton",     "quantity_kg": 1000,    "price_indicative": "Contact for quote"},
      {"label": "20ft container (~19.2 t)", "quantity_kg": 19200, "price_indicative": "Contact for quote"}
    ]'::jsonb
  ),
  (
    'limu-washed',
    'Limu Washed',
    'Limu',
    'Washed',
    'Grade 2',
    '1,600–1,900 masl',
    'Balanced, mild spice, citrus',
    'Oct–Jan',
    array[]::text[],
    '[
      {"label": "60 kg bag", "quantity_kg": 60,      "price_indicative": "Contact for quote"},
      {"label": "1 ton",     "quantity_kg": 1000,    "price_indicative": "Contact for quote"},
      {"label": "20ft container (~19.2 t)", "quantity_kg": 19200, "price_indicative": "Contact for quote"}
    ]'::jsonb
  ),
  (
    'jimma-natural',
    'Jimma Natural',
    'Jimma',
    'Natural',
    'Grade 3',
    '1,400–1,800 masl',
    'Earthy, full body, dried fruit',
    'Nov–Feb',
    array[]::text[],
    '[
      {"label": "60 kg bag", "quantity_kg": 60,      "price_indicative": "Contact for quote"},
      {"label": "1 ton",     "quantity_kg": 1000,    "price_indicative": "Contact for quote"},
      {"label": "20ft container (~19.2 t)", "quantity_kg": 19200, "price_indicative": "Contact for quote"}
    ]'::jsonb
  )
on conflict (slug) do nothing;
