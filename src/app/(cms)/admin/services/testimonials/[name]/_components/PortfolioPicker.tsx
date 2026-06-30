'use client';
import { type FC, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Link as LinkIcon, Loader2, Check, ChevronsUpDown } from 'lucide-react';

import { getPortfoliosForPicker } from '@/services/portfolios';
import { slugify } from '@/lib/slugify';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface PortfolioPickerProps {
  onSelect: (url: string) => void;
  currentUrl?: string;
}

const PortfolioPicker: FC<PortfolioPickerProps> = ({ onSelect, currentUrl }) => {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>('');

  const { data: portfoliosResult, isLoading } = useQuery({
    queryKey: ['portfolios-picker'],
    queryFn: () => getPortfoliosForPicker(),
  });

  const portfolios = portfoliosResult?.success ? portfoliosResult.data : [];

  const handleSelect = (portfolio: any) => {
    setSelectedId(portfolio.id);
    setOpen(false);

    const protocol = window.location.protocol;
    const host = window.location.host.replace('admin.', ''); // Assume main site is without 'admin.'
    const category = portfolio.categories[0]?.title || 'general';
    const categorySlug = slugify(category);
    const titleSlug = slugify(portfolio.title);

    const url = `${protocol}//${host}/portfolio/${categorySlug}/${titleSlug}`;
    onSelect(url);
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Memuat Portfolio...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 truncate">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span>Pilih dari Portfolio</span>
              </div>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
          <Command>
            <CommandInput placeholder="Cari portfolio..." />
            <CommandList>
              <CommandEmpty>Portfolio tidak ditemukan.</CommandEmpty>
              <CommandGroup>
                {portfolios.map((portfolio) => (
                  <CommandItem
                    key={portfolio.id}
                    value={portfolio.title}
                    onSelect={() => handleSelect(portfolio)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedId === portfolio.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{portfolio.title}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {portfolio.categories[0]?.title || 'Tanpa Kategori'}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PortfolioPicker;
