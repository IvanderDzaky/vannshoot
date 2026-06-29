'use client';
import type { ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDown } from 'lucide-react';
import moment from 'moment';
import 'moment/locale/id';

import type { User } from '@/interfaces/features/users';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import CellAction from './CellAction';

const Columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Pengguna
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || ''} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'role',
    header: 'Jabatan',
    cell: ({ row }) => {
      const user = row.original;
      const role = user.roles?.[0];

      const getRoleColor = (name: string) => {
        switch (name.toLowerCase()) {
          case 'superadmin':
            return 'bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-500/30';
          case 'admin':
            return 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-500/30';
          case 'user':
            return 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/30';
          default:
            return 'bg-slate-500/10 text-slate-600 border-slate-200 dark:border-slate-500/30';
        }
      };

      if (!role) return <div className="text-muted-foreground">-</div>;

      return (
        <Badge
          variant="outline"
          className={`font-semibold capitalize px-2.5 py-0.5 ${getRoleColor(role.name)}`}
        >
          {role.name}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Tanggal Terdaftar',
    cell: ({ row }) => {
      return moment(row.original.createdAt).locale('id').format('DD MMMM YYYY, HH:mm');
    },
  },
  {
    id: 'action',
    header: 'Aksi',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export default Columns;
