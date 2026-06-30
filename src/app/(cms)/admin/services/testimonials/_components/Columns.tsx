'use client';
import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { ChevronsUpDown, Search } from 'lucide-react';
import Image from 'next/image';
import moment from 'moment';
import 'moment/locale/id';

import type { Testimonial } from '@/interfaces/features/testimonial';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import ImagePreviewModal from '@/components/Common/Modals/ImagePreviewModal';
import CellAction from './CellAction';

export const columns: ColumnDef<Testimonial>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Pilih semua"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Pilih baris"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'client',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Klien
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <ClientCell row={row} />,
  },
  {
    accessorKey: 'city',
    header: 'Lokasi/Kota',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium">{row.original.city}</span>
        <span className="text-xs text-muted-foreground">{row.original.location}</span>
      </div>
    ),
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Terakhir Diperbarui
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return moment(row.original.updatedAt).locale('id').format('DD MMMM YYYY, HH:mm');
    },
  },
  {
    id: 'action',
    header: 'Aksi',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

const ClientCell = ({ row }: { row: { original: Testimonial } }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const image = row.original.cover;

  return (
    <>
      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        imageSrc={image}
        title={row.original.client}
        aspectRatio="1/1"
      />
      <div className="flex items-center gap-3 text-left">
        <div
          className="relative h-10 w-10 min-w-10 rounded-lg overflow-hidden border bg-muted flex items-center justify-center cursor-zoom-in hover:ring-2 hover:ring-primary/20 transition-all group"
          onClick={() => image && setIsPreviewOpen(true)}
        >
          {image ? (
            <>
              <Image
                src={image}
                alt={row.original.client}
                loading="lazy"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                fill
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Search className="h-4 w-4 text-white" />
              </div>
            </>
          ) : (
            <span className="text-[10px] text-muted-foreground font-bold">AVA</span>
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{row.original.client}</span>
          <span className="text-xs text-muted-foreground truncate max-w-[250px]">
            {row.original.testimony}
          </span>
        </div>
      </div>
    </>
  );
};
