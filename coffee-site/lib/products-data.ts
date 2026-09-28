export interface SampleTier {
  id: string;
  size: string;      // e.g., '250g', '500g', '1kg', '2kg'
  price: number;     // 0 for Free, or positive USD amount
  isFree: boolean;
}

export interface CoffeeProduct {
  id: string;
  name: string;
  category?: string;
  region: string;
  process: 'Washed' | 'Natural' | 'Honey' | string;
  grade: string;
  pricePerQuintal: number;  // 1 Quintal = 100 kg
  pricePerKg: number;       // derived (pricePerQuintal / 100)
  currentPrice: number;     // for catalog display (equals pricePerQuintal)
  previousPrice: number;
  unit: string;             // '/Quintal'
  minOrderQuintals: number;  // e.g. 10 Quintals = 1,000 kg
  minOrderKg: number;
  minOrder?: string;
  image: string;
  availability: 'In Stock' | 'Limited' | 'Out of Stock' | string;
  isTopProduct?: boolean;
  sampleTiers: SampleTier[];
  owner?: string;
  profile?: string;
  altitude?: string;
  harvest?: string;
  priceHistory?: { date: string; price: number }[];
}

export const DEFAULT_SAMPLE_TIERS: SampleTier[] = [
  { id: 'st-250g', size: '250g', price: 0, isFree: true },
  { id: 'st-500g', size: '500g', price: 0, isFree: true },
  { id: 'st-1kg', size: '1kg', price: 15, isFree: false },
  { id: 'st-2kg', size: '2kg', price: 25, isFree: false },
];

export const IMAGE_PRESETS = [
  {
    label: 'Washed Green Coffee Lot',
    url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80',
    description: 'Clean, dense washed green Arabica lot',
  },
  {
    label: 'Sun-Dried Natural Cherries',
    url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80',
    description: 'Raised African drying beds with natural cherries',
  },
  {
    label: 'Harar Golden Longberry',
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
    description: 'Distinctive wild heirloom beans and cherries',
  },
  {
    label: 'Limu Wet-Milled Specialty',
    url: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80',
    description: 'Forest-shaded highland washed harvest',
  },
  {
    label: 'Guji Zone Ripe Harvest',
    url: 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=600&q=80',
    description: 'Rich volcanic soil hand-picked cherries',
  },
  {
    label: 'Jimma Honey Process Lot',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80',
    description: 'Pulped natural mucilage drying lot',
  },
  {
    label: 'Roaster Evaluation Cupping',
    url: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=600&q=80',
    description: 'Specialty Q-grader inspection and cupping table',
  },
  {
    label: 'Ethiopian Highland Plantation',
    url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&q=80',
    description: 'High altitude heirloom coffee trees',
  },
];

