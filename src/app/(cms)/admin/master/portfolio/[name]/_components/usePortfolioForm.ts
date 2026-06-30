'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { Portfolio, PortfolioResponse } from '@/interfaces/features/portfolios';
import { portfolioSchema, type PortfolioFormValues } from '@/schemas/portfolios';
import { createPortfolio, updatePortfolio, deletePortfolio } from '@/services/portfolios';
import { deleteImage, deleteUploadDir } from '@/services/uploads';
import { slugify } from '@/lib/slugify';

/**
 * Upload file via API Route — menghindari masalah stream/buffer Server Action.
 */
async function uploadCoverViaApi(
  file: File,
  folder: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('subDir', folder);

  console.log(
    `[uploadCoverViaApi] 📤 POST /api/upload | file: "${file.name}" (${(file.size / 1024).toFixed(1)} KB)`
  );

  const response = await fetch('/api/upload', { method: 'POST', body: formData });

  if (!response.ok) {
    const text = await response.text().catch(() => 'No body');
    console.error(`[uploadCoverViaApi] ❌ HTTP ${response.status}: ${text}`);
    throw new Error(`Server error ${response.status}`);
  }

  const result = await response.json();
  console.log(`[uploadCoverViaApi] 📥 Response:`, result);
  return result;
}

export const usePortfolioForm = (initialData: Portfolio | null) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isDirectUpload, setIsDirectUpload] = useState(false);

  // Cropper state
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [cropperImageSrc, setCropperImageSrc] = useState<string | null>(null);
  const [tempFileName, setTempFileName] = useState<string>('portfolio-cover');

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description || '',
          cover: initialData.cover || '',
          images: initialData.images || [],
          city: initialData.city || '',
          categoryIds: initialData.categories.map((c) => c.id) || [],
          price: initialData.price || 0,
        }
      : {
          title: '',
          description: '',
          cover: '',
          images: [],
          city: '',
          categoryIds: [],
          price: 0,
        },
  });

  const submitMutation = useMutation({
    mutationFn: async (values: PortfolioFormValues) => {
      if (initialData) {
        return await updatePortfolio(initialData.id, values);
      }
      return await createPortfolio(values);
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        setUploadedFiles([]); // Kosongkan tracking karena sudah resmi disimpan
        queryClient.invalidateQueries({ queryKey: ['portfolios'] });
        router.push('/admin/master/portfolio' as Route);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!initialData) return;
      return await deletePortfolio(initialData.id);
    },
    onSuccess: (result) => {
      if (result?.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['portfolios'] });
        router.push('/admin/master/portfolio' as Route);
        router.refresh();
      } else {
        toast.error(result?.error);
      }
    },
  });

  const onSubmit = (values: PortfolioFormValues) => {
    submitMutation.mutate(values);
  };

  const onDelete = () => {
    deleteMutation.mutate();
  };

  const handleBack = async () => {
    if (uploadedFiles.length > 0 || !initialData) {
      const toastId = toast.loading('Membersihkan file sementara...');
      try {
        // Jika data baru, hapus folder target secara keseluruhan
        if (!initialData) {
          const title = form.getValues('title');
          const folderName = title ? slugify(title) : 'untitled';
          await deleteUploadDir(`portfolios/${folderName}`);
        } else {
          // Jika edit data, hanya hapus file-file yang baru diunggah
          for (const url of uploadedFiles) {
            const isInitialCover = initialData?.cover === url;
            const isInitialImage = initialData?.images?.includes(url);

            if (!isInitialCover && !isInitialImage) {
              await deleteImage(url);
            }
          }
        }

        setUploadedFiles([]);
        toast.success('Penyimpanan dibersihkan', { id: toastId });
      } catch (error) {
        toast.error('Gagal membersihkan beberapa file', { id: toastId });
      }
    }
    router.push('/admin/master/portfolio' as Route);
  };

  const onNewUpload = (url: string) => {
    setUploadedFiles((prev) => [...prev, url]);
  };

  const processUpload = async (file: File, folder: string = 'portfolios') => {
    const title = form.getValues('title');
    console.log(
      `[usePortfolioForm] ▶ processUpload dipanggil | file: "${file.name}" | folder: "${folder}" | title: "${title || '(kosong)'}"`
    );

    // Paksa ganti nama file sesuai judul portfolio saat ini
    let fileToUpload = file;
    if (title) {
      const sanitizedTitle = title.replace(/\s+/g, '-').toLowerCase();
      fileToUpload = new File([file], `${sanitizedTitle}-cover.webp`, { type: 'image/webp' });
      console.log(`[usePortfolioForm] 📝 File direname menjadi: ${fileToUpload.name}`);
    }

    setIsUploading(true);
    console.log('[usePortfolioForm] 🔄 isUploading → true (cover)');
    try {
      // Upload cover via API Route agar handler selalu fresh setiap request
      console.log(`[usePortfolioForm] 🚀 Memanggil /api/upload...`);
      const result = await uploadCoverViaApi(fileToUpload, folder);
      console.log(`[usePortfolioForm] 📥 Hasil upload cover:`, result);
      if (result.success && result.url) {
        onNewUpload(result.url); // Register untuk tracking
        setIsDirectUpload(true);
        form.setValue('cover', result.url, { shouldValidate: true });
        console.log(`[usePortfolioForm] ✅ Cover berhasil diupload: ${result.url}`);
        toast.success('Gambar berhasil diunggah.');
      } else {
        console.error(`[usePortfolioForm] ❌ Server mengembalikan error:`, result.error);
        toast.error(result.error || 'Gagal mengunggah gambar.');
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Error tidak diketahui';
      console.error(`[usePortfolioForm] ❌ ERROR di processUpload:`, error);
      toast.error(`Gagal mengunggah cover: ${errMsg}`);
    } finally {
      // Pastikan state loading selalu di-reset meskipun terjadi error
      setIsUploading(false);
      console.log('[usePortfolioForm] 🔄 isUploading → false (cover finally)');
    }
  };

  const handleRemoveImage = async () => {
    const currentValue = form.getValues('cover');
    // ... logic to delete if needed
    setIsDirectUpload(false);
    form.setValue('cover', '');
  };

  const handleDrop = async (file: File, folder: string = 'portfolios') => {
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar.');
      return;
    }

    // Set temp filename from original file name
    const originalName = file.name.split('.')[0].replace(/\s+/g, '-').toLowerCase();
    setTempFileName(`${originalName}-cover`);

    const reader = new FileReader();
    reader.onload = () => {
      setCropperImageSrc(reader.result as string);
      setIsCropperOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCroppedImage = (croppedFile: File, folder: string = 'portfolios') => {
    processUpload(croppedFile, folder);
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
    onNewUpload,
    handleRemoveImage,
    tempFileName,
    submitMutation,
    deleteMutation,
  };
};
