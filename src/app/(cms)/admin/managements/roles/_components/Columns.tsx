'use client';
import type { ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDown } from 'lucide-react';
import moment from 'moment';
import 'moment/locale/id';

import type { Role } from '@/interfaces/features/roles';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CellAction from './CellAction';

const Columns: ColumnDef<Role>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Nama Jabatan
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'permissions',
    header: 'Hak Akses',
    cell: ({ row }) => {
      const permissions = row.original.permissions || [];
      const displayPermissions = permissions.slice(0, 5);
      const remainingCount = permissions.length - 5;

      const getPermissionColor = (name: string) => {
        const method = name.split('.')[1] || name;
        switch (method) {
          case 'read':
            return 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-500/30';
          case 'create':
            return 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/30';
          case 'update':
            return 'bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-500/30';
          case 'delete':
            return 'bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-500/30';
          case 'access':
            return 'bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-500/30';
          default:
            return 'bg-slate-500/10 text-slate-600 border-slate-200 dark:border-slate-500/30';
        }
      };

      if (permissions.length === 0) return <div className="text-muted-foreground">-</div>;

      return (
        <div className="flex flex-wrap gap-1 max-w-[400px]">
          {displayPermissions.map((permission) => (
            <Badge
              key={permission.id}
              variant="outline"
              className={`text-[10px] px-1.5 py-0 font-medium ${getPermissionColor(permission.name)}`}
            >
              {permission.name.split('.')[1] || permission.name}
            </Badge>
          ))}
          {remainingCount > 0 && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-secondary/30">
              +{remainingCount} lainnya
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Deskripsi',
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate">{row.getValue('description') || '-'}</div>
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
