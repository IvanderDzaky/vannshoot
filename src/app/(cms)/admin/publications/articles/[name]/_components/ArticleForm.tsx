'use client';
import type { FC, DragEvent } from 'react';
import { Trash, Loader2 } from 'lucide-react';
import { Controller, useWatch } from 'react-hook-form';

import type { Article } from '@/interfaces/features/articles';
import { usePermission } from '@/providers/PermissionProvider';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/Common/Heading';
import AlertModal from '@/components/Common/Modals/AlertModal';
import ImageCropperModal from '@/components/Common/Modals/ImageCropperModal';
import { useArticleForm } from './useArticleForm';
import ImageUpload from './ImageUpload';
import CategorySelection from './CategorySelection';
import DragOverlay from './DragOverlay';
import RichTextEditor from '@/components/Common/RichTextEditor';
import { slugify } from '@/lib/slugify';

type Props = {
  initialData: Article | null;
};

const ArticleForm: FC<Props> = ({ initialData }) => {
  const { hasPermission } = usePermission();
  const {
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
  } = useArticleForm(initialData);

  const title = initialData ? 'Ubah Artikel' : 'Tambah Artikel';
  const description = initialData ? 'Ubah data artikel.' : 'Tambah artikel baru';
  const action = initialData ? 'Ubah' : 'Simpan';

  const currentTitle = useWatch({
    control: form.control,
    name: 'title',
  });
  const customFileName = currentTitle ? `${slugify(currentTitle)}-cover` : tempFileName;

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    // Only trigger dragging state if files are being dragged
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
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
        aspectRatio={16 / 9}
        customFileName={customFileName}
      />

      <div className="flex items-center justify-between mb-4">
        <Heading title={title} description={description} />
        {initialData && hasPermission('article.delete') && (
          <Button
            disabled={submitMutation.isPending || deleteMutation.isPending}
            variant="destructive"
            size="sm"
            onClick={() => setIsAlertOpen(true)}
          >
            <Trash className="h-4 w-4" />
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
                      Judul Artikel <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="Contoh: Manfaat Vannshoot CMS untuk Bisnis"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="content"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Konten <span className="text-red-600">*</span>
                    </FieldLabel>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Masukkan konten artikel"
                      folderName={initialData ? slugify(initialData.title) : 'untitled'}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

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
                    disabledMessage="Silakan masukkan Judul Artikel terlebih dahulu sebelum mengunggah gambar."
                  />
                )}
              />
            </FieldGroup>
          </div>

          <div className="space-y-8">
            <CategorySelection control={form.control} />
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
            className="px-8 min-w-[120px]"
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

export default ArticleForm;
