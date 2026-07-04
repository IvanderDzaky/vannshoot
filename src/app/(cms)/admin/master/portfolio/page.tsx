'use client';
import { type FC, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

import type { Portfolio } from '@/interfaces/features/portfolios';
import { useDebounce } from '@/hooks/useDebounce';
import { getPortfolios, deleteBulkPortfolios } from '@/services/portfolios';
import { usePermission } from '@/providers/PermissionProvider';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/Common/Heading';
import AlertModal from '@/components/Common/Modals/AlertModal';
import Columns from './_components/Columns';

const PortfoliosCMS: FC = () => {
  const { hasPermission } = usePermission();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Portfolio[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [limit, setLimit] = useState(5);

  const queryClient = useQueryClient();

  // Query Portfolios
  const { data: portfoliosData, isLoading } = useQuery({
    queryKey: ['portfolios', page, limit, debouncedSearch],
    queryFn: async () => await getPortfolios(page, limit, debouncedSearch),
  });

  // Mutation Bulk Delete
  const deleteBulkMutation = useMutation({
    mutationFn: (ids: string[]) => deleteBulkPortfolios(ids),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['portfolios'] });
        setIsBulkDeleteOpen(false);
        setSelectedItems([]);
        setRowSelection({});
      } else {
        toast.error(result.error);
      }
    },
  });

  const onBulkDelete = () => {
    deleteBulkMutation.mutate(selectedItems.map((c) => c.id));
  };

  const portfolios = portfoliosData?.data || [];
  const meta = portfoliosData?.meta || { total: 0, page: 1, lastPage: 0 };

  return (
    <section>
      <AlertModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={onBulkDelete}
        loading={deleteBulkMutation.isPending}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <Heading
          title={`Portfolio (${meta.total})`}
          description="Kelola data portfolio hasil karya."
        />
        <div className="flex items-center gap-2">
          {hasPermission('portfolio.create') && (
            <Button asChild>
              <Link href="/admin/master/portfolio/new">
                <Plus /> Tambah Portfolio
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
          data={portfolios as Portfolio[]}
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
            setSelectedItems(rows);
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

export default PortfoliosCMS;
