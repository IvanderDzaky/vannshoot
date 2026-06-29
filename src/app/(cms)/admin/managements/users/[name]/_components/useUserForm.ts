'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import type { User } from '@/interfaces/features/users';
import { getRoles } from '@/services/roles';
import { createUser, deleteUser, updateUser, type UserValues } from '@/services/users';
import { userSchema } from '@/schemas/users';

export const useUserForm = (initialData: User | null) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      password: '',
      newPassword: '',
      roleId: initialData?.roles?.[0]?.id || '',
      image: initialData?.image || '',
    },
  });

  const { data: rolesData, isLoading: isLoadingRoles } = useQuery({
    queryKey: ['roles-all'],
    queryFn: async () => {
      const result = await getRoles(1, 100);
      return result.success ? result.data : [];
    },
  });

  const roles = rolesData || [];

  const submitMutation = useMutation({
    mutationFn: async (data: UserValues) => {
      return initialData ? await updateUser(initialData.id, data) : await createUser(data);
    },
    onSuccess: async (result) => {
      if (result.success) {
        toast.success(result.message);
        await queryClient.invalidateQueries({ queryKey: ['users'] });
        await queryClient.invalidateQueries({ queryKey: ['user-data'] });
        router.refresh();
        router.push('/admin/managements/users');
      } else {
        toast.error(result.error);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: async (result) => {
      if (result.success) {
        toast.success(result.message);
        await queryClient.invalidateQueries({ queryKey: ['users'] });
        await queryClient.invalidateQueries({ queryKey: ['user-data'] });
        router.refresh();
        router.push('/admin/managements/users');
      } else {
        toast.error(process.env.NODE_ENV === 'development' ? result.error : result.message);
      }
    },
  });

  const onSubmit = (data: UserValues) => submitMutation.mutate(data);
  const onDelete = () => initialData && deleteMutation.mutate(initialData.id);

  return {
    form,
    roles,
    isLoadingRoles,
    onSubmit,
    onDelete,
    isAlertOpen,
    setIsAlertOpen,
    submitMutation,
    deleteMutation,
  };
};
