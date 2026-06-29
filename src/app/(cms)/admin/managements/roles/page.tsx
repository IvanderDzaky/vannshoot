'use client';
import { type FC, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import Link from 'next/link';

import { useDebounce } from '@/hooks/useDebounce';
import { getRoles } from '@/services/roles';
import { usePermission } from '@/providers/PermissionProvider';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/Common/Heading';
import Columns from './_components/Columns';

const RolesCMS: FC = () => {
  const { hasPermission } = usePermission();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);
  const [limit, setLimit] = useState(5);

  const { data, isLoading } = useQuery({
    queryKey: ['roles', page, limit, debouncedSearch],
    queryFn: async () => {
      const result = await getRoles(page, limit, debouncedSearch);
      return result;
    },
  });

  const roles = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, lastPage: 0 };

  return (
    <section>
      <div className="flex items-center justify-between">
        <Heading title={`Jabatan (${meta.total})`} description="Daftar jabatan yang tersedia." />
        {hasPermission('role.create') && (
          <Button asChild>
            <Link href="/admin/managements/roles/new">
              <Plus /> Tambah Jabatan
            </Link>
          </Button>
        )}
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={Columns}
        data={roles}
        isFetching={isLoading}
        pageCount={meta.lastPage}
        onPageChange={(p) => setPage(p)}
        onLimitChange={(l) => setLimit(l)}
        onSearchChange={(v) => {
          setSearch(v);
          setDebouncedSearch(v);
          setPage(1);
        }}
        searchValue={search}
      />
    </section>
  );
};

export default RolesCMS;
