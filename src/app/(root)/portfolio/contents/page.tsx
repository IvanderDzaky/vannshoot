import type { FC } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { genPageMetadata } from '@/app/seo';
import { contents } from '../_data';
import ContentGridItem from '../_components/ContentGridItem';

export const metadata = genPageMetadata({
  title: 'Contents Portfolio',
  description: 'Digital production, video content, campaigns, and short films by Vannshoot.',
});

const ContentsPage: FC = () => {
  return (
    <main className="min-h-screen bg-[#0b0f11] text-[#e0e2e6] py-24 px-6">
      <div className="mx-auto max-w-300 space-y-12">
        {/* Header / Navigation */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-white/5 pb-8">
          <div className="space-y-4">
            <Link
              href={'/portfolio' as Route}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#ffb68f] hover:underline"
            >
              ← Back to Hub
            </Link>
            <span className="block text-sm uppercase tracking-[0.28em] text-[#ffb68f] font-label mt-2">
              Creative Production
            </span>
            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl font-headline">
              Creative Contents
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[#c8c7c4] md:text-base">
            Crafting engaging content, short-form storytelling videos, vlogs, and cinematic creative campaigns.
          </p>
        </div>

        {/* Contents Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {contents.map((item) => (
            <ContentGridItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default ContentsPage;
