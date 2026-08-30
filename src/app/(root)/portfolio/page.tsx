import type { FC } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { ArrowRight } from 'lucide-react';
import { genPageMetadata } from '@/app/seo';
import { categories } from './_data';
import CategoryCard from './_components/CategoryCard';

export const metadata = genPageMetadata({
  title: 'Portfolio Categories',
  description:
    'Explore Vannshoot creative portfolios including web development projects, photography, and creative contents.',
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
            Portfolio
          </span>
          <h1 className="mx-auto max-w-4xl text-3xl md:text-5xl lg:text-[56px] font-bold leading-tight text-white font-headline">
            Karya & Proyek Kreatif Pilihan
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-7 text-[#c8c7c4] md:text-lg">
            Kumpulan karya terpilih yang memadukan pengembangan digital, kreativitas, dan visual
            untuk menghasilkan pengalaman yang fungsional sekaligus menarik.
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
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-330 px-6">
          <div className="glass-panel relative overflow-hidden rounded-3xl border border-white/10 p-6 sm:p-8 md:p-12">
            <div className="absolute inset-0 bg-linear-to-br from-[#fe7f2d]/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative z-10 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-white font-headline">
                Siap Memulai Proyek?
              </h2>
              <p className="mx-auto mt-4 mb-8 max-w-2xl text-sm md:text-base leading-relaxed text-[#c8c7c4]">
                Mari berkolaborasi untuk membangun sesuatu yang luar biasa dan menonjol.
              </p>
              <Link
                href={'/contact' as Route}
                className="inline-flex items-center gap-2 rounded-full bg-[#fe7f2d] px-10 py-4 text-sm font-bold uppercase tracking-[0.15em] text-[#331100] transition-transform duration-300 hover:scale-105 active:scale-95"
              >
                <span>Hubungi Saya</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PortfolioPage;
