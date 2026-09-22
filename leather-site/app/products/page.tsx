import Link from 'next/link';
import Image from 'next/image';
import { LEATHER_PRODUCTS } from '@/lib/leather-data';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  
  const products = category
    ? LEATHER_PRODUCTS.filter((p) => p.category === category)
    : LEATHER_PRODUCTS;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row items-baseline justify-between border-b border-neutral-200 pb-6 mb-8">
        <h1 className="text-4xl font-serif font-bold text-neutral-900 tracking-tight">
          {category ? `${category}` : 'All Products'}
        </h1>
        <div className="mt-4 md:mt-0 flex gap-4 text-sm font-medium text-neutral-500">
          <Link href="/products" className={`hover:text-neutral-900 ${!category ? 'text-neutral-900' : ''}`}>All</Link>
          <Link href="/products?category=Bags" className={`hover:text-neutral-900 ${category === 'Bags' ? 'text-neutral-900' : ''}`}>Bags</Link>
          <Link href="/products?category=Jackets" className={`hover:text-neutral-900 ${category === 'Jackets' ? 'text-neutral-900' : ''}`}>Jackets</Link>
          <Link href="/products?category=Accessories" className={`hover:text-neutral-900 ${category === 'Accessories' ? 'text-neutral-900' : ''}`}>Accessories</Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24 text-neutral-500">
          No products found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`} className="group block">
              <div className="relative h-96 w-full overflow-hidden bg-neutral-100 rounded-lg mb-4">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              </div>
              <h3 className="text-lg font-serif font-semibold text-neutral-900 mb-1">{product.name}</h3>
              <p className="text-neutral-500 text-sm mb-2">{product.colors.length} Color{product.colors.length > 1 ? 's' : ''}</p>
              <p className="text-neutral-900 font-medium">${product.price.toFixed(2)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
