export interface LeatherProduct {
  id: string;
  slug: string;
  name: string;
  category: 'Bags' | 'Jackets' | 'Accessories';
  price: number;
  description: string;
  features: string[];
  images: string[];
  colors: string[];
  sizes?: string[]; // relevant for jackets
  inStock: boolean;
}

export const LEATHER_PRODUCTS: LeatherProduct[] = [
  {
    id: '1',
    slug: 'highland-weekender-duffle',
    name: 'Highland Weekender Duffle',
    category: 'Bags',
    price: 350.00,
    description: 'A timeless travel companion crafted from full-grain Ethiopian leather. The Highland Weekender features a spacious interior, solid brass hardware, and a reinforced base. Perfect for a 3-day getaway.',
    features: [
      '100% Full-grain Ethiopian leather',
      'Solid brass hardware',
      'Adjustable and removable shoulder strap',
      'Internal zip pocket for valuables',
      'Airline carry-on approved dimensions'
    ],
    images: [
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80'
    ],
    colors: ['Cognac', 'Espresso', 'Midnight Black'],
    inStock: true
  },
  {
    id: '2',
    slug: 'addis-classic-biker-jacket',
    name: 'Addis Classic Biker Jacket',
    category: 'Jackets',
    price: 450.00,
    description: 'Channeling a vintage aesthetic with modern tailoring, the Addis Classic is made from incredibly supple sheepskin leather sourced from the Ethiopian highlands. It breaks in beautifully over time.',
    features: [
      'Premium Ethiopian sheepskin leather',
      'Asymmetrical zip closure',
      'Quilted shoulder detailing',
      'Satin-twill lining',
      'Multiple zip pockets'
    ],
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
      'https://images.unsplash.com/photo-1520975954732-57dd22299614?w=800&q=80'
    ],
    colors: ['Black', 'Distressed Brown'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true
  },
  {
    id: '3',
    slug: 'rift-valley-messenger-bag',
    name: 'Rift Valley Messenger Bag',
    category: 'Bags',
    price: 220.00,
    description: 'Designed for the modern professional. The Rift Valley Messenger comfortably fits a 15-inch laptop and your daily essentials, all protected by a robust leather flap and secure magnetic closures.',
    features: [
      'Vegetable-tanned leather',
      'Padded laptop sleeve (fits 15")',
      'Adjustable crossbody strap',
      'Quick-access back slip pocket'
    ],
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80'
    ],
    colors: ['Vintage Brown'],
    inStock: true
  },
  {
    id: '4',
    slug: 'lalibela-cardholder',
    name: 'Lalibela Minimalist Cardholder',
    category: 'Accessories',
    price: 45.00,
    description: 'Sleek, simple, and essential. The Lalibela cardholder carries up to 6 cards and folded cash without adding bulk to your pocket.',
    features: [
      'Top-grain leather',
      '4 card slots + 1 center pocket',
      'Hand-stitched edges'
    ],
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80'
    ],
    colors: ['Cognac', 'Black', 'Olive'],
    inStock: true
  },
  {
    id: '5',
    slug: 'harar-braided-belt',
    name: 'Harar Braided Belt',
    category: 'Accessories',
    price: 65.00,
    description: 'A versatile braided leather belt that pairs effortlessly with denim or chinos. Finished with a brushed silver buckle.',
    features: [
      'Woven full-grain leather',
      'Brushed silver-tone buckle',
      '1.25" width'
    ],
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=80'
    ],
    colors: ['Tan', 'Chocolate'],
    sizes: ['32', '34', '36', '38'],
    inStock: true
  },
  {
    id: '6',
    slug: 'awash-leather-tote',
    name: 'Awash Leather Tote',
    category: 'Bags',
    price: 180.00,
    description: 'Your everyday carry-all. The Awash Tote features an unlined interior to showcase the raw beauty of the suede reverse, with reinforced handles that can handle the weight of your daily life.',
    features: [
      'Soft-tumbled leather',
      'Unlined suede interior',
      'Internal slip pocket for keys/phone',
      '9" handle drop'
    ],
    images: [
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80'
    ],
    colors: ['Saddle', 'Black'],
    inStock: true
  }
];
