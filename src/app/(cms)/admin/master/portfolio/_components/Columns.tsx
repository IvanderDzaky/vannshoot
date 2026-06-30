'use client';
import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { ChevronsUpDown, Video, Search } from 'lucide-react';
import Image from 'next/image';
import moment from 'moment';
import 'moment/locale/id';

import type { Portfolio } from '@/interfaces/features/portfolios';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import ImagePreviewModal from '@/components/Common/Modals/ImagePreviewModal';
import CellAction from './CellAction';

const Columns: ColumnDef<Portfolio>[] = [
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
    accessorKey: 'title',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Nama Portfolio
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <PortfolioTitleCell row={row} />,
  },
  {
    accessorKey: 'city',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Kota
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const city = row.original.city;
      return <span className="text-sm text-muted-foreground">{city || '-'}</span>;
    },
  },
  {
    id: 'categories',
    header: 'Kategori',
    cell: ({ row }) => {
      const categories = row.original.categories || [];
      return (
        <div className="flex flex-wrap gap-1">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <Badge key={cat.id} variant="secondary" className="text-[10px] px-1.5 py-0">
                {cat.title}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground italic">Tanpa Kategori</span>
          )}
        </div>
      );
    },
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

const PortfolioTitleCell = ({ row }: { row: { original: Portfolio } }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const cover = row.original.cover;

  return (
    <>
      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        imageSrc={cover}
        images={row.original.images}
        title={row.original.title}
        aspectRatio="3/2"
      />
      <div className="flex items-center gap-3 text-left">
        <div
          className="relative h-10 w-10 min-w-10 rounded-lg overflow-hidden border bg-muted flex items-center justify-center cursor-zoom-in hover:ring-2 hover:ring-primary/20 transition-all group"
          onClick={() => cover && setIsPreviewOpen(true)}
        >
          {cover ? (
            <>
              <Image
                src={cover}
                alt={row.original.title}
                loading="lazy"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                fill
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Search className="h-4 w-4 text-white" />
              </div>
            </>
          ) : (
            <span className="text-[10px] text-muted-foreground font-bold">COVER</span>
          )}

          {row.original.images.length > 0 && (
            <div className="absolute bottom-0 right-0 bg-black/60 text-[8px] text-white px-1 rounded-tl z-10">
              +{row.original.images.length}
            </div>
          )}
          {row.original.hasVideo && (
            <div className="absolute top-1 right-1 bg-primary text-primary-foreground p-0.5 rounded-full z-10">
              <Video className="h-3 w-3" />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{row.original.title}</span>
          <span className="text-xs text-muted-foreground truncate max-w-[200px]">
            {row.original.description || '-'}
          </span>
        </div>
      </div>
    </>
  );
};

export default Columns;
