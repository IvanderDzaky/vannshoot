import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Route } from 'next';
import { photos } from '../../_data';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = photos.find((p) => p.id === id);
  if (!item) return { title: 'Photo Not Found' };

  return {
    title: `${item.title} - Vannshoot Photography`,
    description:
      item.details || 'Cinematic lighting, architecture, and professional color grading.',
  };
}

export default async function PhotoDetailPage({ params }: Props) {
  const { id } = await params;
  const item = photos.find((p) => p.id === id);
  if (!item) notFound();

  return (
    <main className="min-h-screen bg-[#0b0f11] text-[#e0e2e6] py-24 px-6">
      <div className="mx-auto max-w-300 space-y-12">
        {/* Back Link */}
        <div>
          <Link
            href={'/portfolio/photography' as Route}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#fe7f2d] hover:underline"
          >
            ← Back to Photography
          </Link>
        </div>

        {/* Layout */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Main Visual */}
          <div className="relative group overflow-hidden rounded-[2.5rem] border border-white/10 aspect-video lg:aspect-4/3 text-center">
            <img
              src={item.image}
              alt={item.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <span className="inline-block rounded-full bg-[#fe7f2d]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#fe7f2d]">
                Photography
              </span>
              <h1 className="font-headline text-4xl font-bold leading-tight text-white md:text-5xl">
                {item.title}
              </h1>
            </div>

            {item.details && (
              <div className="rounded-2xl border border-white/5 bg-[#111419] p-6 text-sm leading-7 text-[#d8d7d4]">
                <h4 className="font-bold text-white mb-2 uppercase tracking-wider text-[11px]">
                  Details / Vision
                </h4>
                <p>{item.details}</p>
              </div>
            )}

            <div className="pt-4">
              <Link
                href={'/contact' as Route}
                className="inline-flex rounded-full bg-[#fe7f2d] px-10 py-4 text-sm font-bold uppercase tracking-[0.15em] text-[#331100] transition-transform duration-300 hover:scale-105"
              >
                Inquire Prints / Shoot
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
