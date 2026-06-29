'use client';
import type { ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDown } from 'lucide-react';
import moment from 'moment';
import 'moment/locale/id';

import type { Permission } from '@/interfaces/features/permissions';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import CellAction from './CellAction';

const Columns: ColumnDef<Permission>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Nama Hak Akses
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'description',
    header: 'Deskripsi',
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate">{row.getValue('description') || '-'}</div>
    ),
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Terakhir Diperbarui
        <ChevronsUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.original;
      return moment(date.updatedAt || new Date())
        .locale('id')
        .format('DD MMMM YYYY, HH:mm');
    },
  },
  {
    id: 'action',
    header: 'Aksi',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export default Columns;
