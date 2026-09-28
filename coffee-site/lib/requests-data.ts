/**
 * coffee-site/lib/requests-data.ts
 *
 * Centralized persistent store for Sample and Contract requests.
 * Persists to localStorage and syncs with Supabase user profile.
 */

export interface UserRequest {
  id: string;
  type: 'sample' | 'contract';
  productId: string;
  productName: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  country: string;
  // Sample specific
  sampleSize?: string;
  samplePrice?: number;
  isFree?: boolean;
  deliveryMethod?: string;
  // Contract specific
  quantityQuintals?: number;
  quantityKg?: number;
  pricePerQuintal?: number;
  totalValue?: number;
  depositAmount?: number;
  paymentOption?: 'deposit' | 'full';
  deliveryWindow?: string;
  // Common
  status: string;
  paymentStatus: string;
  stripeTransactionId?: string | null;
  notes?: string;
  createdAt: string;
}

const STORAGE_KEY = 'kijij_coffee_user_requests';

// Default starter requests for demo view if user has no requests yet
export const DEFAULT_REQUESTS: UserRequest[] = [
  {
    id: 'ct_recent_harar_1',
    type: 'contract',
    productId: '3',
    productName: 'Harar Longberry Natural',
    companyName: 'test',
    contactName: 'test',
    email: 'admin@mixed.com',
    phone: '+1 (850) 264-5268',
    address: '121 Gladys Lane',
    city: 'Saluda',
    country: 'United States',
    quantityQuintals: 5,
    quantityKg: 500,
    pricePerQuintal: 460,
    totalValue: 2300,
    depositAmount: 250,
    paymentOption: 'deposit',
    deliveryWindow: '60 days',
    status: 'Deposit Secured (5%)',
    paymentStatus: 'deposit_secured',
    stripeTransactionId: 'cs_test_a1WOVoBZxLJXf45zYDAPl3OfjNYa9zTPbbA4xnOb',
    notes: 'Initial commercial contract allocation. 5% booking deposit confirmed via Stripe test mode.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'req_sample_demo_1',
    type: 'sample',
    productId: '1',
    productName: 'Yirgacheffe Grade 1 Washed',
    companyName: 'Nordic Roasters AB',
    contactName: 'Erik Johansson',
    email: 'erik@nordicr.se',
    phone: '+46 8 123 4567',
    address: 'Sveavägen 44',
    city: 'Stockholm',
    country: 'Sweden',
    sampleSize: '500g',
    samplePrice: 0,
    isFree: true,
    deliveryMethod: 'DHL Express',
    status: 'Shipped',
    paymentStatus: 'complimentary',
    stripeTransactionId: null,
    notes: 'Please include cupping notes and moisture content reading.',
    createdAt: '2026-09-12T10:30:00.000Z',
  },
  {
    id: 'req_contract_demo_2',
    type: 'contract',
    productId: '5',
    productName: 'Guji Zone Natural G1',
    companyName: 'Blue Bottle Coffee',
    contactName: 'Sara Lee',
    email: 'sara@bluebottle.com',
    phone: '+1 (510) 653-3394',
    address: '300 Webster St',
    city: 'Oakland, CA',
    country: 'United States',
    quantityQuintals: 10,
    quantityKg: 1000,
    pricePerQuintal: 490,
    totalValue: 4900,
    depositAmount: 250,
    paymentOption: 'deposit',
    deliveryWindow: '60 days',
    status: 'Deposit Secured (5%)',
    paymentStatus: 'deposit_secured',
    stripeTransactionId: 'cs_test_demo_guji_contract',
    notes: 'FOB Djibouti staging required. GrainPro packaging requested.',
    createdAt: '2026-09-14T14:15:00.000Z',
  },
];

export function getStoredUserRequests(userEmail?: string): UserRequest[] {
  if (typeof window === 'undefined') return DEFAULT_REQUESTS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Initialize with demo requests
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_REQUESTS));
      return DEFAULT_REQUESTS;
    }
    const parsed: UserRequest[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_REQUESTS;
    }
    // If userEmail is provided, we can either return all or prioritize user's email
    return parsed;
  } catch (e) {
    console.error('Failed to read user requests from localStorage', e);
    return DEFAULT_REQUESTS;
  }
}

export function saveUserRequest(request: UserRequest): UserRequest[] {
  if (typeof window === 'undefined') return [request];

  try {
    const current = getStoredUserRequests();
    // Prepend new request, avoid duplicate IDs
    const filtered = current.filter((r) => r.id !== request.id);
    const updated = [request, ...filtered];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save user request to localStorage', e);
    return [request];
  }
}

export function updateUserRequest(id: string, updates: Partial<UserRequest>): UserRequest[] {
  if (typeof window === 'undefined') return [];

  try {
    const current = getStoredUserRequests();
    const updated = current.map((r) => (r.id === id ? { ...r, ...updates } : r));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to update user request', e);
    return [];
  }
}
