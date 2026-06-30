'use client';
import { type FC, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Tag } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

import type { Client } from '@/interfaces/features/clients';
import { useDebounce } from '@/hooks/useDebounce';
import { getClients, deleteBulkClients } from '@/services/clients';
import { usePermission } from '@/providers/PermissionProvider';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/Common/Heading';
import AlertModal from '@/components/Common/Modals/AlertModal';
import CategoryModal from './_components/CategoryModal';
import Columns from './_components/Columns';

const ClientsCMS: FC = () => {
  const { hasPermission } = usePermission();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedClients, setSelectedClients] = useState<Client[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [limit, setLimit] = useState(5);

  const queryClient = useQueryClient();

  // Query Clients
  const { data: clientsData, isLoading } = useQuery({
    queryKey: ['clients', page, limit, debouncedSearch],
    queryFn: async () => await getClients(page, limit, debouncedSearch),
  });

  // Mutation Bulk Delete Clients
  const deleteBulkMutation = useMutation({
    mutationFn: (ids: string[]) => deleteBulkClients(ids),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['clients'] });
        setIsBulkDeleteOpen(false);
        setSelectedClients([]);
        setRowSelection({});
      } else {
        toast.error(result.error);
      }
    },
  });

  const onBulkDelete = () => {
    deleteBulkMutation.mutate(selectedClients.map((c) => c.id));
  };

  const clients = clientsData?.data || [];
  const meta = clientsData?.meta || { total: 0, page: 1, lastPage: 0 };

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
          title={`Klien (${meta.total})`}
          description="Kelola data klien dan kategori klien."
        />
        <div className="flex items-center gap-2">
          {hasPermission('client.category.read') && (
            <Button
              variant="outline"
              onClick={() => setIsCategoryModalOpen(true)}
              className="gap-2"
            >
              <Tag /> Master Kategori
            </Button>
          )}
          {hasPermission('client.create') && (
            <Button asChild>
              <Link href="/admin/services/clients/new">
                <Plus /> Tambah Klien
              </Link>
            </Button>
          )}
        </div>
      </div>

      <Separator />

      <div className="mt-6">
        <DataTable
          searchKey="name"
          columns={Columns}
          data={clients}
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
            setSelectedClients(rows);
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

export default ClientsCMS;
