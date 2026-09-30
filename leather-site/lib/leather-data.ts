// leather-site/lib/leather-data.ts
// Phase 1: Upgraded data model + localStorage CRUD (mirrors coffee-site pattern)

export type LeatherCategory =
  | 'Bags'
  | 'Jackets'
  | 'Small Leather Goods'
  | 'Belts & Accessories'
  | 'Wallets';

export interface LeatherColor {
  name: string;
  hex: string;
}

export interface LeatherProduct {
  id: string;
  slug: string;
  name: string;
  tagline: string;               // Short luxury material descriptor
  category: LeatherCategory;
  subCategory?: string;          // e.g. "Tote", "Crossbody", "Biker Jacket"
  price: number;
  originalPrice?: number;        // If on sale — show crossed out price
  description: string;
  craftingNote?: string;         // e.g. "Hand-stitched in Addis Ababa over 14 hours"
  features: string[];
  material: string;              // e.g. "Full-grain Ethiopian cowhide"
  origin?: string;               // e.g. "Mojo Leather Tannery, Oromia Region"
  careInstructions?: string;
  images: string[];
  colors: LeatherColor[];
  sizes?: string[];
  weight?: string;               // e.g. "1.2 kg"
  dimensions?: string;           // e.g. "48cm x 32cm x 18cm"
  inStock: boolean;
  stockCount?: number;
  isNew?: boolean;               // "New In" badge
  isBestseller?: boolean;        // "Bestseller" badge
  isFeatured?: boolean;          // Homepage feature carousel
  isOnSale?: boolean;            // Sale badge + crossed price
  tags?: string[];               // e.g. ["Travel", "Unisex", "Gift Idea"]
  rating?: number;               // 1.0 - 5.0
  reviewCount?: number;
  createdAt: string;
}

// --- Storage Keys ---
const STORAGE_KEY = 'kijij_leather_products_v1';
const ORDERS_KEY  = 'kijij_leather_orders_v1';
const PROMOS_KEY  = 'kijij_leather_promos_v1';

