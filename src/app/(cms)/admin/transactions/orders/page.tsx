'use client';

import { type FC, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Settings } from 'lucide-react';

import { useDebounce } from '@/hooks/useDebounce';
import { getOrders } from '@/services/orders';
import { usePermission } from '@/providers/PermissionProvider';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/Common/Heading';
import OrderSettingModal from './_components/OrderSettingModal';
import { Columns, type OrderWithRelations } from './_components/Columns';

const OrdersCMS: FC = () => {
  const { hasPermission } = usePermission();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [limit, setLimit] = useState(5);

  // Query Orders
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['orders', page, limit, debouncedSearch],
    queryFn: async () => await getOrders(page, limit, debouncedSearch),
    enabled: hasPermission('order.read'),
  });

  const orders = (ordersData?.data as OrderWithRelations[]) || [];
  const meta = ordersData?.meta || { total: 0, page: 1, lastPage: 0 };

  if (!hasPermission('order.read')) {
    return (
      <div className="space-y-6">
        <Heading title="Order" description="Kelola data transaksi order pelanggan." />
        <Separator />
        <div className="p-6 text-center text-destructive border border-destructive/20 bg-destructive/5 rounded-lg">
          Akses Ditolak. Anda tidak memiliki izin untuk melihat halaman ini.
        </div>
      </div>
    );
  }

  return (
    <section>
      {/* Modal Dialog Pengaturan Order */}
      {hasPermission('order.settings.read') && (
        <OrderSettingModal isOpen={isSettingOpen} onClose={() => setIsSettingOpen(false)} />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <Heading
          title={`Order (${meta.total})`}
          description="Kelola data transaksi order dan status pembayaran pelanggan."
        />
        <div className="flex items-center gap-2">
          {hasPermission('order.settings.read') && (
            <Button onClick={() => setIsSettingOpen(true)} variant="outline" className="gap-2">
              <Settings className="h-4 w-4" /> Pengaturan Order
            </Button>
          )}
        </div>
      </div>

      <Separator />

      <div className="mt-6">
        <DataTable
          searchKey="name_customer"
          columns={Columns}
          data={orders}
          isFetching={isLoading}
          pageCount={meta.lastPage}
          onPageChange={(p) => setPage(p)}
          onLimitChange={(l) => setLimit(l)}
          onSearchChange={(v) => {
            setSearch(v);
            setDebouncedSearch(v);
            setPage(1);
          }}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          searchValue={search}
        />
      </div>
    </section>
  );
};

export default OrdersCMS;
