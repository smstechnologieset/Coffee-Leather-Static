import Link from 'next/link';
import Image from 'next/image';
import { Calendar } from 'lucide-react';

// Static news preview (in production these come from Supabase)
const NEWS = [
  {
    id: '1',
    title: 'Record Harvest: Ethiopia\'s 2024/25 Coffee Season Exceeds Expectations',
    excerpt: 'Ethiopian coffee exports are set to reach record volumes this season, driven by favorable weather conditions and expanded farming initiatives across the southern highlands.',
    date: 'Sept 10, 2026',
    category: 'Market Update',
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400&q=80',
  },
  {
    id: '2',
    title: 'New Q-Grader Certifications Strengthen Our Quality Assurance Program',
    excerpt: 'Highland Roots now has three SCA-certified Q-Graders on staff, ensuring every lot meets international specialty standards before it leaves the warehouse.',
    date: 'Sept 3, 2026',
    category: 'Company News',
    image: 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=600&q=80',
  },
];

export default function NewsPreview() {
  return (
    <section className="py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-base text-primary-600 font-semibold tracking-widest uppercase mb-2">Latest Updates</h2>
            <p className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900">News & Insights</p>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-block border border-primary-700 text-primary-700 hover:bg-primary-700 hover:text-white px-5 py-2 rounded-full text-sm font-bold transition-all duration-200"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {NEWS.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl overflow-hidden shadow-brand hover:shadow-brand-lg group transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-primary-700 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-neutral-400 mb-3">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{post.date}</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-neutral-900 group-hover:text-primary-700 transition-colors leading-snug mb-2">
                  {post.title}
                </h3>
                <p className="text-sm text-neutral-500 line-clamp-2">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.id}`}
                  className="inline-block mt-4 text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="sm:hidden mt-8 text-center">
          <Link href="/blog" className="inline-block border border-primary-700 text-primary-700 px-6 py-2 rounded-full text-sm font-bold">View All News</Link>
        </div>
      </div>
    </section>
  );
}
