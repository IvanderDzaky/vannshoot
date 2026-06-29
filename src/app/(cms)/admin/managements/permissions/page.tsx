'use client';
import { type FC, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

import { useDebounce } from '@/hooks/useDebounce';
import { getPermissions, deleteBulkPermissions } from '@/services/permissions';

import type { Permission } from '@/interfaces/features/permissions';
import { usePermission } from '@/providers/PermissionProvider';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/Common/Heading';
import AlertModal from '@/components/Common/Modals/AlertModal';
import Columns from './_components/Columns';

const PermissionsCMS: FC = () => {
  const { hasPermission } = usePermission();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [limit, setLimit] = useState(5);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['permissions', page, limit, debouncedSearch],
    queryFn: async () => {
      const result = await getPermissions(page, limit, debouncedSearch);
      return result;
    },
  });

  const deleteBulkMutation = useMutation({
    mutationFn: (ids: string[]) => deleteBulkPermissions(ids),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['permissions'] });
        setIsBulkDeleteOpen(false);
        setSelectedPermissions([]);
        setRowSelection({});
      } else {
        toast.error(result.error);
      }
    },
  });

  const onBulkDelete = () => {
    deleteBulkMutation.mutate(selectedPermissions.map((p) => p.id));
  };

  const permissions = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, lastPage: 0 };

  return (
    <section>
      <AlertModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={onBulkDelete}
        loading={deleteBulkMutation.isPending}
      />
      <div className="flex items-center justify-between">
        <Heading
          title={`Hak Akses (${meta.total})`}
          description="Daftar hak akses yang tersedia."
        />
        {hasPermission('permission.create') && (
          <Button asChild>
            <Link href="/admin/managements/permissions/new">
              <Plus /> Tambah Hak Akses
            </Link>
          </Button>
        )}
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={Columns}
        data={permissions}
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
          setSelectedPermissions(rows);
          setIsBulkDeleteOpen(true);
        }}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        searchValue={search}
      />
      {/* {process.env.NODE_ENV === 'development' && (
        <>
          <Heading title="API Routes" description="Endpoints untuk mengakses data hak akses." />
          <Separator />
          <ApiListAlert entityName="permissions" entityIdName="id" />
        </>
      )} */}
    </section>
  );
};

export default PermissionsCMS;
