/**
 * coffee-site/lib/direct-orders-data.ts
 *
 * Store for direct retail customer orders placed via "Order Now".
 * Manages customer order records, fulfillment statuses, and administrative actions.
 */

export interface DirectOrder {
  id: string;               // e.g. "ord_1727538000"
  productId: string;
  productName: string;
  quantity: number;
  packageLabel?: string;
  unitPrice: number;
  totalAmount: number;
  grindPreference?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state?: string;
    country: string;
    postalCode: string;
  };
  deliveryNotes?: string;
  status: 'Paid / Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'paid';
  stripeTransactionId: string;
  trackingNumber?: string;
  carrier?: string;
  createdAt: string;
}

const STORAGE_KEY = 'kijij_coffee_direct_orders';

export const INITIAL_DIRECT_ORDERS: DirectOrder[] = [
  {
    id: 'ord_1727531100',
    productId: 'onp-special-mixed-1kg',
    productName: 'Special Mixed',
    quantity: 2,
    packageLabel: '1kg Sealed Aroma-Valve Bag',
    unitPrice: 28,
    totalAmount: 56,
    customerName: 'Michael Berhanu',
    customerEmail: 'michael.berhanu@gmail.com',
    customerPhone: '+1 (202) 555-0143',
    shippingAddress: {
      street: '1420 K Street NW, Apt 4B',
      city: 'Washington',
      state: 'DC',
      country: 'United States',
      postalCode: '20005',
    },
    deliveryNotes: 'Please leave with concierge if unavailable.',
    status: 'Paid / Processing',
    paymentStatus: 'paid',
    stripeTransactionId: 'ch_test_3Pq9xK2eZvKYlo2C1g9Mixed',
    carrier: 'DHL Express',
    createdAt: '2026-09-27T16:20:00.000Z',
  },
  {
    id: 'ord_1727442800',
    productId: 'onp-special-mixed-500g',
    productName: 'Special Mixed (Compact Pack)',
    quantity: 3,
    packageLabel: '500g Degassing Pouch',
    unitPrice: 16,
    totalAmount: 48,
    grindPreference: 'Medium Ground (Filter/Drip)',
    customerName: 'Hanna Al-Mansoor',
    customerEmail: 'hanna.mansoor@dubaimedia.ae',
    customerPhone: '+971 50 123 4567',
    shippingAddress: {
      street: 'Al Barsha 1, Villa 12',
      city: 'Dubai',
      country: 'United Arab Emirates',
      postalCode: '00000',
    },
    status: 'Shipped',
    paymentStatus: 'paid',
    stripeTransactionId: 'ch_test_3Pq9xK2eZvKYlo2C1g9Hanna',
    carrier: 'Emirates Post / DHL',
    trackingNumber: 'DHL-ET-98421034',
    createdAt: '2026-09-26T11:45:00.000Z',
  },
];

export function getDirectOrders(): DirectOrder[] {
  if (typeof window === 'undefined') return INITIAL_DIRECT_ORDERS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DIRECT_ORDERS));
      return INITIAL_DIRECT_ORDERS;
    }
    const parsed: DirectOrder[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return INITIAL_DIRECT_ORDERS;
    }
    return parsed;
  } catch (e) {
    console.error('Failed to read direct orders from localStorage', e);
    return INITIAL_DIRECT_ORDERS;
  }
}

export function saveDirectOrder(
  order: Omit<DirectOrder, 'id' | 'createdAt'> & { id?: string; createdAt?: string }
): DirectOrder {
  const fullOrder: DirectOrder = {
    ...order,
    id: order.id || `ord_${Date.now().toString().slice(-8)}`,
    createdAt: order.createdAt || new Date().toISOString(),
  };

  if (typeof window === 'undefined') return fullOrder;

  try {
    const current = getDirectOrders();
    const filtered = current.filter((o) => o.id !== fullOrder.id);
    const updated = [fullOrder, ...filtered];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    window.dispatchEvent(new Event('kijij_direct_orders_updated'));
    return fullOrder;
  } catch (e) {
    console.error('Failed to save direct order', e);
    return fullOrder;
  }
}

export function updateDirectOrderStatus(
  id: string,
  status: DirectOrder['status'],
  trackingNumber?: string,
  carrier?: string
): DirectOrder | undefined {
  if (typeof window === 'undefined') return undefined;

  try {
    const current = getDirectOrders();
    let updatedOrder: DirectOrder | undefined;

    const updated = current.map((order) => {
      if (order.id === id) {
        updatedOrder = {
          ...order,
          status,
          ...(trackingNumber !== undefined && { trackingNumber }),
          ...(carrier !== undefined && { carrier }),
        };
        return updatedOrder;
      }
      return order;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('kijij_direct_orders_updated'));
    return updatedOrder;
  } catch (e) {
    console.error('Failed to update direct order status', e);
    return undefined;
  }
}
