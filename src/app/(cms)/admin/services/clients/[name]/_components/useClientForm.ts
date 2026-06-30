'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';

import type { Client } from '@/interfaces/features/clients';
import {
  createClient,
  deleteClientById,
  updateClientById,
  type ClientValues,
} from '@/services/clients';
import { deleteImage, uploadImage } from '@/services/uploads';
import { clientSchema } from '@/schemas/clients';

export const useClientForm = (initialData: Client | null) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isDirectUpload, setIsDirectUpload] = useState(false);

  // Cropper state
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [cropperImageSrc, setCropperImageSrc] = useState<string | null>(null);
  const [tempFileName, setTempFileName] = useState<string>('client-logo');

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const form = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      image: initialData?.image || '',
      categories: initialData?.categories?.map((cat) => ({ name: cat.name })) || [],
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: ClientValues) => {
      return initialData ? await updateClientById(initialData.id, data) : await createClient(data);
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        setUploadedFiles([]); // Kosongkan tracking karena sudah resmi disimpan
        queryClient.invalidateQueries({ queryKey: ['clients'] });
        router.push('/admin/services/clients');
        router.refresh();
      } else {
        toast.error(result.error);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteClientById(id),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['clients'] });
        router.push('/admin/services/clients');
        router.refresh();
      } else {
        toast.error(result.error);
      }
    },
  });

  const onSubmit = (data: ClientValues) => submitMutation.mutate(data);

  const onDelete = () => {
    if (!initialData) return;
    deleteMutation.mutate(initialData.id);
  };

  const handleBack = async () => {
    if (uploadedFiles.length > 0) {
      const toastId = toast.loading('Membersihkan file sementara...');
      try {
        for (const url of uploadedFiles) {
          if (url !== initialData?.image) {
            await deleteImage(url);
          }
        }
        setUploadedFiles([]);
        toast.success('Penyimpanan dibersihkan', { id: toastId });
      } catch (error) {
        toast.error('Gagal membersihkan beberapa file', { id: toastId });
      }
    }
    router.push('/admin/services/clients');
  };

  const processUpload = async (file: File) => {
    const currentValue = form.getValues('image');
    const name = form.getValues('name');

    // Paksa ganti nama file sesuai nama klien saat ini
    let fileToUpload = file;
    if (name) {
      const sanitizedName = name.replace(/\s+/g, '-').toLowerCase();
      fileToUpload = new File([file], `${sanitizedName}-logo.webp`, { type: 'image/webp' });
    }

    setIsUploading(true);
    try {
      const result = await uploadImage(fileToUpload, 'clients');
      if (result.success && result.url) {
        // Register untuk tracking
        setUploadedFiles((prev) => [...prev, result.url!]);

        setIsDirectUpload(true);
        form.setValue('image', result.url, { shouldValidate: true });
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
    const currentValue = form.getValues('image');

    if (
      isDirectUpload &&
      currentValue &&
      currentValue !== initialData?.image &&
      currentValue.includes('/clients/')
    ) {
      await deleteImage(currentValue);
    }

    setIsDirectUpload(false);
    form.setValue('image', '');
  };

  const handleDrop = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar.');
      return;
    }

    // Set temp filename from original file name
    const originalName = file.name.split('.')[0].replace(/\s+/g, '-').toLowerCase();
    setTempFileName(`${originalName}-logo`);

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