// --- Seed Data ---
export const INITIAL_LEATHER_PRODUCTS: LeatherProduct[] = [
  {
    id: 'lp-001',
    slug: 'highland-weekender-duffle',
    name: 'Highland Weekender Duffle',
    tagline: 'Full-grain Ethiopian cowhide, vegetable tanned',
    category: 'Bags',
    subCategory: 'Duffle',
    price: 350.00,
    description:
      'A timeless travel companion, the Highland Weekender is shaped from a single continuous cut of full-grain Ethiopian cowhide, selected for its tight grain structure and natural resilience. Solid brass hardware, a reinforced leather-wrapped base, and a hand-stitched main seam ensure this bag outlasts trends and travels.',
    craftingNote: 'Hand-stitched at our Addis Ababa atelier over 22 hours by a master cordwainer with over 15 years of experience.',
    features: [
      'Full-grain Ethiopian cowhide, vegetable tanned, Harar region',
      'Solid brass hardware, tarnish-resistant',
      'Adjustable & removable shoulder strap with leather pad',
      'Internal zip pocket + two open slip pockets',
      'Reinforced leather base with brass feet',
      'Airline carry-on approved (48cm x 32cm x 22cm)',
    ],
    material: 'Full-grain Ethiopian cowhide',
    origin: 'Mojo Leather Tannery, Oromia Region',
    careInstructions: 'Condition every 3-6 months with a natural beeswax cream. Avoid prolonged exposure to direct sunlight. Store stuffed with tissue paper.',
    images: [
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
    ],
    colors: [
      { name: 'Cognac', hex: '#8B4513' },
      { name: 'Espresso', hex: '#3C1A0E' },
      { name: 'Midnight Black', hex: '#1A1A1A' },
    ],
    weight: '1.4 kg',
    dimensions: '48cm x 32cm x 22cm',
    inStock: true,
    stockCount: 12,
    isBestseller: true,
    isFeatured: true,
    tags: ['Travel', 'Unisex', 'Gift Idea'],
    rating: 4.9,
    reviewCount: 47,
    createdAt: '2026-08-15T10:00:00.000Z',
  },
  {
    id: 'lp-002',
    slug: 'addis-classic-biker-jacket',
    name: 'Addis Classic Biker Jacket',
    tagline: 'Premium Ethiopian sheepskin, butter-soft drape',
    category: 'Jackets',
    subCategory: 'Biker Jacket',
    price: 520.00,
    description:
      'Channeling a vintage silhouette with modern Ethiopian craftsmanship, the Addis Classic is cut from extraordinarily supple sheepskin hides sourced from the Ethiopian highlands. The asymmetric zip closure and quilted shoulder panels are finished by hand.',
    craftingNote: 'Each jacket requires approximately 3 full sheepskins and 34 hours of hand-stitching. No two jackets are identical.',
    features: [
      'Premium sheepskin, Ethiopian highland breed',
      'Asymmetrical brass zip closure, YKK mechanism',
      'Quilted shoulder detailing, hand-stitched',
      'Silk-twill lining',
      'Four zip pockets, two chest, two hip',
    ],
    material: 'Ethiopian highland sheepskin',
    origin: 'Addis Ababa Leather Village Cooperative',
    careInstructions: 'Dry clean only. Hang on a wide cedar hanger. Apply leather conditioner after any rain exposure.',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
      'https://images.unsplash.com/photo-1520975954732-57dd22299614?w=800&q=80',
    ],
    colors: [
      { name: 'Jet Black', hex: '#0D0D0D' },
      { name: 'Distressed Brown', hex: '#5C3A1E' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    weight: '1.9 kg',
    inStock: true,
    stockCount: 8,
    isNew: true,
    isFeatured: true,
    tags: ['Outerwear', 'Unisex', 'Gift Idea'],
    rating: 4.8,
    reviewCount: 23,
    createdAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'lp-003',
    slug: 'rift-valley-messenger-bag',
    name: 'Rift Valley Messenger',
    tagline: 'Vegetable-tanned cowhide, Hawassa cooperative',
    category: 'Bags',
    subCategory: 'Messenger',
    price: 245.00,
    description:
      'The Rift Valley Messenger is engineered for the modern professional. The wide body holds a 15" laptop and daily essentials, secured behind a robust leather flap with solid brass turn-lock closure.',
    craftingNote: 'Vegetable-tanned in the traditional Rift Valley method, a process requiring 4-6 weeks in bark extract pits before cutting.',
    features: [
      'Vegetable-tanned cowhide, naturally water-resistant',
      'Padded laptop sleeve fits up to 15"',
      'Adjustable webbing crossbody strap with leather tab',
      'Quick-access back slip pocket',
      'Solid brass turn-lock closure',
    ],
    material: 'Vegetable-tanned Ethiopian cowhide',
    origin: 'Rift Valley Leather Cooperative, Hawassa',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
    ],
    colors: [
      { name: 'Vintage Brown', hex: '#7B4F2E' },
      { name: 'Black', hex: '#1A1A1A' },
    ],
    weight: '0.9 kg',
    dimensions: '38cm x 28cm x 9cm',
    inStock: true,
    stockCount: 20,
    tags: ['Work', 'Daily', 'Laptop'],
    rating: 4.7,
    reviewCount: 61,
    createdAt: '2026-07-20T10:00:00.000Z',
  },
  {
    id: 'lp-004',
    slug: 'lalibela-bifold-wallet',
    name: 'Lalibela Bifold Wallet',
    tagline: 'Hand-burnished top-grain leather, slim profile',
    category: 'Wallets',
    subCategory: 'Bifold',
    price: 85.00,
    description:
      'Cut from a single hide of top-grain leather, hand-burnished at the edges, and stitched with waxed linen thread. It holds eight cards, folded cash, and slips flat into any front pocket.',
    features: [
      'Top-grain leather, hand-burnished edges',
      '8 card slots + 2 cash compartments',
      'Waxed linen thread stitching, hand-finished',
      '7mm slim profile when empty',
    ],
    material: 'Top-grain Ethiopian cowhide',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
    ],
    colors: [
      { name: 'Cognac', hex: '#8B4513' },
      { name: 'Midnight Black', hex: '#1A1A1A' },
      { name: 'Olive', hex: '#556B2F' },
    ],
    inStock: true,
    stockCount: 35,
    isBestseller: true,
    tags: ['Gift Idea', 'Slim', 'Daily'],
    rating: 4.9,
    reviewCount: 112,
    createdAt: '2026-06-10T10:00:00.000Z',
  },
  {
    id: 'lp-005',
    slug: 'lalibela-cardholder',
    name: 'Lalibela Minimalist Cardholder',
    tagline: 'Top-grain leather, hand-stitched edges',
    category: 'Small Leather Goods',
    subCategory: 'Cardholder',
    price: 48.00,
    description:
      'Sleek, simple, essential. The Lalibela Cardholder carries up to 6 cards and folded cash without adding any unnecessary bulk. Each one is hand-stitched with waxed linen thread in our Addis Ababa workshop.',
    features: [
      'Top-grain leather, tight grain, high durability',
      '4 card slots + 1 center cash pocket',
      'Hand-stitched edges with waxed linen thread',
      'Develops rich patina with use',
    ],
    material: 'Top-grain Ethiopian cowhide',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
    ],
    colors: [
      { name: 'Cognac', hex: '#8B4513' },
      { name: 'Black', hex: '#1A1A1A' },
      { name: 'Olive', hex: '#556B2F' },
    ],
    inStock: true,
    stockCount: 48,
    tags: ['Gift Idea', 'Slim'],
    rating: 4.8,
    reviewCount: 89,
    createdAt: '2026-06-10T10:00:00.000Z',
  },
  {
    id: 'lp-006',
    slug: 'harar-braided-belt',
    name: 'Harar Braided Belt',
    tagline: 'Woven full-grain leather, brushed brass hardware',
    category: 'Belts & Accessories',
    subCategory: 'Belt',
    price: 75.00,
    description:
      'Woven from four strands of full-grain leather by artisans in the Harar region using a technique passed down across three generations. The brushed brass buckle is cast in solid brass and polished by hand.',
    craftingNote: 'Each belt is woven by hand. A single belt takes approximately 90 minutes to complete.',
    features: [
      'Four-strand woven full-grain leather',
      'Brushed brass buckle, solid cast, hand-polished',
      '1.25" (32mm) width',
      'Burnished leather tip',
    ],
    material: 'Full-grain Ethiopian cowhide',
    origin: 'Harar Leathercraft Collective',
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=80',
    ],
    colors: [
      { name: 'Tan', hex: '#C19A6B' },
      { name: 'Chocolate', hex: '#4A2511' },
    ],
    sizes: ['30"', '32"', '34"', '36"', '38"', '40"'],
    inStock: true,
    stockCount: 25,
    tags: ['Unisex', 'Gift Idea'],
    rating: 4.7,
    reviewCount: 34,
    createdAt: '2026-07-01T10:00:00.000Z',
  },
  {
    id: 'lp-007',
    slug: 'awash-leather-tote',
    name: 'Awash Leather Tote',
    tagline: 'Soft-tumbled cowhide, unlined suede interior',
    category: 'Bags',
    subCategory: 'Tote',
    price: 195.00,
    description:
      'The Awash Tote is a study in honest materials. The exterior is soft-tumbled cowhide, and the unlined interior deliberately exposes the raw suede reverse, celebrating the hide rather than hiding it. Reinforced ring handles can bear the weight of a full day.',
    features: [
      'Soft-tumbled cowhide, 72-hour barrel treatment',
      'Unlined suede interior, showcases raw leather beauty',
      'Reinforced ring-top handles, 9" drop',
      'Internal phone and key slip pocket',
    ],
    material: 'Soft-tumbled Ethiopian cowhide',
    images: [
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80',
    ],
    colors: [
      { name: 'Saddle', hex: '#8B6347' },
      { name: 'Black', hex: '#1A1A1A' },
    ],
    weight: '0.7 kg',
    dimensions: '40cm x 32cm x 12cm',
    inStock: true,
    stockCount: 18,
    isNew: true,
    tags: ['Daily', 'Work'],
    rating: 4.6,
    reviewCount: 29,
    createdAt: '2026-09-10T10:00:00.000Z',
  },
];

