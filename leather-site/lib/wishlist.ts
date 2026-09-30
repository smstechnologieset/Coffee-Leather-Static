// lib/wishlist.ts
// Per-user wishlist stored in localStorage, keyed by Supabase user ID.
// Dispatches 'kijij_wishlist_updated' when changed.

const key = (userId: string) => `kijij_leather_wishlist_${userId}`;

export function getWishlist(userId: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function toggleWishlist(userId: string, productId: string): boolean {
  const list = getWishlist(userId);
  const exists = list.includes(productId);
  const next = exists ? list.filter((id) => id !== productId) : [...list, productId];
  localStorage.setItem(key(userId), JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('kijij_wishlist_updated', { detail: next }));
  return !exists; // returns true if added, false if removed
}

export function isWishlisted(userId: string, productId: string): boolean {
  return getWishlist(userId).includes(productId);
}

export function clearWishlist(userId: string): void {
  localStorage.removeItem(key(userId));
  window.dispatchEvent(new CustomEvent('kijij_wishlist_updated', { detail: [] }));
}
