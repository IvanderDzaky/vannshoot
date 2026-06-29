'use client';
import { type FC, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Tag } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

import type { Article } from '@/interfaces/features/articles';
import { useDebounce } from '@/hooks/useDebounce';
import { getArticles, deleteBulkArticles } from '@/services/articles';
import { usePermission } from '@/providers/PermissionProvider';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/Common/Heading';
import AlertModal from '@/components/Common/Modals/AlertModal';
import CategoryModal from './_components/CategoryModal';
import Columns from './_components/Columns';

const ArticlesCMS: FC = () => {
  const { hasPermission } = usePermission();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedArticles, setSelectedArticles] = useState<Article[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [limit, setLimit] = useState(5);

  const queryClient = useQueryClient();

  // Query Articles
  const { data: articlesData, isLoading } = useQuery({
    queryKey: ['articles', page, limit, debouncedSearch],
    queryFn: async () => await getArticles(page, limit, debouncedSearch),
  });

  // Mutation Bulk Delete Articles
  const deleteBulkMutation = useMutation({
    mutationFn: (ids: string[]) => deleteBulkArticles(ids),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['articles'] });
        setIsBulkDeleteOpen(false);
        setSelectedArticles([]);
        setRowSelection({});
      } else {
        toast.error(result.error);
      }
    },
  });

  const onBulkDelete = () => {
    deleteBulkMutation.mutate(selectedArticles.map((c) => c.id));
  };

  const articles = articlesData?.data || [];
  const meta = articlesData?.meta || { total: 0, page: 1, lastPage: 0 };

  return (
    <section>
      <AlertModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={onBulkDelete}
        loading={deleteBulkMutation.isPending}
      />

      <CategoryModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <Heading
          title={`Artikel (${meta.total})`}
          description="Kelola publikasi artikel dan kategori artikel."
        />
        <div className="flex items-center gap-2">
          {hasPermission('article.category.read') && (
            <Button
              variant="outline"
              onClick={() => setIsCategoryModalOpen(true)}
              className="gap-2"
            >
              <Tag /> Master Kategori
            </Button>
          )}
          {hasPermission('article.create') && (
            <Button asChild>
              <Link href="/admin/publications/articles/new">
                <Plus /> Tambah Artikel
              </Link>
            </Button>
          )}
        </div>
      </div>

      <Separator />

      <div className="mt-6">
        <DataTable
          searchKey="title"
          columns={Columns}
          data={articles}
          isFetching={isLoading}
          pageCount={meta.lastPage}
          onPageChange={(p) => setPage(p)}
          onLimitChange={(l) => setLimit(l)}
          onSearchChange={(v) => {
            setSearch(v);
            setDebouncedSearch(v);
            setPage(1);
          }}
          onBulkDelete={(rows) => {
            setSelectedArticles(rows);
            setIsBulkDeleteOpen(true);
          }}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          searchValue={search}
        />
      </div>
    </section>
  );
};

export default ArticlesCMS;
