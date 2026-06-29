'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import type { Permission } from '@/interfaces/features/permissions';
import {
  createPermission,
  deletePermission,
  updatePermission,
  createBulkPermissions,
  type PermissionValues,
} from '@/services/permissions';
import { permissionSchema } from '@/schemas/permissions';

export const usePermissionForm = (initialData: Permission | null) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const form = useForm<z.infer<typeof permissionSchema>>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      isCrudMode: false,
    },
  });

  const watchedValues = useWatch({
    control: form.control,
    name: ['name', 'isCrudMode'],
  });

  const nameValue = watchedValues[0] as string;
  const isCrudMode = watchedValues[1] as boolean;

  const submitMutation = useMutation({
    mutationFn: async (data: PermissionValues) => {
      if (!initialData && data.isCrudMode) {
        return await createBulkPermissions(data.name, data.description || '');
      }
      return initialData
        ? await updatePermission(initialData.name, data)
        : await createPermission(data);
    },
    onSuccess: async (result) => {
      if (result.success) {
        toast.success(result.message);
        await queryClient.invalidateQueries({ queryKey: ['permissions'] });
        await queryClient.invalidateQueries({ queryKey: ['user-data'] });
        router.refresh();
        router.push('/admin/managements/permissions');
      } else {
        toast.error(process.env.NODE_ENV === 'development' ? result.error : result.message);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePermission(id),
    onSuccess: async (result) => {
      if (result.success) {
        toast.success(result.message);
        await queryClient.invalidateQueries({ queryKey: ['permissions'] });
        await queryClient.invalidateQueries({ queryKey: ['user-data'] });
        router.refresh();
        router.push('/admin/managements/permissions');
      } else {
        toast.error(process.env.NODE_ENV === 'development' ? result.error : result.message);
      }
    },
  });

  const onSubmit = (data: PermissionValues) => submitMutation.mutate(data);
  const onDelete = () => initialData && deleteMutation.mutate(initialData.id);

  return {
    form,
    nameValue,
    isCrudMode,
    onSubmit,
    onDelete,
    isAlertOpen,
    setIsAlertOpen,
    submitMutation,
    deleteMutation,
  };
};
