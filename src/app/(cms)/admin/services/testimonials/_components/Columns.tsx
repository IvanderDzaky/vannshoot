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
  return (
    <div className="flex flex-col text-left">
      <span className="font-medium text-foreground">{row.original.client}</span>
      <span className="text-xs text-muted-foreground truncate max-w-[250px]">
        {row.original.testimony}
      </span>
    </div>
  );
};
