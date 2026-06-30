'use client';
import type { ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDown } from 'lucide-react';
import moment from 'moment';
import 'moment/locale/id';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

export interface OrderWithRelations {
  id: string;
  name_customer: string;
  email_customer: string;
  phone_customer: string;
  type: 'PRODUCT' | 'SERVICE';
  quantity: number;
  price_per_unit: number;
  total_price: number;
  status: 'PENDING' | 'WAITING_CONFIRMATION' | 'CONFIRMED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
  portfolio: {
    title: string;
  };
}

export const Columns: ColumnDef<OrderWithRelations>[] = [
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
    accessorKey: 'name_customer',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Pelanggan
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col text-left">
        <span className="font-medium text-foreground">{row.original.name_customer}</span>
        <span className="text-xs text-muted-foreground">{row.original.email_customer}</span>
        <span className="text-xs text-muted-foreground">{row.original.phone_customer}</span>
      </div>
    ),
  },
  {
    accessorKey: 'portfolio',
    header: 'Portfolio / Layanan',
    cell: ({ row }) => (
      <div className="flex flex-col text-left">
        <span className="font-medium text-foreground">{row.original.portfolio?.title || '-'}</span>
        <span className="text-xs text-muted-foreground">{row.original.quantity} item / gambar</span>
      </div>
    ),
  },
  {
    accessorKey: 'total_price',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Total Harga
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(row.original.total_price);
      return <span className="font-semibold text-foreground">{formatted}</span>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      let badgeStyle = '';
      let label = '';

      switch (status) {
        case 'PENDING':
          badgeStyle = 'bg-rose-500/10 text-rose-600 border-rose-200';
          label = 'Pending';
          break;
        case 'WAITING_CONFIRMATION':
          badgeStyle = 'bg-blue-500/10 text-blue-600 border-blue-200';
          label = 'Menunggu Konfirmasi';
          break;
        case 'CONFIRMED':
          badgeStyle = 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
          label = 'Selesai / Lunas';
          break;
        case 'CANCELLED':
          badgeStyle = 'bg-muted text-muted-foreground border-muted-foreground/20';
          label = 'Batal';
          break;
        default:
          badgeStyle = 'bg-muted text-muted-foreground';
          label = status;
      }

      return (
        <Badge variant="outline" className={badgeStyle}>
          {label}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Tanggal Transaksi
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return moment(row.original.createdAt).locale('id').format('DD MMMM YYYY, HH:mm');
    },
  },
];
