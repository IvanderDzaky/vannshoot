'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import type { Role } from '@/interfaces/features/roles';
import type { Permission } from '@/interfaces/features/permissions';
import { getAllPermissions } from '@/services/permissions';
import { createRole, deleteRole, updateRoleById, type RoleValues } from '@/services/roles';
import { roleSchema } from '@/schemas/roles';

export const useRoleForm = (initialData: Role | null) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const form = useForm<z.infer<typeof roleSchema>>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      permissions: initialData?.permissions?.map((p) => p.id) || [],
    },
  });

  const { data: permissionsData, isLoading: isLoadingPermissions } = useQuery({
    queryKey: ['all-permissions'],
    queryFn: async () => {
      const result = await getAllPermissions();
      return result.success ? (result.data as Permission[]) : [];
    },
  });

  const allPermissions = (permissionsData || []) as Permission[];

  const submitMutation = useMutation({
    mutationFn: async (data: RoleValues) => {
      return initialData ? await updateRoleById(initialData.id, data) : await createRole(data);
    },
    onSuccess: async (result) => {
      if (result.success) {
        toast.success(result.message);
        await queryClient.invalidateQueries({ queryKey: ['roles'] });
        await queryClient.invalidateQueries({ queryKey: ['user-data'] });
        router.refresh();
        router.push('/admin/managements/roles');
      } else {
        toast.error(process.env.NODE_ENV === 'development' ? result.error : result.message);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: async (result) => {
      if (result.success) {
        toast.success(result.message);
        await queryClient.invalidateQueries({ queryKey: ['roles'] });
        await queryClient.invalidateQueries({ queryKey: ['user-data'] });
        router.refresh();
        router.push('/admin/managements/roles');
      } else {
        toast.error(process.env.NODE_ENV === 'development' ? result.error : result.message);
      }
    },
  });

  const onSubmit = (data: RoleValues) => submitMutation.mutate(data);
  const onDelete = () => initialData && deleteMutation.mutate(initialData.id);

  return {
    form,
    allPermissions,
    isLoadingPermissions,
    onSubmit,
    onDelete,
    isAlertOpen,
    setIsAlertOpen,
    submitMutation,
    deleteMutation,
  };
};
