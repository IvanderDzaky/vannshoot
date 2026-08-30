import type { FC } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import type { CategoryCard as CategoryCardType } from '../_data';

interface Props {
  category: CategoryCardType;
}

const CategoryCard: FC<Props> = ({ category }) => {
  return (
    <Link
      href={category.path as Route}
      className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-[#111419] shadow-[0_24px_80px_rgba(0,0,0,0.25)] transition-all duration-500 hover:-translate-y-2"
    >
      <div className="aspect-4/3 overflow-hidden relative">
        {category.image ? (
          <img
            loading="lazy"
            src={category.image}
            alt={category.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-[#111419] flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📷</div>
              <div className="text-xs uppercase tracking-[0.2em] text-[#c8c7c4]">
                {category.title}
              </div>
            </div>
          </div>
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f11] via-[#0b0f11]/40 to-transparent opacity-80" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <span className="block text-[10px] uppercase tracking-[0.2em] text-[#fe7f2d] font-semibold mb-2">
          Jelajahi Kategori
        </span>
        <h3 className="text-2xl font-semibold text-white mb-2 group-hover:text-[#fe7f2d] transition-colors duration-300">
          {category.title}
        </h3>
        <p className="text-xs leading-relaxed text-[#c8c7c4] line-clamp-2">
          {category.description}
        </p>
      </div>
    </Link>
  );
};

export default CategoryCard;
