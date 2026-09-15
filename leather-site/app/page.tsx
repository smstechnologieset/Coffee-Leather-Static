import type { Metadata } from 'next';
import { SITE_CONFIG } from '@highland/shared/site-config';

export const metadata: Metadata = {
  title: `Leather Store — Coming Soon | ${SITE_CONFIG.companyName}`,
  description: 'Our leather goods collection is coming soon. Stay tuned.',
};

export default function LeatherComingSoonPage() {
  const mainSiteUrl = process.env.NEXT_PUBLIC_MAIN_SITE_URL ?? 'http://localhost:3000';

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-neutral-100 px-6">
      <div className="max-w-lg text-center space-y-6">
        {/* Brand header */}
        <p className="text-sm uppercase tracking-widest text-primary-400 font-medium">
          {SITE_CONFIG.companyName}
        </p>

        <h1 className="text-5xl font-serif font-bold">
          Leather Store
        </h1>

        <div className="w-16 h-px bg-primary-500 mx-auto" />

        <p className="text-neutral-400 text-lg leading-relaxed">
          We&apos;re crafting something exceptional. Our curated collection of
          premium leather goods will be available soon.
        </p>

        <p className="text-neutral-600 text-sm">
          — Coming Soon —
        </p>

        {/* Back to main site */}
        <a
          href={mainSiteUrl}
          className="inline-block mt-8 px-6 py-3 border border-primary-500 text-primary-400
                     hover:bg-primary-500 hover:text-white rounded-lg transition-colors duration-200
                     text-sm font-medium"
        >
          ← Back to {SITE_CONFIG.companyName}
        </a>
      </div>
    </main>
  );
}
