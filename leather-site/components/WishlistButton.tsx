'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { isWishlisted, toggleWishlist } from '@/lib/wishlist';

export default function WishlistButton({
  productId,
  className = '',
}: {
  productId: string;
  className?: string;
}) {
  const [userId, setUserId] = useState<string | null>(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        setWishlisted(isWishlisted(data.user.id, productId));
      }
    });
  }, [productId]);

  // Stay in sync if another tab toggles
  useEffect(() => {
    const h = () => {
      if (userId) setWishlisted(isWishlisted(userId, productId));
    };
    window.addEventListener('kijij_wishlist_updated', h);
    return () => window.removeEventListener('kijij_wishlist_updated', h);
  }, [userId, productId]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) return;
    const added = toggleWishlist(userId, productId);
    setWishlisted(added);
    setPulse(true);
    setTimeout(() => setPulse(false), 400);
  };

  if (!userId) return null; // hide for guests

  return (
    <button
      onClick={handleToggle}
      aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`group transition-transform ${pulse ? 'scale-125' : 'scale-100'} ${className}`}
    >
      <Heart
        className={`h-5 w-5 transition-colors ${
          wishlisted
            ? 'fill-red-500 text-red-500'
            : 'fill-transparent text-neutral-400 group-hover:text-red-400'
        }`}
      />
    </button>
  );
}
