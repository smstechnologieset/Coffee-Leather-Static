import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '@highland/shared/site-config';
import { NEWS_POSTS } from '@/lib/mock-content';

export const metadata: Metadata = {
  title: 'News & Updates',
  description: `The latest news, updates, and announcements from ${SITE_CONFIG.companyName}.`,
};

export default function NewsPage() {
  return (
    <main className="flex flex-col">

      {/* ── Page hero ──────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 bg-neutral-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <p className="text-primary-400 text-sm uppercase tracking-widest font-semibold">
            News & Updates
          </p>
          <h1 className="text-5xl font-serif font-bold text-white">
            From the Highland Roots Team
          </h1>
          <p className="text-neutral-300 text-xl leading-relaxed">
            Partnerships, harvest outlooks, events, and company announcements.
          </p>
          <p className="text-neutral-500 text-sm">
            ⚠️ All posts below are mock content — see MOCK_DATA.md
          </p>
        </div>
      </section>

      {/* ── News grid ──────────────────────────────────────────────────────── */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Featured post (first) */}
          {NEWS_POSTS[0] && (
            <article className="group mb-12 grid grid-cols-1 lg:grid-cols-2 rounded-3xl
                                overflow-hidden shadow-brand bg-white">
              <div className="relative h-64 lg:h-auto overflow-hidden">
                <Image
                  src={NEWS_POSTS[0].image}
                  alt={`${NEWS_POSTS[0].title} — placeholder image`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                  unoptimized
                />
                <span className="absolute top-4 left-4 px-3 py-1 bg-primary-500 text-white
                                 text-xs font-semibold rounded-full">
                  {NEWS_POSTS[0].category}
                </span>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center space-y-4">
                <p className="text-neutral-400 text-sm font-medium">
                  {new Date(NEWS_POSTS[0].date).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })} · {NEWS_POSTS[0].author}
                </p>
                <h2 className="text-3xl font-serif font-bold text-neutral-900
                               group-hover:text-primary-600 transition-colors leading-tight">
                  {NEWS_POSTS[0].title}
                </h2>
                <p className="text-neutral-500 leading-relaxed">{NEWS_POSTS[0].excerpt}</p>
                {NEWS_POSTS[0].body.map((para, i) => (
                  <p key={i} className="text-neutral-600 text-sm leading-relaxed">{para}</p>
                ))}
              </div>
            </article>
          )}

          {/* Remaining posts grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {NEWS_POSTS.slice(1).map((post) => (
              <article
                key={post.slug}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm
                           border border-neutral-100 hover:shadow-brand transition-shadow duration-300
                           flex flex-col"
              >
                <div className="relative h-48 overflow-hidden flex-shrink-0">
                  <Image
                    src={post.image}
                    alt={`${post.title} — placeholder image`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <span className="absolute top-3 left-3 px-2 py-1 bg-primary-500 text-white
                                   text-xs font-semibold rounded-full">
                    {post.category}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1 space-y-3">
                  <p className="text-neutral-400 text-xs font-medium">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                  <h3 className="text-xl font-serif font-semibold text-neutral-900
                                 group-hover:text-primary-600 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-neutral-500 text-sm leading-relaxed flex-1">{post.excerpt}</p>
                  <div className="space-y-2 pt-2">
                    {post.body.map((para, i) => (
                      <p key={i} className="text-neutral-600 text-xs leading-relaxed">{para}</p>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

    </main>
  );
}
