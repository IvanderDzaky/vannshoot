import type { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { Camera, MapPin, Tag } from 'lucide-react';

export interface CatalogPortfolioItem {
  id: string;
  title: string;
  description: string | null;
  cover: string | null;
  images: string[];
  city: string | null;
  location: string | null;
  price: number | null;
  categories: { id: string; title: string }[];
}

interface VannShootCatalogCardProps {
  portfolio: CatalogPortfolioItem;
}

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export const VannShootCatalogCard: FC<VannShootCatalogCardProps> = ({ portfolio }) => {
  const slug = toSlug(portfolio.title);
  const formattedPrice =
    typeof portfolio.price === 'number'
      ? new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          maximumFractionDigits: 0,
        }).format(portfolio.price)
      : null;

  return (
    <Link
      href={`/vannshoot/${slug}` as Route}
      className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#111419] transition-all duration-500 hover:-translate-y-2 hover:border-[#fe7f2d]/50 hover:shadow-[0_20px_60px_rgba(254,127,45,0.15)]"
    >
      <div className="relative aspect-4/3 w-full overflow-hidden bg-white/5">
        {portfolio.cover ? (
          <Image
            src={portfolio.cover}
            alt={portfolio.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/30">
            <Camera className="h-12 w-12" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#111419] via-transparent to-black/20 opacity-90 transition-opacity duration-300 group-hover:opacity-75" />

        {/* Categories Badges */}
        {portfolio.categories && portfolio.categories.length > 0 && (
          <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 z-10">
            {portfolio.categories.map((cat) => (
              <span
                key={cat.id}
                className="rounded-full bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#fe7f2d]"
              >
                {cat.title}
              </span>
            ))}
          </div>
        )}

        {/* Location Badge */}
        {portfolio.city && (
          <div className="absolute bottom-4 left-4 flex items-center gap-1 z-10 text-xs text-white/80 font-medium bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
            <MapPin className="h-3 w-3 text-[#fe7f2d]" />
            <span>
              {portfolio.location ? `${portfolio.location}, ` : ''}
              {portfolio.city}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold font-headline text-white group-hover:text-[#fe7f2d] transition-colors duration-300 line-clamp-1">
            {portfolio.title}
          </h3>
          {portfolio.description && (
            <p className="text-xs leading-relaxed text-[#c8c7c4] line-clamp-2">
              {portfolio.description}
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex items-center gap-1 text-xs text-[#c8c7c4]">
            <Tag className="h-3.5 w-3.5 text-[#fe7f2d]" />
            <span>{portfolio.images ? portfolio.images.length : 0} Foto</span>
          </div>

          <div className="text-right">
            {formattedPrice ? (
              <span className="text-base font-bold text-white font-headline">
                {formattedPrice}
                <span className="text-[10px] font-normal text-[#c8c7c4]"> /foto</span>
              </span>
            ) : (
              <span className="text-xs font-semibold text-[#fe7f2d] uppercase tracking-wider">
                Showcase
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
