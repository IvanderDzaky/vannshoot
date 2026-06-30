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
import { deleteImage, uploadImage } from '@/services/uploads';

export const useTestimonialForm = (initialData: Testimonial | null) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [cropperImageSrc, setCropperImageSrc] = useState<string>('');
  const [isDirectUpload, setIsDirectUpload] = useState(false);
  const [tempFileName, setTempFileName] = useState<string>('testimonial-image');

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: initialData
      ? {
          client: initialData.client,
          testimony: initialData.testimony,
          location: initialData.location,
          city: initialData.city,
          cover: initialData.cover || '',
          redirect: initialData.redirect || '',
        }
      : {
          client: '',
          testimony: '',
          location: '',
          city: '',
          cover: '',
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
        setUploadedFiles([]); // Kosongkan tracking karena sudah resmi disimpan
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

  const handleBack = async () => {
    if (uploadedFiles.length > 0) {
      const toastId = toast.loading('Membersihkan file sementara...');
      try {
        for (const url of uploadedFiles) {
          if (url !== initialData?.cover) {
            await deleteImage(url);
          }
        }
        setUploadedFiles([]);
        toast.success('Penyimpanan dibersihkan', { id: toastId });
      } catch (error) {
        toast.error('Gagal membersihkan beberapa file', { id: toastId });
      }
    }
    router.push('/admin/services/testimonials');
  };

  const processUpload = async (file: File) => {
    const currentValue = form.getValues('cover');
    const clientName = form.getValues('client');

    let fileToUpload = file;
    if (clientName) {
      const sanitizedName = clientName.replace(/\s+/g, '-').toLowerCase();
      fileToUpload = new File([file], `${sanitizedName}-testimonial.webp`, { type: 'image/webp' });
    }

    setIsUploading(true);
    try {
      const result = await uploadImage(fileToUpload, 'testimonials');
      if (result.success && result.url) {
        // Register untuk tracking
        setUploadedFiles((prev) => [...prev, result.url!]);

        setIsDirectUpload(true);
        form.setValue('cover', result.url, { shouldValidate: true });
        toast.success('Gambar berhasil diunggah.');
      } else {
        toast.error(result.error || 'Gagal mengunggah gambar.');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengunggah gambar.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar.');
      return;
    }

    const originalName = file.name.split('.')[0].replace(/\s+/g, '-').toLowerCase();
    setTempFileName(`${originalName}-testimonial`);

    const reader = new FileReader();
    reader.onload = (event) => {
      setCropperImageSrc(event.target?.result as string);
      setIsCropperOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCroppedImage = (croppedFile: File) => {
    processUpload(croppedFile);
    setIsCropperOpen(false);
  };

  const handleRemoveImage = async () => {
    const currentValue = form.getValues('cover');

    if (
      isDirectUpload &&
      currentValue &&
      currentValue !== initialData?.cover &&
      currentValue.includes('/testimonials/')
    ) {
      await deleteImage(currentValue);
    }

    setIsDirectUpload(false);
    form.setValue('cover', '');
  };

  return {
    form,
    onSubmit,
    onDelete,
    handleBack,
    handleDrop,
    isUploading,
    setIsUploading,
    isDragging,
    setIsDragging,
    isAlertOpen,
    setIsAlertOpen,
    isCropperOpen,
    setIsCropperOpen,
    cropperImageSrc,
    handleCroppedImage,
    handleRemoveImage,
    tempFileName,
    submitMutation,
    deleteMutation,
  };
};
