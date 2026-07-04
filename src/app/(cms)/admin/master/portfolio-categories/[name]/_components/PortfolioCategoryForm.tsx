'use client';
import type { FC, DragEvent } from 'react';
import { Trash, Loader2 } from 'lucide-react';
import { Controller, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import type { PortfolioCategory } from '@/interfaces/features/portfolio-categories';
import { usePermission } from '@/providers/PermissionProvider';
import { cn } from '@/lib/utils';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import Heading from '@/components/Common/Heading';
import AlertModal from '@/components/Common/Modals/AlertModal';
import ImageCropperModal from '@/components/Common/Modals/ImageCropperModal';
import { usePortfolioCategoryForm } from './usePortfolioCategoryForm';
import ImageUpload from './ImageUpload';
import DragOverlay from './DragOverlay';

type Props = {
  initialData: PortfolioCategory | null;
};

const PortfolioCategoryForm: FC<Props> = ({ initialData }) => {
  const { hasPermission } = usePermission();
  const {
    form,
    onSubmit,
    onDelete,
    handleBack,
    handleDrop,
    isUploading,
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
  } = usePortfolioCategoryForm(initialData);

  const title = initialData ? 'Ubah Kategori' : 'Tambah Kategori';
  const description = initialData
    ? 'Ubah data kategori portfolio.'
    : 'Tambah kategori portfolio baru';
  const action = initialData ? 'Ubah' : 'Simpan';

  const currentTitle = useWatch({
    control: form.control,
    name: 'title',
  });
  const customFileName = currentTitle
    ? `${currentTitle.replace(/\s+/g, '-').toLowerCase()}-cropped`
    : tempFileName;

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    if (
      e.clientX <= rect.left ||
      e.clientX >= rect.right ||
      e.clientY <= rect.top ||
      e.clientY >= rect.bottom
    ) {
      setIsDragging(false);
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleDrop(file);
  };

  const isProtected =
    initialData?.title?.toLowerCase().includes('graduation') ||
    initialData?.title?.toLowerCase().includes('kelulusan') ||
    currentTitle?.toLowerCase().includes('graduation') ||
    currentTitle?.toLowerCase().includes('kelulusan');

  return (
    <section
      className="relative min-h-[calc(100vh-200px)] group/dropzone"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <DragOverlay isDragging={isDragging} isReplacing={!!form.getValues('cover')} />

      <AlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={onDelete}
        loading={deleteMutation.isPending}
      />

      <ImageCropperModal
        isOpen={isCropperOpen}
        onClose={() => setIsCropperOpen(false)}
        imageSrc={cropperImageSrc}
        onCrop={handleCroppedImage}
        aspectRatio={3 / 2}
        customFileName={customFileName}
      />

      <div className="flex items-center justify-between mb-4">
        <Heading title={title} description={description} />
        {initialData && hasPermission('portfolio.category.delete') && (
          <Button
            disabled={submitMutation.isPending || deleteMutation.isPending}
            variant="destructive"
            size="sm"
            onClick={() => {
              if (isProtected) {
                toast.info(
                  'Kategori ini dilindungi karena memiliki layout khusus di frontend dan tidak dapat dihapus.'
                );
              } else {
                setIsAlertOpen(true);
              }
            }}
          >
            <Trash className={cn('h-4 w-4', isProtected && 'opacity-50')} />
          </Button>
        )}
      </div>

      <Separator />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 mt-5 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            <FieldGroup>
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Nama Kategori <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      disabled={!!initialData && isProtected}
                      aria-invalid={fieldState.invalid}
                      placeholder="Contoh: Web Design"
                    />
                    {initialData && isProtected && (
                      <p className="text-xs text-muted-foreground">
                        Nama kategori graduation/kelulusan dikunci.
                      </p>
                    )}
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Deskripsi</FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        value={field.value ?? ''}
                        aria-invalid={fieldState.invalid}
                        placeholder="Masukkan deskripsi kategori"
                        rows={6}
                        className="min-h-24 resize-none"
                        maxLength={1000}
                      />
                      <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums">
                          {(field.value ?? '').length}/1000 karakter
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          <div className="space-y-8">
            <FieldGroup>
              <Controller
                name="cover"
                control={form.control}
                render={({ field }) => (
                  <ImageUpload
                    value={field.value || ''}
                    isUploading={isUploading}
                    onUpload={handleCroppedImage}
                    onSelect={field.onChange}
                    onRemove={handleRemoveImage}
                    customFileName={customFileName}
                    disabled={!currentTitle || currentTitle.trim() === ''}
                    disabledMessage="Silakan masukkan Nama Kategori terlebih dahulu sebelum mengunggah gambar."
                  />
                )}
              />
            </FieldGroup>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-end pt-6 mt-10">
          <Button
            disabled={submitMutation.isPending || isUploading}
            variant="outline"
            type="button"
            onClick={handleBack}
          >
            Kembali
          </Button>
          <Button
            disabled={submitMutation.isPending || isUploading || !form.formState.isValid}
            type="submit"
            className="px-8 min-w-30"
          >
            {submitMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {initialData ? 'Mengubah...' : 'Menyimpan...'}
              </>
            ) : (
              action
            )}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default PortfolioCategoryForm;
