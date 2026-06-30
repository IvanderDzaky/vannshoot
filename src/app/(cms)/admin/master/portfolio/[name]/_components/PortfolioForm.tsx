'use client';
import type { FC, DragEvent } from 'react';
import { Trash, Loader2 } from 'lucide-react';
import { Controller, useWatch } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';

import { getPortfolioCategories } from '@/services/portfolio-categories';
import type { Portfolio } from '@/interfaces/features/portfolios';
import { usePermission } from '@/providers/PermissionProvider';
import { cn } from '@/lib/utils';
import { slugify } from '@/lib/slugify';
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
import { Switch } from '@/components/ui/switch';
import Heading from '@/components/Common/Heading';
import AlertModal from '@/components/Common/Modals/AlertModal';
import ImageCropperModal from '@/components/Common/Modals/ImageCropperModal';
import { usePortfolioForm } from './usePortfolioForm';
import ImageUpload from './ImageUpload';
import MultiImageUpload from './MultiImageUpload';
import DragOverlay from './DragOverlay';

type Props = {
  initialData: Portfolio | null;
};

const PortfolioForm: FC<Props> = ({ initialData }) => {
  const { hasPermission } = usePermission();
  const {
    form,
    onSubmit,
    onDelete,
    onNewUpload,
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
  } = usePortfolioForm(initialData);

  // Fetch Categories for selection
  const { data: categoriesData } = useQuery({
    queryKey: ['portfolio-categories-all'],
    queryFn: () => getPortfolioCategories(1, 100), // Get first 100 categories
  });

  const categories = categoriesData?.data || [];

  const title = initialData ? 'Ubah Portfolio' : 'Tambah Portfolio';
  const description = initialData ? 'Ubah data portfolio hasil karya.' : 'Tambah portfolio baru';
  const action = initialData ? 'Ubah' : 'Simpan';

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

  const currentTitle = useWatch({
    control: form.control,
    name: 'title',
  });
  const customFileName = currentTitle
    ? `${currentTitle.replace(/\s+/g, '-').toLowerCase()}-cover`
    : tempFileName;

  const targetFolder = currentTitle ? `portfolios/${slugify(currentTitle)}` : 'portfolios/untitled';

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleDrop(file, targetFolder);
  };

  const hasVideo = useWatch({
    control: form.control,
    name: 'hasVideo',
  });

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
        onCrop={(file) => handleCroppedImage(file, targetFolder)}
        aspectRatio={3 / 2}
        customFileName={customFileName}
      />

      <div className="flex items-center justify-between mb-4">
        <Heading title={title} description={description} />
        {initialData && hasPermission('portfolio.delete') && (
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
                      Judul Portfolio <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="Contoh: Website E-Commerce"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="city"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Kota <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      aria-invalid={fieldState.invalid}
                      placeholder="Contoh: Jakarta"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="categoryIds"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Kategori Portfolio</FieldLabel>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {categories.map((category) => {
                        const isSelected = field.value?.includes(category.id);
                        return (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => {
                              const newValue = isSelected
                                ? field.value?.filter((id) => id !== category.id)
                                : [...(field.value || []), category.id];
                              field.onChange(newValue);
                            }}
                            className={cn(
                              'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                              isSelected
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-muted text-muted-foreground border-transparent hover:border-zinc-500'
                            )}
                          >
                            {category.title}
                          </button>
                        );
                      })}
                    </div>
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
                        placeholder="Masukkan deskripsi portfolio"
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

              <div className="space-y-4 pt-4 border-t border-dashed">
                <Controller
                  name="hasVideo"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/30">
                      <div className="space-y-0.5">
                        <FieldLabel className="text-base">Sematkan Video</FieldLabel>
                        <p className="text-[10px] text-muted-foreground">
                          Aktifkan jika portfolio ini memiliki video (YouTube/Vimeo/dsb).
                        </p>
                      </div>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </div>
                  )}
                />

                {hasVideo && (
                  <Controller
                    name="videoUrl"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>URL Video</FieldLabel>
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          aria-invalid={fieldState.invalid}
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                )}
              </div>
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
                    onUpload={(file) => handleCroppedImage(file, targetFolder)}
                    onSelect={field.onChange}
                    onRemove={handleRemoveImage}
                    customFileName={customFileName}
                    disabled={!currentTitle || currentTitle.trim() === ''}
                    disabledMessage="Silakan masukkan Judul Portfolio terlebih dahulu sebelum mengunggah gambar."
                  />
                )}
              />

              <Controller
                name="images"
                control={form.control}
                render={({ field }) => (
                  <MultiImageUpload
                    value={field.value || []}
                    onChange={field.onChange}
                    onNewUpload={onNewUpload}
                    isUploading={isUploading}
                    setIsUploading={setIsUploading}
                    folder={targetFolder}
                    disabled={!currentTitle || currentTitle.trim() === ''}
                    disabledMessage="Silakan masukkan Judul Portfolio terlebih dahulu sebelum mengunggah gambar."
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

export default PortfolioForm;
