import type { FC } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import type { ContentItem } from '../_data';

interface Props {
  item: ContentItem;
}

const ContentGridItem: FC<Props> = ({ item }) => {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#111419] shadow-[0_24px_80px_rgba(0,0,0,0.25)] transition-all duration-500 hover:-translate-y-2">
      <div className="aspect-video overflow-hidden relative">
        <img
          loading="lazy"
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 rounded-full bg-[#111419]/80 backdrop-blur-xs px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#fe7f2d] border border-white/5">
          {item.category}
        </div>
      </div>
      <div className="p-8">
        <h3 className="text-2xl font-semibold text-white mb-3 group-hover:text-[#fe7f2d] transition-colors duration-300">
          {item.title}
        </h3>
        <p className="mb-6 text-sm leading-7 text-[#c8c7c4] line-clamp-2">{item.description}</p>
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#3d4652]/80 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#c8c7c4]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-[#0b0f11]/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Link
          href={`/portfolio/contents/${item.id}` as Route}
          className="rounded-full border border-[#fe7f2d] bg-[#fe7f2d] px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#331100] transition-transform duration-300 hover:scale-105"
        >
          {item.cta}
        </Link>
      </div>
    </div>
  );
};

export default ContentGridItem;
