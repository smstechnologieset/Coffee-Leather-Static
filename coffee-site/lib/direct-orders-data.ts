/**
 * coffee-site/lib/direct-orders-data.ts
 *
 * Store for direct retail customer orders placed via "Order Now".
 * Manages customer order records, fulfillment statuses, and administrative actions.
 * Integrates with Supabase 'orders' table (site_source = 'coffee') with localStorage caching.
 */

import { createClient } from './supabase';

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
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
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

/** Asynchronously fetch live coffee orders from Supabase */
export async function fetchDirectOrdersFromDb(): Promise<DirectOrder[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('site_source', 'coffee')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return getDirectOrders();
    }

    const mapped: DirectOrder[] = data.map((row: any) => {
      const firstItem = Array.isArray(row.items) && row.items.length > 0 ? row.items[0] : {};
      const addr = row.shipping_address || {};

      let statusMap: DirectOrder['status'] = 'Paid / Processing';
      if (row.fulfillment_status === 'shipped') statusMap = 'Shipped';
      else if (row.fulfillment_status === 'delivered') statusMap = 'Delivered';
      else if (row.fulfillment_status === 'cancelled') statusMap = 'Cancelled';

      return {
        id: row.id,
        productId: firstItem.product_id || 'coffee-lot',
        productName: firstItem.product_name || 'Ethiopian Specialty Coffee',
        quantity: Number(firstItem.quantity) || 1,
        packageLabel: firstItem.package_label || 'Standard Pack',
        unitPrice: Number(firstItem.unit_price) || Number(row.subtotal) || 28,
        totalAmount: Number(row.total_amount) || 28,
        customerName: row.customer_name || 'Customer',
        customerEmail: row.customer_email || '',
        customerPhone: row.customer_phone || '',
        shippingAddress: {
          street: addr.street || addr.line1 || 'Address on file',
          city: addr.city || '',
          state: addr.state || '',
          country: addr.country || 'International',
          postalCode: addr.postalCode || addr.postal_code || '',
        },
        deliveryNotes: row.delivery_notes || undefined,
        status: statusMap,
        paymentStatus: row.payment_status || 'paid',
        stripeTransactionId: row.stripe_payment_intent_id || row.stripe_session_id || 'paid_verified',
        carrier: row.carrier || undefined,
        trackingNumber: row.tracking_number || undefined,
        createdAt: row.created_at || new Date().toISOString(),
      };
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
      window.dispatchEvent(new Event('kijij_direct_orders_updated'));
    }

    return mapped;
  } catch (err) {
    console.warn('Failed to fetch orders from Supabase:', err);
    return getDirectOrders();
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

    // Also persist to Supabase in background
    try {
      const supabase = createClient();
      supabase
        .from('orders')
        .insert({
          id: fullOrder.id,
          order_number: `ORD-COF-${Date.now().toString().slice(-6).toUpperCase()}`,
          site_source: 'coffee',
          customer_name: fullOrder.customerName,
          customer_email: fullOrder.customerEmail,
          customer_phone: fullOrder.customerPhone,
          shipping_address: fullOrder.shippingAddress,
          items: [
            {
              product_id: fullOrder.productId,
              product_name: fullOrder.productName,
              quantity: fullOrder.quantity,
              unit_price: fullOrder.unitPrice,
              package_label: fullOrder.packageLabel,
            },
          ],
          subtotal: fullOrder.totalAmount,
          total_amount: fullOrder.totalAmount,
          payment_status: fullOrder.paymentStatus,
          fulfillment_status: fullOrder.status === 'Shipped' ? 'shipped' : 'processing',
          stripe_payment_intent_id: fullOrder.stripeTransactionId,
        })
        .then(({ error }: any) => {
          if (error) console.warn('Supabase order insert warning:', error.message);
        });
    } catch (dbErr) {
      console.warn('Could not sync order to Supabase:', dbErr);
    }

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

    // Sync status change to Supabase
    try {
      const supabase = createClient();
      let dbFulfillment = 'processing';
      if (status === 'Shipped') dbFulfillment = 'shipped';
      else if (status === 'Delivered') dbFulfillment = 'delivered';
      else if (status === 'Cancelled') dbFulfillment = 'cancelled';

      supabase
        .from('orders')
        .update({
          fulfillment_status: dbFulfillment,
          tracking_number: trackingNumber || null,
          carrier: carrier || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .then(({ error }: any) => {
          if (error) console.warn('Supabase order status update error:', error.message);
        });
    } catch (dbErr) {
      console.warn('Could not sync status update to Supabase:', dbErr);
    }

    return updatedOrder;
  } catch (e) {
    console.error('Failed to update direct order status', e);
    return undefined;
  }
}
