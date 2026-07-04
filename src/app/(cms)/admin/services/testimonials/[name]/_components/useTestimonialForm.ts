'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { Testimonial } from '@/interfaces/features/testimonial';
import { testimonialSchema, type TestimonialFormValues } from '@/schemas/testimonial';
import { createTestimonial, updateTestimonial, deleteTestimonial } from '@/services/testimonial';

export const useTestimonialForm = (initialData: Testimonial | null) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: initialData
      ? {
          client: initialData.client,
          testimony: initialData.testimony,
          location: initialData.location,
          city: initialData.city,
          redirect: initialData.redirect || '',
        }
      : {
          client: '',
          testimony: '',
          location: '',
          city: '',
          redirect: '',
        },
    mode: 'onChange',
  });

  const submitMutation = useMutation({
    mutationFn: async (values: TestimonialFormValues) => {
      if (initialData) {
        return await updateTestimonial(initialData.id, values);
      }
      return await createTestimonial(values);
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['testimonials'] });
        router.push('/admin/services/testimonials');
        router.refresh();
      } else {
        toast.error(result.error);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTestimonial(id),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['testimonials'] });
        router.push('/admin/services/testimonials');
        router.refresh();
      } else {
        toast.error(result.error);
      }
    },
  });

  const onSubmit = (values: TestimonialFormValues) => {
    submitMutation.mutate(values);
  };

  const onDelete = () => {
    if (initialData) {
      deleteMutation.mutate(initialData.id);
    }
  };

  const handleBack = () => {
    router.push('/admin/services/testimonials');
  };

  return {
    form,
    onSubmit,
    onDelete,
    handleBack,
    isAlertOpen,
    setIsAlertOpen,
    submitMutation,
    deleteMutation,
  };
};
