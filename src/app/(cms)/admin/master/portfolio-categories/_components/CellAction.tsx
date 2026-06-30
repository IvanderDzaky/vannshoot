'use client';
import { type FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

import type { PortfolioCategory } from '@/interfaces/features/portfolio-categories';
import { deletePortfolioCategory } from '@/services/portfolio-categories';
import { usePermission } from '@/providers/PermissionProvider';
import { copyToClipboard } from '@/lib/clipboard';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AlertModal from '@/components/Common/Modals/AlertModal';

interface CellActionProps {
  data: PortfolioCategory;
}

const CellAction: FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { hasPermission } = usePermission();
  const [open, setOpen] = useState<boolean>(false);

  const mutation = useMutation({
    mutationFn: (id: string) => deletePortfolioCategory(id),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['portfolio-categories'] });
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    },
  });

  const onConfirm = async () => {
    mutation.mutate(data.id);
  };

  const isProtected =
    data.title.toLowerCase().includes('graduation') ||
    data.title.toLowerCase().includes('kelulusan');

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={mutation.isPending}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Buka menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded-xl">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => copyToClipboard(data.id)} className="cursor-pointer">
            <Copy className="mr-2 h-4 w-4" /> Salin ID
          </DropdownMenuItem>
          {hasPermission('portfolio.category.update') && (
            <DropdownMenuItem variant="warning" className="cursor-pointer" asChild>
              <Link href={`/admin/master/portfolio-categories/${data.id}`}>
                <Edit className="mr-2 h-4 w-4" /> Ubah
              </Link>
            </DropdownMenuItem>
          )}
          {hasPermission('portfolio.category.delete') && (
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
              onClick={() => {
                if (isProtected) {
                  toast.info(
                    'Kategori ini dilindungi karena memiliki layout khusus di frontend dan tidak dapat dihapus.'
                  );
                } else {
                  setOpen(true);
                }
              }}
            >
              <div className="flex items-center">
                <Trash className="mr-2 h-4 w-4" /> Hapus
              </div>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
