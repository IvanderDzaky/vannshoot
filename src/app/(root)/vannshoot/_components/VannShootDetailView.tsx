'use client';

import type { FC } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import {
  MapPin,
  Tag,
  ArrowLeft,
  ShoppingCart,
  CheckCircle2,
  Share2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from 'lucide-react';
import { VannShootOrderModal } from './VannShootOrderModal';

interface PortfolioDetailProps {
  portfolio: {
    id: string;
    title: string;
    description: string | null;
    cover: string | null;
    images: string[];
    city: string | null;
    location: string | null;
    price: number | null;
    categories: { id: string; title: string }[];
  };
  serviceFee?: number;
}

export const VannShootDetailView: FC<PortfolioDetailProps> = ({ portfolio, serviceFee = 0 }) => {
  const allImages =
    portfolio.images && portfolio.images.length > 0
      ? portfolio.images
      : portfolio.cover
        ? [portfolio.cover]
        : [];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedImage = allImages[activeImageIndex] || portfolio.cover;

  const formattedPrice =
    typeof portfolio.price === 'number'
      ? new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          maximumFractionDigits: 0,
        }).format(portfolio.price)
      : null;

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNextImage = () => {
    if (allImages.length === 0) return;
    setActiveImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevImage = () => {
    if (allImages.length === 0) return;
    setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <main className="min-h-screen bg-[#0b0f11] text-[#e0e2e6] py-24 px-6 relative overflow-hidden">
      {/* Order Modal */}
      {typeof portfolio.price === 'number' && (
        <VannShootOrderModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          portfolio={{
            id: portfolio.id,
            title: portfolio.title,
            cover: portfolio.cover,
            price: portfolio.price,
            selectedImage: selectedImage || null,
          }}
          serviceFee={serviceFee}
        />
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 z-50 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative h-[85vh] w-[90vw] max-w-6xl">
            <Image src={selectedImage} alt={portfolio.title} fill className="object-contain" />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-300 space-y-8">
        {/* Navigation Top */}
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <Link
            href={'/vannshoot' as Route}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#fe7f2d] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Katalog VannShoot</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Link Tersalin!</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5 text-[#fe7f2d]" />
                <span>Bagikan</span>
              </>
            )}
          </button>
        </div>

        {/* Detail Layout */}
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Main Visual Display (8 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="group relative aspect-4/3 w-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#111419] shadow-2xl">
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={portfolio.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-white/30">
                  Tidak Ada Gambar
                </div>
              )}

              {/* Expand Lightbox Button */}
              {selectedImage && (
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute top-4 right-4 rounded-full bg-black/60 backdrop-blur-md p-3 text-white/80 hover:text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              )}

              {/* Gallery Navigation Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 backdrop-blur-md p-3 text-white/80 hover:text-white hover:bg-black/80 transition-all"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 backdrop-blur-md p-3 text-white/80 hover:text-white hover:bg-black/80 transition-all"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery Row */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-2xl border transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#fe7f2d] ring-2 ring-[#fe7f2d]/30 scale-105'
                        : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${portfolio.title} ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Order Action Sidebar (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Category & Location Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {portfolio.categories.map((cat) => (
                  <span
                    key={cat.id}
                    className="rounded-full bg-[#fe7f2d]/10 border border-[#fe7f2d]/30 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#fe7f2d]"
                  >
                    {cat.title}
                  </span>
                ))}
                {portfolio.city && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-3.5 py-1 text-[11px] font-medium text-[#c8c7c4]">
                    <MapPin className="h-3 w-3 text-[#fe7f2d]" />
                    <span>
                      {portfolio.location ? `${portfolio.location}, ` : ''}
                      {portfolio.city}
                    </span>
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-headline text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
                {portfolio.title}
              </h1>

              {/* Price Tag Box */}
              <div className="rounded-2xl border border-white/10 bg-[#111419] p-6 space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#c8c7c4] block">
                  Harga Lisensi / File Original
                </span>
                {formattedPrice ? (
                  <div className="text-3xl font-bold font-headline text-white flex items-baseline gap-2">
                    <span>{formattedPrice}</span>
                    <span className="text-xs font-normal text-[#c8c7c4]">
                      / item / resolusi tinggi
                    </span>
                  </div>
                ) : (
                  <div className="text-lg font-semibold text-[#fe7f2d]">Showcase Karya Only</div>
                )}
              </div>

              {/* Description */}
              {portfolio.description && (
                <div className="rounded-2xl border border-white/5 bg-white/5 p-6 text-sm leading-7 text-[#d8d7d4] space-y-2">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
                    Deskripsi & Konsep
                  </h4>
                  <p className="whitespace-pre-line">{portfolio.description}</p>
                </div>
              )}

              {/* Meta Stats */}
              <div className="flex items-center gap-6 text-xs text-[#c8c7c4] border-t border-b border-white/5 py-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-[#fe7f2d]" />
                  <span>Total {allImages.length} Foto dalam Seri</span>
                </div>
              </div>
            </div>

            {/* Checkout / Order Action */}
            <div className="space-y-3 pt-4">
              {typeof portfolio.price === 'number' ? (
                <button
                  onClick={() => setIsOrderModalOpen(true)}
                  className="w-full flex items-center justify-center gap-3 rounded-full bg-[#fe7f2d] px-8 py-4 text-sm font-bold uppercase tracking-[0.15em] text-[#331100] transition-transform duration-300 hover:scale-105 shadow-[0_0_30px_rgba(254,127,45,0.3)]"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Beli Lisensi & Download Original</span>
                </button>
              ) : (
                <Link
                  href={'/contact' as Route}
                  className="w-full flex items-center justify-center gap-3 rounded-full border border-[#fe7f2d] bg-[#fe7f2d]/10 px-8 py-4 text-sm font-bold uppercase tracking-[0.15em] text-[#fe7f2d] transition-all duration-300 hover:bg-[#fe7f2d] hover:text-[#331100]"
                >
                  <span>Tanyakan Sesi Foto Terkait</span>
                </Link>
              )}
              <p className="text-[11px] text-center text-[#c8c7c4]">
                Proses cepat & transparan melalui CMS VannShoot
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
