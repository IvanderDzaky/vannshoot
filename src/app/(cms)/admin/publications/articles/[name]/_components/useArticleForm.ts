'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';

import type { Article } from '@/interfaces/features/articles';
import {
  createArticle,
  deleteArticleById,
  updateArticleById,
  type ArticleValues,
} from '@/services/articles';
import { deleteImage, deleteUploadDir, renameUploadDir, uploadImage } from '@/services/uploads';
import { articleSchema } from '@/schemas/articles';
import { slugify } from '@/lib/slugify';

export const useArticleForm = (initialData: Article | null) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isDirectUpload, setIsDirectUpload] = useState(false);

  // Cropper state
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [cropperImageSrc, setCropperImageSrc] = useState<string | null>(null);
  const [tempFileName, setTempFileName] = useState<string>('article-cover');

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const form = useForm<z.infer<typeof articleSchema>>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      cover: initialData?.cover || '',
      categories: initialData?.articleCategories?.map((cat) => ({ name: cat.name })) || [],
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: ArticleValues) => {
      return initialData
        ? await updateArticleById(initialData.id, data)
        : await createArticle(data);
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        setUploadedFiles([]); // Kosongkan tracking karena sudah resmi disimpan
        queryClient.invalidateQueries({ queryKey: ['articles'] });
        router.push('/admin/publications/articles');
        router.refresh();
      } else {
        toast.error(result.error);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteArticleById(id),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['articles'] });
        router.push('/admin/publications/articles');
        router.refresh();
      } else {
        toast.error(result.error);
      }
    },
  });

  const onSubmit = async (values: z.infer<typeof articleSchema>) => {
    const newSlug = slugify(values.title);
    let finalContent = values.content;
    let finalCover = values.cover;

    // Transition from 'untitled' to actual article slug if needed
    if (!initialData || initialData.title !== values.title) {
      if (values.content.includes('/articles/untitled/')) {
        const renameResult = await renameUploadDir('articles/untitled', `articles/${newSlug}`);
        if (renameResult.success) {
          finalContent = values.content.replace(/\/articles\/untitled\//g, `/articles/${newSlug}/`);
          if (values.cover && values.cover.includes('/articles/untitled/')) {
            finalCover = values.cover.replace(/\/articles\/untitled\//g, `/articles/${newSlug}/`);
          }
        }
      }
    }

    submitMutation.mutate({
      ...values,
      content: finalContent,
      cover: finalCover,
    } as ArticleValues);
  };

  const onDelete = () => {
    if (!initialData) return;
    deleteMutation.mutate(initialData.id);
  };

  const handleBack = async () => {
    if (uploadedFiles.length > 0 || !initialData) {
      const toastId = toast.loading('Membersihkan file sementara...');
      try {
        // Hapus semua file cover yang sempat diunggah di sesi ini
        for (const url of uploadedFiles) {
          if (url !== initialData?.cover) {
            await deleteImage(url);
          }
        }

        // Hapus folder untitled jika artikel baru
        if (!initialData) {
          await deleteUploadDir('articles/untitled');
        }

        setUploadedFiles([]);
        toast.success('Penyimpanan dibersihkan', { id: toastId });
      } catch (error) {
        toast.error('Gagal membersihkan beberapa file', { id: toastId });
      }
    }

    router.push('/admin/publications/articles');
  };

  const processUpload = async (file: File) => {
    const currentValue = form.getValues('cover');
    const title = form.getValues('title');

    // Paksa ganti nama file sesuai judul artikel saat ini
    let fileToUpload = file;
    if (title) {
      const sanitizedName = slugify(title);
      fileToUpload = new File([file], `${sanitizedName}-cover.webp`, { type: 'image/webp' });
    }

    setIsUploading(true);
    try {
      const subDir = initialData ? `articles/${slugify(initialData.title)}` : 'articles/untitled';
      const result = await uploadImage(fileToUpload, subDir);
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

  const handleRemoveImage = async () => {
    const currentValue = form.getValues('cover');

    if (
      isDirectUpload &&
      currentValue &&
      currentValue !== initialData?.cover &&
      currentValue.includes('/articles/')
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
    const originalName = slugify(file.name.split('.')[0]);
    setTempFileName(`${originalName}-cover`);

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
  };
};
