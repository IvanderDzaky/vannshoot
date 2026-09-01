'use client';

import type { FC } from 'react';
import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, X } from 'lucide-react';
import { VannShootCatalogCard, type CatalogPortfolioItem } from './VannShootCatalogCard';

interface CategoryOption {
  id: string;
  title: string;
}

interface VannShootCatalogFilterProps {
  portfolios: CatalogPortfolioItem[];
  categories: CategoryOption[];
}

export const VannShootCatalogFilter: FC<VannShootCatalogFilterProps> = ({
  portfolios,
  categories,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const selectedCategory = searchParams.get('category') || 'all';
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const handleCategorySelect = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId === 'all') {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }
    startTransition(() => {
      router.push(`/vannshoot?${params.toString()}`, { scroll: false });
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    } else {
      params.delete('search');
    }
    startTransition(() => {
      router.push(`/vannshoot?${params.toString()}`, { scroll: false });
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    startTransition(() => {
      router.push('/vannshoot', { scroll: false });
    });
  };

  // Client-side filtering logic as secondary guard
  const filteredPortfolios = portfolios.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.categories.some((cat) => cat.id === selectedCategory);
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.city && item.city.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Controls Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl border border-white/10 bg-[#111419] p-4 shadow-xl">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              selectedCategory === 'all'
                ? 'bg-[#fe7f2d] text-[#331100] shadow-[0_0_20px_rgba(254,127,45,0.4)]'
                : 'bg-white/5 text-[#c8c7c4] hover:bg-white/10 hover:text-white'
            }`}
          >
            Semua Foto
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                selectedCategory === cat.id
                  ? 'bg-[#fe7f2d] text-[#331100] shadow-[0_0_20px_rgba(254,127,45,0.4)]'
                  : 'bg-white/5 text-[#c8c7c4] hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center min-w-[240px]">
          <Search className="absolute left-3.5 h-4 w-4 text-[#c8c7c4]" />
          <input
            type="text"
            placeholder="Cari foto atau kota..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-9 text-xs text-white placeholder-[#c8c7c4] focus:border-[#fe7f2d] focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                const params = new URLSearchParams(searchParams.toString());
                params.delete('search');
                router.push(`/vannshoot?${params.toString()}`, { scroll: false });
              }}
              className="absolute right-3 text-[#c8c7c4] hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </form>
      </div>

      {/* Active Filter Notice */}
      {(selectedCategory !== 'all' || searchQuery) && (
        <div className="flex items-center justify-between text-xs text-[#c8c7c4]">
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-[#fe7f2d]" />
            <span>
              Menampilkan {filteredPortfolios.length} hasil
              {selectedCategory !== 'all' && (
                <>
                  {' '}
                  untuk kategori{' '}
                  <strong className="text-white">
                    {categories.find((c) => c.id === selectedCategory)?.title}
                  </strong>
                </>
              )}
              {searchQuery && (
                <>
                  {' '}
                  dengan kata kunci &quot;<strong className="text-white">{searchQuery}</strong>
                  &quot;
                </>
              )}
            </span>
          </div>
          <button onClick={clearFilters} className="text-[#fe7f2d] hover:underline font-semibold">
            Reset Filter
          </button>
        </div>
      )}

      {/* Catalog Grid */}
      {filteredPortfolios.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPortfolios.map((portfolio) => (
            <VannShootCatalogCard key={portfolio.id} portfolio={portfolio} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[2rem] border border-white/10 bg-[#111419] py-20 px-6 text-center space-y-4">
          <div className="rounded-full bg-white/5 p-4 text-[#fe7f2d]">
            <Search className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-white font-headline">Tidak Ada Foto Ditemukan</h3>
          <p className="max-w-md text-sm text-[#c8c7c4]">
            Katalog foto untuk kriteria yang Anda cari belum tersedia. Coba kata kunci lain atau
            pilih kategori yang berbeda.
          </p>
          <button
            onClick={clearFilters}
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#fe7f2d] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#331100] transition-transform duration-300 hover:scale-105"
          >
            Lihat Semua Katalog
          </button>
        </div>
      )}
    </div>
  );
};
