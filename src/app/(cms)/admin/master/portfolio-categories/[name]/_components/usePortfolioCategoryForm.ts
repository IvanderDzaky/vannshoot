'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';

import type {
  PortfolioCategory,
  PortfolioCategoryResponse,
} from '@/interfaces/features/portfolio-categories';
import {
  portfolioCategorySchema,
  type PortfolioCategoryFormValues,
} from '@/schemas/portfolio-categories';
import {
  createPortfolioCategory,
  updatePortfolioCategory,
  deletePortfolioCategory,
} from '@/services/portfolio-categories';
import { deleteImage, uploadImage } from '@/services/uploads';

export const usePortfolioCategoryForm = (initialData: PortfolioCategory | null) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isDirectUpload, setIsDirectUpload] = useState(false);

  // Cropper state
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [cropperImageSrc, setCropperImageSrc] = useState<string | null>(null);
  const [tempFileName, setTempFileName] = useState<string>('category-cropped');

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const form = useForm<PortfolioCategoryFormValues>({
    resolver: zodResolver(portfolioCategorySchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description || '',
          cover: initialData.cover || '',
        }
      : {
          title: '',
          description: '',
          cover: '',
        },
  });

  const submitMutation = useMutation({
    mutationFn: async (values: PortfolioCategoryFormValues) => {
      if (initialData) {
        return await updatePortfolioCategory(initialData.id, values);
      }
      return await createPortfolioCategory(values);
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        setUploadedFiles([]); // Kosongkan tracking karena sudah resmi disimpan
        queryClient.invalidateQueries({ queryKey: ['portfolio-categories'] });
        router.push('/admin/master/portfolio-categories' as Route);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!initialData) return;
      return await deletePortfolioCategory(initialData.id);
    },
    onSuccess: (result) => {
      if (result?.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['portfolio-categories'] });
        router.push('/admin/master/portfolio-categories' as Route);
        router.refresh();
      } else {
        toast.error(result?.error);
      }
    },
  });

  const onSubmit = (values: PortfolioCategoryFormValues) => {
    submitMutation.mutate(values);
  };

  const onDelete = () => {
    deleteMutation.mutate();
  };

  const handleBack = async () => {
    if (uploadedFiles.length > 0) {
      const toastId = toast.loading('Membersihkan file sementara...');
      try {
        for (const url of uploadedFiles) {
          // Hanya hapus jika file tersebut bukan bagian dari data awal (untuk mode edit)
          const isInitialCover = initialData?.cover === url;

          if (!isInitialCover) {
            await deleteImage(url);
          }
        }
        setUploadedFiles([]);
        toast.success('Penyimpanan dibersihkan', { id: toastId });
      } catch (error) {
        toast.error('Gagal membersihkan beberapa file', { id: toastId });
      }
    }
    router.push('/admin/master/portfolio-categories' as Route);
  };

  const processUpload = async (file: File) => {
    const currentValue = form.getValues('cover');
    const title = form.getValues('title');

    // Paksa ganti nama file sesuai title form saat ini
    let fileToUpload = file;
    if (title) {
      const sanitizedTitle = title.replace(/\s+/g, '-').toLowerCase();
      fileToUpload = new File([file], `${sanitizedTitle}-cropped.webp`, { type: 'image/webp' });
    }

    setIsUploading(true);
    try {
      const result = await uploadImage(fileToUpload, 'portfolio-categories');
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
      console.error(error);
      toast.error('Terjadi kesalahan saat mengunggah gambar.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    const currentValue = form.getValues('cover');

    // Jika file berasal dari upload langsung (bukan pustaka), hapus filenya
    if (
      isDirectUpload &&
      currentValue &&
      currentValue !== initialData?.cover &&
      currentValue.includes('/portfolio-categories/')
    ) {
      await deleteImage(currentValue);
    }

    setIsDirectUpload(false);
    form.setValue('cover', '');
  };

  const handleDrop = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar.');
      return;
    }

    // Set temp filename from original file name
    const originalName = file.name.split('.')[0].replace(/\s+/g, '-').toLowerCase();
    setTempFileName(`${originalName}-cropped`);

    const reader = new FileReader();
    reader.onload = () => {
      setCropperImageSrc(reader.result as string);
      setIsCropperOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCroppedImage = (croppedFile: File) => {
    processUpload(croppedFile);
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
  } as {
    form: UseFormReturn<PortfolioCategoryFormValues>;
    onSubmit: (values: PortfolioCategoryFormValues) => void;
    onDelete: () => void;
    handleBack: () => void;
    handleDrop: (file: File) => Promise<void>;
    isUploading: boolean;
    setIsUploading: (loading: boolean) => void;
    isDragging: boolean;
    setIsDragging: (loading: boolean) => void;
    isAlertOpen: boolean;
    setIsAlertOpen: (open: boolean) => void;
    isCropperOpen: boolean;
    setIsCropperOpen: (open: boolean) => void;
    cropperImageSrc: string | null;
    handleCroppedImage: (file: File) => void;
    handleRemoveImage: () => Promise<void>;
    tempFileName: string;
    submitMutation: UseMutationResult<
      PortfolioCategoryResponse,
      Error,
      PortfolioCategoryFormValues
    >;
    deleteMutation: UseMutationResult<PortfolioCategoryResponse | undefined, Error, void>;
  };
};
