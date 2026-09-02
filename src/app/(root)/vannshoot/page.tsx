import type { FC } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { Camera, ArrowRight, ShieldCheck, Sparkles, Image as ImageIcon } from 'lucide-react';
import { genPageMetadata } from '@/app/seo';
import { getAllPublicPortfolios, getPublicPortfolioCategories } from '@/services/public';
import { VannShootCatalogFilter } from './_components/VannShootCatalogFilter';
import type { CatalogPortfolioItem } from './_components/VannShootCatalogCard';

export const metadata = genPageMetadata({
  title: 'VannShoot - Katalog & Penjualan Foto Sinematik',
  description:
    'Jelajahi koleksi galeri dan lisensi karya foto profesional dari VannShoot. Temukan karya foto sinematik terbaik untuk kebutuhan Anda.',
});

interface Props {
  searchParams: Promise<{ category?: string; search?: string }>;
}

const VannShootPage: FC<Props> = async ({ searchParams }) => {
  const params = await searchParams;
  const rawPortfolios = await getAllPublicPortfolios(params.category);
  const categories = await getPublicPortfolioCategories();

  const portfolios: CatalogPortfolioItem[] = rawPortfolios.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    cover: item.cover,
    images: item.images,
    city: item.city,
    location: item.location,
    price: item.price,
    categories: item.categories.map((c) => ({ id: c.id, title: c.title })),
  }));

  return (
    <main className="min-h-screen bg-[#0b0f11] text-[#e0e2e6] relative overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute -top-32 -left-32 h-120 w-120 rounded-full bg-[#fe7f2d]/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-32 h-120 w-120 rounded-full bg-[#afcade]/10 blur-[140px] pointer-events-none" />

      {/* Hero Header */}
      <section className="relative pt-28 pb-16 px-6 border-b border-white/5">
        <div className="mx-auto max-w-300 space-y-8 text-center">
          <h1 className="mx-auto max-w-4xl text-4xl sm:text-5xl lg:text-[58px] font-bold leading-tight text-white font-headline">
            Koleksi Visual Sinematik & Karya Foto Eksklusif
          </h1>

          <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#c8c7c4] md:text-lg">
            Temukan dan miliki hasil fotografi sinematik resolusi tinggi. CMS terintegrasi untuk
            katalog karya foto profesional studio VannShoot.
          </p>

          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mx-auto max-w-3xl pt-4">
            <div className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[#111419] p-4 text-xs text-[#c8c7c4]">
              <Camera className="h-5 w-5 text-[#fe7f2d]" />
              <span>Resolusi Tinggi WebP/Original</span>
            </div>
            <div className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[#111419] p-4 text-xs text-[#c8c7c4]">
              <ShieldCheck className="h-5 w-5 text-[#fe7f2d]" />
              <span>Transaksi Langsung & Aman</span>
            </div>
            <div className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[#111419] p-4 text-xs text-[#c8c7c4]">
              <ImageIcon className="h-5 w-5 text-[#fe7f2d]" />
              <span>Lisensi Karya Terjamin</span>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog & Filter Section */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-300">
          <VannShootCatalogFilter portfolios={portfolios} categories={categories} />
        </div>
      </section>

      {/* Footer Banner */}
      <section className="pb-24 px-6">
        <div className="mx-auto max-w-300">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#111419] p-8 sm:p-12 text-center space-y-6">
            <div className="absolute inset-0 bg-[#fe7f2d]/5 opacity-60" />
            <div className="relative z-10 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-headline">
                Butuh Sesi Fotografi Khusus atau Penawaran Paket?
              </h2>
              <p className="mx-auto max-w-xl text-sm text-[#c8c7c4] leading-relaxed">
                Selain membeli lisensi foto katalog, VannShoot menerima pemesanan sesi fotografi
                outdoor, graduation, komersial, maupun event.
              </p>
              <div className="pt-2">
                <Link
                  href={'/contact' as Route}
                  className="inline-flex items-center gap-2 rounded-full bg-[#fe7f2d] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-[#331100] transition-transform duration-300 hover:scale-105"
                >
                  <span>Konsultasi Pemesanan</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default VannShootPage;
