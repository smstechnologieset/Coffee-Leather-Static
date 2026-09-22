import type { Metadata } from 'next';
import Image from 'next/image';
import { SITE_CONFIG } from '@highland/shared/site-config';
import { NEWS_POSTS } from '@/lib/mock-content';

export const metadata: Metadata = {
  title: 'News & Trade Dispatches',
  description: `The latest trade partnerships, harvest reports, and announcements from ${SITE_CONFIG.companyName}.`,
};

export default function NewsPage() {
  const leadPost = NEWS_POSTS[0];
  const secondaryPosts = NEWS_POSTS.slice(1);

  return (
    <main className="flex flex-col bg-white">

      {/* ── 1. Page Header ──────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 bg-neutral-950 text-white relative overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=85"
            alt="International maritime trade and cargo shipping"
            fill
            className="object-cover opacity-15 filter brightness-75"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary-500/30 bg-primary-950/60 rounded-xs">
              <span className="text-primary-300 text-xs uppercase tracking-[0.2em] font-medium">
                Trade Journal & Dispatches
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-serif font-normal text-white leading-tight tracking-tight">
              Announcements & Field Reports
            </h1>

            <p className="text-neutral-300 text-lg sm:text-xl font-light leading-relaxed">
              Updates on coffee harvest conditions, international trade agreements, export logistics, and organizational milestones from {SITE_CONFIG.companyName}.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. Editorial Journal Layout ──────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

          {/* Lead Featured Article */}
          {leadPost && (
            <article className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pb-16 border-b border-neutral-200">
              <div className="lg:col-span-7 relative min-h-[380px] lg:min-h-[480px] rounded-xs overflow-hidden border border-neutral-200 shadow-lift">
                <Image
                  src={leadPost.image}
                  alt={leadPost.title}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-neutral-950 text-white text-xs uppercase tracking-wider font-semibold rounded-xs">
                  {leadPost.category}
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                    {new Date(leadPost.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}{' '}
                    · {leadPost.author}
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-serif font-normal text-neutral-950 leading-tight">
                    {leadPost.title}
                  </h2>
                </div>

                <p className="text-neutral-700 text-base leading-relaxed font-normal">
                  {leadPost.excerpt}
                </p>

                <div className="space-y-4 pt-2 border-t border-neutral-100 text-neutral-600 text-sm leading-relaxed font-light">
                  {leadPost.body.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            </article>
          )}

          {/* Secondary Articles Section */}
          <div className="space-y-12">
            <div className="border-b border-neutral-200 pb-4">
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-400">
                Recent Dispatches & Harvest Bulletins
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {secondaryPosts.map((post) => (
                <article key={post.slug} className="space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="relative aspect-[16/10] rounded-xs overflow-hidden border border-neutral-200">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute top-3 left-3 px-2 py-0.5 bg-neutral-950 text-white text-[10px] uppercase tracking-wider font-semibold rounded-xs">
                        {post.category}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <h4 className="text-xl font-serif font-normal text-neutral-950 leading-snug">
                        {post.title}
                      </h4>
                      <p className="text-neutral-600 text-sm leading-relaxed font-light line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 text-xs text-neutral-500 font-light space-y-2">
                    {post.body.map((para, i) => (
                      <p key={i} className="line-clamp-2 leading-relaxed">{para}</p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}