export const INITIAL_COFFEES: Record<string, CoffeeProduct> = {
  '1': {
    id: '1',
    name: 'Yirgacheffe Grade 1 Washed',
    category: 'Washed',
    region: 'Yirgacheffe',
    process: 'Washed',
    grade: 'Grade 1',
    pricePerQuintal: 420,
    pricePerKg: 4.2,
    currentPrice: 420,
    previousPrice: 395,
    unit: '/Quintal',
    minOrderQuintals: 10,
    minOrderKg: 1000,
    minOrder: '10 Quintals (1,000 kg)',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80',
    availability: 'In Stock',
    isTopProduct: true,
    owner: 'Kochere Farmers Cooperative',
    profile: 'Jasmine, bergamot, lemon zest, clean finish',
    altitude: '1,800–2,200 masl',
    harvest: 'Oct–Dec',
    priceHistory: [
      { date: 'May', price: 370 },
      { date: 'Jun', price: 380 },
      { date: 'Jul', price: 375 },
      { date: 'Aug', price: 395 },
      { date: 'Sep', price: 420 },
    ],
    sampleTiers: [
      { id: 'st-250g', size: '250g', price: 0, isFree: true },
      { id: 'st-500g', size: '500g', price: 0, isFree: true },
      { id: 'st-1kg', size: '1kg', price: 15, isFree: false },
      { id: 'st-2kg', size: '2kg', price: 25, isFree: false },
    ],
  },
  '2': {
    id: '2',
    name: 'Sidamo Natural G1',
    category: 'Natural',
    region: 'Sidamo',
    process: 'Natural',
    grade: 'Grade 1',
    pricePerQuintal: 380,
    pricePerKg: 3.8,
    currentPrice: 380,
    previousPrice: 360,
    unit: '/Quintal',
    minOrderQuintals: 10,
    minOrderKg: 1000,
    minOrder: '10 Quintals (1,000 kg)',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80',
    availability: 'In Stock',
    isTopProduct: true,
    owner: 'Daye Bensa Cooperative',
    profile: 'Blueberry, red wine, dark chocolate',
    altitude: '1,700–2,000 masl',
    harvest: 'Nov–Jan',
    priceHistory: [
      { date: 'May', price: 340 },
      { date: 'Jun', price: 350 },
      { date: 'Jul', price: 360 },
      { date: 'Aug', price: 360 },
      { date: 'Sep', price: 380 },
    ],
    sampleTiers: [
      { id: 'st-250g', size: '250g', price: 0, isFree: true },
      { id: 'st-500g', size: '500g', price: 0, isFree: true },
      { id: 'st-1kg', size: '1kg', price: 12, isFree: false },
    ],
  },
  '3': {
    id: '3',
    name: 'Harar Longberry Natural',
    category: 'Natural',
    region: 'Harar',
    process: 'Natural',
    grade: 'Grade 1',
    pricePerQuintal: 460,
    pricePerKg: 4.6,
    currentPrice: 460,
    previousPrice: 440,
    unit: '/Quintal',
    minOrderQuintals: 5,
    minOrderKg: 500,
    minOrder: '5 Quintals (500 kg)',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
    availability: 'In Stock',
    isTopProduct: false,
    owner: 'Harar Coffee Farmers Union',
    profile: 'Mocha, dark fruit, cardamom spice',
    altitude: '1,500–2,100 masl',
    harvest: 'Oct–Jan',
    priceHistory: [
      { date: 'May', price: 410 },
      { date: 'Jun', price: 420 },
      { date: 'Jul', price: 430 },
      { date: 'Aug', price: 440 },
      { date: 'Sep', price: 460 },
    ],
    sampleTiers: [
      { id: 'st-250g', size: '250g', price: 0, isFree: true },
      { id: 'st-500g', size: '500g', price: 10, isFree: false },
      { id: 'st-1kg', size: '1kg', price: 18, isFree: false },
    ],
  },
  '4': {
    id: '4',
    name: 'Limu Washed G2',
    category: 'Washed',
    region: 'Limu',
    process: 'Washed',
    grade: 'Grade 2',
    pricePerQuintal: 340,
    pricePerKg: 3.4,
    currentPrice: 340,
    previousPrice: 350,
    unit: '/Quintal',
    minOrderQuintals: 10,
    minOrderKg: 1000,
    minOrder: '10 Quintals (1,000 kg)',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80',
    availability: 'Limited',
    isTopProduct: false,
    owner: 'Limu Producers Cooperative',
    profile: 'Brown sugar, orange peel, medium body',
    altitude: '1,400–1,800 masl',
    harvest: 'Nov–Feb',
    priceHistory: [
      { date: 'May', price: 360 },
      { date: 'Jun', price: 360 },
      { date: 'Jul', price: 350 },
      { date: 'Aug', price: 350 },
      { date: 'Sep', price: 340 },
    ],
    sampleTiers: [
      { id: 'st-250g', size: '250g', price: 0, isFree: true },
      { id: 'st-500g', size: '500g', price: 0, isFree: true },
      { id: 'st-1kg', size: '1kg', price: 12, isFree: false },
    ],
  },
  '5': {
    id: '5',
    name: 'Guji Zone Natural G1',
    category: 'Natural',
    region: 'Guji',
    process: 'Natural',
    grade: 'Grade 1',
    pricePerQuintal: 490,
    pricePerKg: 4.9,
    currentPrice: 490,
    previousPrice: 460,
    unit: '/Quintal',
    minOrderQuintals: 10,
    minOrderKg: 1000,
    minOrder: '10 Quintals (1,000 kg)',
    image: 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=600&q=80',
    availability: 'In Stock',
    isTopProduct: true,
    owner: 'Shakiso Farmers Cooperative',
    profile: 'Mango, pineapple, tropical punch',
    altitude: '1,900–2,300 masl',
    harvest: 'Oct–Dec',
    priceHistory: [
      { date: 'May', price: 420 },
      { date: 'Jun', price: 440 },
      { date: 'Jul', price: 450 },
      { date: 'Aug', price: 460 },
      { date: 'Sep', price: 490 },
    ],
    sampleTiers: [
      { id: 'st-250g', size: '250g', price: 0, isFree: true },
      { id: 'st-500g', size: '500g', price: 0, isFree: true },
      { id: 'st-1kg', size: '1kg', price: 18, isFree: false },
      { id: 'st-2kg', size: '2kg', price: 30, isFree: false },
    ],
  },
  '6': {
    id: '6',
    name: 'Jimma Honey Process',
    category: 'Honey',
    region: 'Jimma',
    process: 'Honey',
    grade: 'Grade 2',
    pricePerQuintal: 410,
    pricePerKg: 4.1,
    currentPrice: 410,
    previousPrice: 390,
    unit: '/Quintal',
    minOrderQuintals: 5,
    minOrderKg: 500,
    minOrder: '5 Quintals (500 kg)',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80',
    availability: 'In Stock',
    isTopProduct: false,
    owner: 'Gera Agro Forestry',
    profile: 'Honey, stone fruit, creamy mouthfeel',
    altitude: '1,500–1,900 masl',
    harvest: 'Nov–Jan',
    priceHistory: [
      { date: 'May', price: 370 },
      { date: 'Jun', price: 380 },
      { date: 'Jul', price: 390 },
      { date: 'Aug', price: 390 },
      { date: 'Sep', price: 410 },
    ],
    sampleTiers: [
      { id: 'st-250g', size: '250g', price: 0, isFree: true },
      { id: 'st-500g', size: '500g', price: 0, isFree: true },
      { id: 'st-1kg', size: '1kg', price: 15, isFree: false },
    ],
  },
};

