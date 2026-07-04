'use client';
import { type FC, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

import type { Testimonial } from '@/interfaces/features/testimonial';
import { useDebounce } from '@/hooks/useDebounce';
import { getTestimonials, deleteBulkTestimonials } from '@/services/testimonial';
import { usePermission } from '@/providers/PermissionProvider';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/Common/Heading';
import AlertModal from '@/components/Common/Modals/AlertModal';
import { columns } from './_components/Columns';

const TestimonialsCMS: FC = () => {
  const { hasPermission } = usePermission();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [selectedTestimonials, setSelectedTestimonials] = useState<Testimonial[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [limit, setLimit] = useState(5);

  const queryClient = useQueryClient();

  // Query Testimonials
  const { data: testimonialsData, isLoading } = useQuery({
    queryKey: ['testimonials', page, limit, debouncedSearch],
    queryFn: async () => await getTestimonials(page, limit, debouncedSearch),
  });

  // Mutation Bulk Delete Testimonials
  const deleteBulkMutation = useMutation({
    mutationFn: (ids: string[]) => deleteBulkTestimonials(ids),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['testimonials'] });
        setIsBulkDeleteOpen(false);
        setSelectedTestimonials([]);
        setRowSelection({});
      } else {
        toast.error(result.error);
      }
    },
  });

  const onBulkDelete = () => {
    deleteBulkMutation.mutate(selectedTestimonials.map((c) => c.id));
  };

  const testimonials = testimonialsData?.data || [];
  const meta = testimonialsData?.meta || { total: 0, page: 1, lastPage: 0 };

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
          title={`Testimonial (${meta.total})`}
          description="Kelola data testimonial pelanggan."
        />
        <div className="flex items-center gap-2">
          {hasPermission('testimonial.create') && (
            <Button asChild>
              <Link href="/admin/services/testimonials/new">
                <Plus /> Tambah Testimonial
              </Link>
            </Button>
          )}
        </div>
      </div>

      <Separator />

      <div className="mt-6">
        <DataTable
          searchKey="client"
          columns={columns}
          data={testimonials}
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
            setSelectedTestimonials(rows);
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

export default TestimonialsCMS;
