'use client';
import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { ChevronsUpDown, Search } from 'lucide-react';
import Image from 'next/image';
import moment from 'moment';
import 'moment/locale/id';

import type { Article } from '@/interfaces/features/articles';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import ImagePreviewModal from '@/components/Common/Modals/ImagePreviewModal';
import CellAction from './CellAction';

const Columns: ColumnDef<Article>[] = [
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
        Judul Artikel
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <TitleCell row={row} />,
  },
  {
    accessorKey: 'articleCategories',
    header: 'Kategori',
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.articleCategories && row.original.articleCategories.length > 0 ? (
          row.original.articleCategories.map((cat) => (
            <Badge key={cat.id} variant="secondary" className="text-[10px]">
              {cat.name}
            </Badge>
          ))
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        )}
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

const TitleCell = ({ row }: { row: { original: Article } }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const image = row.original.cover;

  return (
    <>
      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        imageSrc={image}
        title={row.original.title}
        aspectRatio="3/2"
      />
      <div className="flex items-center gap-3 text-left">
        <div
          className="relative h-10 w-16 min-w-16 rounded-lg overflow-hidden border bg-muted flex items-center justify-center cursor-zoom-in hover:ring-2 hover:ring-primary/20 transition-all group"
          onClick={() => image && setIsPreviewOpen(true)}
        >
          {image ? (
            <>
              <Image
                src={image}
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
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{row.original.title}</span>
          <span className="text-xs text-muted-foreground truncate max-w-[200px]">
            {row.original.content.replace(/<[^>]*>?/gm, '').substring(0, 50)}...
          </span>
        </div>
      </div>
    </>
  );
};

export default Columns;
