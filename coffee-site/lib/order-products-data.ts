/**
 * coffee-site/lib/order-products-data.ts
 *
 * Dedicated store for direct-to-consumer "Order Now" packaged coffee products.
 * These products are bought by individuals living abroad with direct full-amount payment.
 */

export interface OrderNowProduct {
  id: string;
  name: string;             // e.g. "Special Mixed"
  tagline: string;          // e.g. "Signature Ethiopian Highland Roast"
  description: string;      // Full flavor & processing description
  origin: string;           // e.g. "Sidamo & Yirgacheffe Highlands"
  unit: 'g' | 'kg' | 'quintal'; // Unit scale
  packageWeight: number;    // e.g. 1 (for 1kg) or 500 (for 500g)
  price: number;            // Fixed USD price per unit
  image: string;            // Product photo
  flavorNotes: string[];    // e.g. ['Jasmine', 'Dark Honey', 'Stone Fruit']
  inStock: boolean;
  featured?: boolean;
  createdAt: string;
  packageLabel?: string;     // e.g. "1 kg"
  roastLevel?: string;
  grindOptions?: string[];
}

const STORAGE_KEY = 'kijij_order_now_products';

export const INITIAL_ORDER_NOW_PRODUCTS: OrderNowProduct[] = [
  {
    id: 'onp-special-mixed-1kg',
    name: 'Special Mixed',
    tagline: 'Signature Ethiopian Highland Roast — Packaged for Direct Delivery Abroad',
    description:
      'A masterfully crafted blend of sun-dried heirloom Sidamo naturals and washed highland Yirgacheffe beans. Roasted in small batches in Addis Ababa, sealed immediately in multi-layer aroma-valve pouches for peak freshness during international transit.',
    origin: 'Sidamo & Yirgacheffe Highlands (1,900m - 2,200m)',
    unit: 'kg',
    packageWeight: 1,
    packageLabel: '1kg Sealed Aroma-Valve Bag',
    price: 28,
    image: 'https://images.unsplash.com/photo-1559525839-8f8ec320b985?w=800&q=80',
    flavorNotes: ['Floral Jasmine', 'Bergamot', 'Wild Honey', 'Velvety Milk Chocolate'],
    inStock: true,
    featured: true,
    createdAt: '2026-09-20T10:00:00.000Z',
  },
  {
    id: 'onp-special-mixed-500g',
    name: 'Special Mixed (Compact Pack)',
    tagline: 'Hand-Selected Heirloom Beans in Convenient 500g Package',
    description:
      'The authentic taste of Ethiopian highland coffee in a 500g personal package. Ideal for gifting, home brewing, and tasting the balanced complexity of our signature blend.',
    origin: 'Sidamo & Yirgacheffe Highlands',
    unit: 'g',
    packageWeight: 500,
    packageLabel: '500g Degassing Pouch',
    price: 16,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80',
    flavorNotes: ['Sweet Apricot', 'Orange Blossom', 'Caramelized Sugar'],
    inStock: true,
    featured: false,
    createdAt: '2026-09-22T10:00:00.000Z',
  },
  {
    id: 'onp-harar-dark-roast-1kg',
    name: 'Harar Wild Moka Dark Roast',
    tagline: 'Bold, Winey & Spicy Traditional Roastery Package',
    description:
      'Classic dry-processed wild Harar beans taken to a deep, resonant medium-dark roast. Delivers a heavy, syrupy body with distinctive berry undertones, beloved by the diaspora worldwide.',
    origin: 'Eastern Harar Highlands (1,800m - 2,000m)',
    unit: 'kg',
    packageWeight: 1,
    packageLabel: '1kg Heavy-Duty Foil Bag',
    price: 30,
    image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=800&q=80',
    flavorNotes: ['Blackberry Compote', 'Cardamom', 'Baker’s Chocolate'],
    inStock: true,
    featured: false,
    createdAt: '2026-09-25T11:00:00.000Z',
  },
];

export function getOrderNowProducts(): OrderNowProduct[] {
  if (typeof window === 'undefined') return INITIAL_ORDER_NOW_PRODUCTS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ORDER_NOW_PRODUCTS));
      return INITIAL_ORDER_NOW_PRODUCTS;
    }
    const parsed: OrderNowProduct[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return INITIAL_ORDER_NOW_PRODUCTS;
    }
    return parsed;
  } catch (e) {
    console.error('Failed to read Order Now products from localStorage', e);
    return INITIAL_ORDER_NOW_PRODUCTS;
  }
}

export function getOrderNowProduct(idOrSlug: string): OrderNowProduct | undefined {
  const products = getOrderNowProducts();
  return products.find(
    (p) =>
      p.id === idOrSlug ||
      p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === idOrSlug.toLowerCase() ||
      p.id.toLowerCase().includes(idOrSlug.toLowerCase())
  );
}

export function saveOrderNowProduct(product: OrderNowProduct): OrderNowProduct[] {
  if (typeof window === 'undefined') return [product];

  try {
    const current = getOrderNowProducts();
    const filtered = current.filter((p) => p.id !== product.id);
    const updated = [product, ...filtered];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    window.dispatchEvent(new Event('kijij_order_now_products_updated'));
    window.dispatchEvent(new Event('kijij_order_products_updated'));
    return updated;
  } catch (e) {
    console.error('Failed to save Order Now product to localStorage', e);
    return [product];
  }
}

export function updateOrderNowProduct(id: string, updates: Partial<OrderNowProduct>): OrderNowProduct[] {
  if (typeof window === 'undefined') return [];

  try {
    const current = getOrderNowProducts();
    const updated = current.map((p) => (p.id === id ? { ...p, ...updates } : p));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    window.dispatchEvent(new Event('kijij_order_now_products_updated'));
    window.dispatchEvent(new Event('kijij_order_products_updated'));
    return updated;
  } catch (e) {
    console.error('Failed to update Order Now product', e);
    return [];
  }
}

export function deleteOrderNowProduct(id: string): OrderNowProduct[] {
  if (typeof window === 'undefined') return [];

  try {
    const current = getOrderNowProducts();
    const updated = current.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    window.dispatchEvent(new Event('kijij_order_now_products_updated'));
    window.dispatchEvent(new Event('kijij_order_products_updated'));
    return updated;
  } catch (e) {
    console.error('Failed to delete Order Now product', e);
    return [];
  }
}
