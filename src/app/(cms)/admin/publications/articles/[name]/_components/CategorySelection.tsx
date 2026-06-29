'use client';
import type { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tag } from 'lucide-react';
import { Controller, type Control } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';

import { getCategories } from '@/services/articles';
import { articleSchema } from '@/schemas/articles';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

type CategorySelectionProps = {
  control: Control<z.infer<typeof articleSchema>>;
};

const CategorySelection: FC<CategorySelectionProps> = ({ control }) => {
  const { data: masterCategoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['article-categories'],
    queryFn: async () => await getCategories(),
  });

  const masterCategories = masterCategoriesData?.data || [];

  return (
    <div className="bg-sidebar p-6 rounded-2xl border space-y-6">
      <div className="flex items-center gap-2">
        <Tag className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-lg">Kategori Artikel</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        Pilih kategori yang sesuai untuk artikel ini dari daftar Master Kategori.
      </p>

      <Separator />

      {isLoadingCategories ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-full bg-muted animate-pulse rounded-md" />
          ))}
        </div>
      ) : masterCategories.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          <Controller
            name="categories"
            control={control}
            render={({ field }) => (
              <>
                {masterCategories.map((cat) => {
                  const isSelected = field.value?.some((v) => v.name === cat.name);

                  return (
                    <label
                      key={cat.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer hover:border-primary/50 ${
                        isSelected ? 'bg-primary/5 border-primary shadow-sm' : 'bg-background'
                      }`}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          const newValue = checked
                            ? [...(field.value || []), { name: cat.name }]
                            : field.value?.filter((v) => v.name !== cat.name);
                          field.onChange(newValue);
                        }}
                      />
                      <span className={`text-sm font-medium ${isSelected ? 'text-primary' : ''}`}>
                        {cat.name}
                      </span>
                    </label>
                  );
                })}
              </>
            )}
          />
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed rounded-xl space-y-2">
          <p className="text-sm text-muted-foreground italic">Belum ada Master Kategori.</p>
          <Button variant="link" size="sm" asChild>
            <Link href="/admin/publications/articles">Buat di Master Kategori</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategorySelection;