// --- Data Access (localStorage with seed fallback) ---

export function getLeatherProducts(): LeatherProduct[] {
  if (typeof window === 'undefined') return INITIAL_LEATHER_PRODUCTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LEATHER_PRODUCTS));
      return INITIAL_LEATHER_PRODUCTS;
    }
    const parsed: LeatherProduct[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_LEATHER_PRODUCTS;
    return parsed;
  } catch {
    return INITIAL_LEATHER_PRODUCTS;
  }
}

export function getLeatherProductBySlug(slug: string): LeatherProduct | undefined {
  return getLeatherProducts().find(
    (p) =>
      p.slug === slug ||
      p.id === slug ||
      p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug.toLowerCase()
  );
}

export function saveLeatherProduct(product: LeatherProduct): void {
  if (typeof window === 'undefined') return;
  const products = getLeatherProducts();
  const idx = products.findIndex((p) => p.id === product.id);
  if (idx >= 0) {
    products[idx] = product;
  } else {
    products.unshift(product);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  window.dispatchEvent(new CustomEvent('kijij_leather_products_updated', { detail: products }));
}

export function deleteLeatherProduct(id: string): void {
  if (typeof window === 'undefined') return;
  const products = getLeatherProducts().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  window.dispatchEvent(new CustomEvent('kijij_leather_products_updated', { detail: products }));
}

// --- Order Types ---

export type LeatherOrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface LeatherOrderItem {
  productId: string;
  productName: string;
  productImage: string;
  color: string;
  size?: string;
  quantity: number;
  unitPrice: number;
}

export interface LeatherOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: {
    line1: string;
    city: string;
    country: string;
    postalCode?: string;
  };
  items: LeatherOrderItem[];
  subtotal: number;
  discountAmount: number;
  promoCode?: string;
  total: number;
  stripeSessionId?: string;
  status: LeatherOrderStatus;
  carrier?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export function getLeatherOrders(): LeatherOrder[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLeatherOrder(order: LeatherOrder): LeatherOrder {
  if (typeof window === 'undefined') return order;
  const orders = getLeatherOrders();
  const full: LeatherOrder = {
    ...order,
    id: order.id || `lo_${Date.now().toString().slice(-8)}`,
    createdAt: order.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const idx = orders.findIndex((o) => o.id === full.id);
  if (idx >= 0) {
    orders[idx] = full;
  } else {
    orders.unshift(full);
  }
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  window.dispatchEvent(new CustomEvent('kijij_leather_orders_updated', { detail: orders }));
  return full;
}

export function updateLeatherOrderStatus(
  id: string,
  status: LeatherOrderStatus,
  carrier?: string,
  trackingNumber?: string
): void {
  if (typeof window === 'undefined') return;
  const orders = getLeatherOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx >= 0) {
    orders[idx] = {
      ...orders[idx],
      status,
      carrier: carrier ?? orders[idx].carrier,
      trackingNumber: trackingNumber ?? orders[idx].trackingNumber,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('kijij_leather_orders_updated', { detail: orders }));
  }
}

// --- Promo Code Types ---

export interface LeatherPromo {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumOrder?: number;
  usageLimit?: number;
  usedCount: number;
  singleUsePerCustomer: boolean;
  validFrom: string;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}

const INITIAL_PROMOS: LeatherPromo[] = [
  {
    id: 'promo-001',
    code: 'KIJIJ20',
    discountType: 'percentage',
    discountValue: 20,
    minimumOrder: 100,
    usageLimit: 500,
    usedCount: 0,
    singleUsePerCustomer: false,
    validFrom: new Date().toISOString(),
    expiresAt: undefined,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export function getLeatherPromos(): LeatherPromo[] {
  if (typeof window === 'undefined') return INITIAL_PROMOS;
  try {
    const raw = localStorage.getItem(PROMOS_KEY);
    if (!raw) {
      localStorage.setItem(PROMOS_KEY, JSON.stringify(INITIAL_PROMOS));
      return INITIAL_PROMOS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_PROMOS;
  } catch {
    return INITIAL_PROMOS;
  }
}

export function saveLeatherPromo(promo: LeatherPromo): void {
  if (typeof window === 'undefined') return;
  const promos = getLeatherPromos();
  const idx = promos.findIndex((p) => p.id === promo.id);
  if (idx >= 0) {
    promos[idx] = promo;
  } else {
    promos.unshift(promo);
  }
  localStorage.setItem(PROMOS_KEY, JSON.stringify(promos));
  window.dispatchEvent(new CustomEvent('kijij_leather_promos_updated'));
}

export function deleteLeatherPromo(id: string): void {
  if (typeof window === 'undefined') return;
  const promos = getLeatherPromos().filter((p) => p.id !== id);
  localStorage.setItem(PROMOS_KEY, JSON.stringify(promos));
  window.dispatchEvent(new CustomEvent('kijij_leather_promos_updated'));
}

/** Validate and calculate discount for a promo code at checkout */
export function applyPromoCode(
  code: string,
  cartSubtotal: number
): { valid: boolean; discount: number; message: string; promo?: LeatherPromo } {
  const promos = getLeatherPromos();
  const promo = promos.find((p) => p.code.toUpperCase() === code.toUpperCase());

  if (!promo) return { valid: false, discount: 0, message: 'Promo code not found.' };
  if (!promo.isActive) return { valid: false, discount: 0, message: 'This promo code is no longer active.' };
  if (promo.expiresAt && new Date(promo.expiresAt) < new Date())
    return { valid: false, discount: 0, message: 'This promo code has expired.' };
  if (promo.usageLimit && promo.usedCount >= promo.usageLimit)
    return { valid: false, discount: 0, message: 'This promo code has reached its usage limit.' };
  if (promo.minimumOrder && cartSubtotal < promo.minimumOrder)
    return {
      valid: false,
      discount: 0,
      message: `Minimum order of $${promo.minimumOrder.toFixed(2)} required to use this code.`,
    };

  const discount =
    promo.discountType === 'percentage'
      ? (cartSubtotal * promo.discountValue) / 100
      : Math.min(promo.discountValue, cartSubtotal);

  return {
    valid: true,
    discount: parseFloat(discount.toFixed(2)),
    message: `Code applied: ${promo.discountType === 'percentage' ? `${promo.discountValue}% off` : `$${promo.discountValue} off`}`,
    promo,
  };
}

// Legacy export for backward compatibility
export const LEATHER_PRODUCTS = INITIAL_LEATHER_PRODUCTS;


