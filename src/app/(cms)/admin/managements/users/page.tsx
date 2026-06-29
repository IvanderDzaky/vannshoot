'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import Link from 'next/link';

import { useDebounce } from '@/hooks/useDebounce';
import { getUsers } from '@/services/users';
import { usePermission } from '@/providers/PermissionProvider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import Heading from '@/components/Common/Heading';
import Columns from './_components/Columns';

const UsersCMS = () => {
  const { hasPermission } = usePermission();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);
  const [limit, setLimit] = useState(5);

  const { data, isLoading } = useQuery({
    queryKey: ['users', page, limit, debouncedSearch],
    queryFn: () => getUsers(page, limit, debouncedSearch),
  });

  const users = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, lastPage: 0 };

  return (
    <section>
      <div className="flex items-center justify-between">
        <Heading title={`Pengguna (${meta.total})`} description="Daftar pengguna yang terdaftar." />
        {hasPermission('user.create') && (
          <Button asChild>
            <Link href="/admin/managements/users/new">
              <Plus /> Tambah Pengguna
            </Link>
          </Button>
        )}
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={Columns}
        data={users}
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

export default UsersCMS;
