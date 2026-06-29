'use client';
import { useState, type FC } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';
import { toast } from 'sonner';

import type { User } from '@/interfaces/features/users';
import { deleteUser } from '@/services/users';
import { usePermission } from '@/providers/PermissionProvider';
import { copyToClipboard } from '@/lib/clipboard';
import { useSession } from '@/lib/authClient';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import AlertModal from '@/components/Common/Modals/AlertModal';
import UserSettingsModal from '@/components/Mixins/Sidebar/UserSettingsModal';

interface CellActionProps {
  data: User;
}

interface ExtendedUser {
  id: string;
  roleId?: string | null;
  role?: string | null;
  roles?: { id: string; name: string }[];
}

const CellAction: FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { hasPermission, hasRole } = usePermission();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const currentUser = session?.user as ExtendedUser | undefined;
  const isSelf = currentUser?.id === data.id;
  const isTargetSuperAdmin = data.roles?.some((role) => role.name.toLowerCase() === 'superadmin');
  const isCurrentUserSuperAdmin = hasRole('superadmin');

  const canDelete = !isSelf && (isCurrentUserSuperAdmin || !isTargetSuperAdmin);
  const canEdit = isSelf || isCurrentUserSuperAdmin || !isTargetSuperAdmin;

  const { mutate: onDelete, isPending } = useMutation({
    mutationFn: () => deleteUser(data.id),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['users'] });
        setOpen(false);
      } else {
        toast.error(result.error);
      }
    },
    onError: () => {
      toast.error('Gagal menghapus pengguna.');
    },
  });

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isPending}
      />
      <UserSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={{
          name: data.name || '',
          email: data.email,
          avatar: data.image || '',
        }}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded-xl">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => copyToClipboard(data.id)} className="cursor-pointer">
            <Copy className="mr-2 h-4 w-4" /> Salin ID
          </DropdownMenuItem>
          {hasPermission('user.update') && canEdit && (
            <DropdownMenuItem
              variant="warning"
              className="cursor-pointer"
              onClick={() => {
                if (isSelf) {
                  setIsSettingsOpen(true);
                } else {
                  router.push(`/admin/managements/users/${data.id}`);
                }
              }}
            >
              <Edit className="mr-2 h-4 w-4" /> Ubah
            </DropdownMenuItem>
          )}
          {hasPermission('user.delete') && canDelete && (
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
              onClick={() => setOpen(true)}
            >
              <Trash className="mr-2 h-4 w-4" /> Hapus
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
