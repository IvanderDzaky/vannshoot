import type { FC } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { genPageMetadata } from '@/app/seo';
import { photos } from '../_data';
import PhotoGridItem from '../_components/PhotoGridItem';

export const metadata = genPageMetadata({
  title: 'Photography Portfolio',
  description: 'Cinematic visual stories, shadows, and architectural long-exposure night photography.',
});

const PhotographyPage: FC = () => {
  return (
    <main className="min-h-screen bg-[#0b0f11] text-[#e0e2e6] py-24 px-6">
      <div className="mx-auto max-w-300 space-y-12">
        {/* Header / Navigation */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-white/5 pb-8">
          <div className="space-y-4">
            <Link
              href={'/portfolio' as Route}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#fe7f2d] hover:underline"
            >
              ← Back to Hub
            </Link>
            <span className="block text-sm uppercase tracking-[0.28em] text-[#fe7f2d] font-label mt-2">
              Cinematic Vision
            </span>
            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl font-headline">
              Photography Gallery
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[#c8c7c4] md:text-base">
            Exploring the beauty found in the intersection of shadows, modern architecture, cinematic lighting, and professional grading.
          </p>
        </div>

        {/* Photography Grid */}
        <div className="grid gap-6 md:grid-cols-2 auto-rows-fr">
          {photos.length > 0 ? (
            photos.map((photo) => (
              <PhotoGridItem key={photo.id} photo={photo} />
            ))
          ) : (
            <div className="col-span-2 text-center py-20 text-[#c8c7c4]">
              No photos yet
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default PhotographyPage;
