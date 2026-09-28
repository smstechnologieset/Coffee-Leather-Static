import { redirect } from 'next/navigation';

export default function OrderNowIndexPage() {
  // Default to the flagship "Special Mixed" packaged coffee
  redirect('/order-now/onp-special-mixed-1kg');
}
