import type { FC } from 'react';
import { genPageMetadata } from '@/app/seo';
import { categories } from './_data';
import CategoryCard from './_components/CategoryCard';

export const metadata = genPageMetadata({
  title: 'Portfolio Categories',
  description: 'Explore Vannshoot creative portfolios including web development projects, photography, and creative contents.',
});

const PortfolioPage: FC = () => {
  return (
    <main className="min-h-screen bg-[#0b0f11] text-[#e0e2e6]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-28 px-6">
        <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-[#fe7f2d]/10 blur-[120px]" />
        <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-[#afcade]/10 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-300 space-y-6 text-center">
          <span className="block text-[14px] uppercase tracking-[0.35em] text-[#fe7f2d] font-label">
            Portfolio Hub
          </span>
          <h1 className="mx-auto max-w-4xl text-3xl md:text-5xl lg:text-[56px] font-bold leading-tight text-white font-headline">
            Selected Works &amp; creative projects
            <span className="text-[#fe7f2d] italic"> with cinematic impact</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-7 text-[#c8c7c4] md:text-lg">
            A curated collection of digital architecture and visual art, bridging the gap between
            functional performance and cinematic aesthetic.
          </p>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-300">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 border-t border-white/5 bg-[#111419]/30">
        <div className="mx-auto max-w-200 rounded-[2.5rem] border border-[#2a3036] bg-[#111419] p-12 text-center shadow-[0_40px_120px_rgba(0,0,0,0.25)]">
          <h2 className="mb-6 text-3xl md:text-5xl font-bold leading-tight text-white font-headline">
            Ready to start a project?
          </h2>
          <p className="mb-10 text-base leading-7 text-[#c8c7c4]">
            Let&apos;s collaborate to build something that stands out from the noise.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button className="w-full rounded-full bg-[#fe7f2d] px-10 py-4 text-sm font-bold uppercase tracking-[0.15em] text-[#331100] transition-transform duration-300 hover:scale-105 sm:w-auto">
              Send a Message
            </button>
            <button className="w-full rounded-full border border-[#4b525a] bg-transparent px-10 py-4 text-sm font-bold uppercase tracking-[0.15em] text-[#e0e2e6] transition-colors duration-300 hover:bg-[#1f262c] sm:w-auto">
              Download Resume
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PortfolioPage;