const STORAGE_KEY = 'kijij_coffee_products_v2';

export function getStoredProducts(): CoffeeProduct[] {
  if (typeof window === 'undefined') {
    return Object.values(INITIAL_COFFEES);
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = Object.values(INITIAL_COFFEES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return Object.values(INITIAL_COFFEES);
  } catch (e) {
    console.error('Error reading coffee products from storage:', e);
    return Object.values(INITIAL_COFFEES);
  }
}

export function saveStoredProducts(products: CoffeeProduct[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new CustomEvent('kijij_products_updated', { detail: products }));
  } catch (e) {
    console.error('Error saving coffee products to storage:', e);
  }
}

export function getStoredProduct(id: string): CoffeeProduct | undefined {
  const all = getStoredProducts();
  return all.find((p) => p.id === id || String(p.id).toLowerCase() === String(id).toLowerCase());
}

export function upsertStoredProduct(data: Partial<CoffeeProduct> & { name: string }): CoffeeProduct {
  const products = getStoredProducts();
  const priceQuintal = Number(data.pricePerQuintal) || 400;
  const priceKg = Number((priceQuintal / 100).toFixed(2));
  const minQuintals = Number(data.minOrderQuintals) || 5;

  const resolvedImage = data.image?.trim() || IMAGE_PRESETS[0].url;

  if (data.id) {
    const existingIndex = products.findIndex((p) => p.id === data.id);
    if (existingIndex >= 0) {
      const updated: CoffeeProduct = {
        ...products[existingIndex],
        ...data,
        id: data.id,
        pricePerQuintal: priceQuintal,
        pricePerKg: priceKg,
        currentPrice: priceQuintal,
        unit: '/Quintal',
        minOrderQuintals: minQuintals,
        minOrderKg: minQuintals * 100,
        minOrder: `${minQuintals} Quintals (${(minQuintals * 100).toLocaleString()} kg)`,
        image: resolvedImage,
      };
      products[existingIndex] = updated;
      saveStoredProducts(products);
      return updated;
    }
  }

  // Create new product
  const newId = data.id || `p_${Date.now()}`;
  const newProduct: CoffeeProduct = {
    id: newId,
    name: data.name,
    category: data.category || (data.process as any) || 'Washed',
    region: data.region || 'Yirgacheffe',
    process: (data.process as any) || 'Washed',
    grade: data.grade || 'Grade 1',
    pricePerQuintal: priceQuintal,
    pricePerKg: priceKg,
    currentPrice: priceQuintal,
    previousPrice: priceQuintal,
    unit: '/Quintal',
    minOrderQuintals: minQuintals,
    minOrderKg: minQuintals * 100,
    minOrder: `${minQuintals} Quintals (${(minQuintals * 100).toLocaleString()} kg)`,
    image: resolvedImage,
    availability: (data.availability as any) || 'In Stock',
    isTopProduct: Boolean(data.isTopProduct),
    sampleTiers: data.sampleTiers && data.sampleTiers.length > 0 ? data.sampleTiers : DEFAULT_SAMPLE_TIERS,
    owner: data.owner || 'Highland Cooperative Union',
    profile: data.profile || 'Distinctive floral aroma, balanced acidity, rich finish',
    altitude: data.altitude || '1,750–2,200 masl',
    harvest: data.harvest || 'Oct–Jan',
    priceHistory: [
      { date: 'May', price: Math.round(priceQuintal * 0.92) },
      { date: 'Jun', price: Math.round(priceQuintal * 0.94) },
      { date: 'Jul', price: Math.round(priceQuintal * 0.96) },
      { date: 'Aug', price: Math.round(priceQuintal * 0.98) },
      { date: 'Sep', price: priceQuintal },
    ],
  };

  const nextProducts = [newProduct, ...products];
  saveStoredProducts(nextProducts);
  return newProduct;
}

export function deleteStoredProduct(id: string): void {
  const products = getStoredProducts();
  const nextProducts = products.filter((p) => p.id !== id);
  saveStoredProducts(nextProducts);
}
