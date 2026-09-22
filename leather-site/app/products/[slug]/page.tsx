import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LEATHER_PRODUCTS } from '@/lib/leather-data';
import AddToCartForm from '@/components/AddToCartForm';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = LEATHER_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/products" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Catalog
        </Link>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
          {/* Images */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-100">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-2 gap-4">
                {product.images.slice(1).map((img, i) => (
                  <div key={i} className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-100">
                    <Image src={img} alt={`${product.name} view ${i + 2}`} fill className="object-cover" unoptimized />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="mt-10 px-4 sm:px-0 lg:mt-0">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-neutral-900 mb-2">
              {product.name}
            </h1>
            <p className="text-2xl text-neutral-900 mb-6">${product.price.toFixed(2)}</p>

            <div className="prose prose-sm text-neutral-600 mb-8">
              <p>{product.description}</p>
            </div>

            <AddToCartForm product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
