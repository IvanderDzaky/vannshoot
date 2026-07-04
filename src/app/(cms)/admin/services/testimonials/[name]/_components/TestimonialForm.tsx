'use client';

import { type FC } from 'react';
import { Trash, Loader2 } from 'lucide-react';
import { Controller } from 'react-hook-form';

import type { Testimonial } from '@/interfaces/features/testimonial';
import { usePermission } from '@/providers/PermissionProvider';
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
import { useTestimonialForm } from './useTestimonialForm';
import PortfolioPicker from './PortfolioPicker';

type Props = {
  initialData: Testimonial | null;
};

const TestimonialForm: FC<Props> = ({ initialData }) => {
  const { hasPermission } = usePermission();
  const {
    form,
    onSubmit,
    onDelete,
    handleBack,
    isAlertOpen,
    setIsAlertOpen,
    submitMutation,
    deleteMutation,
  } = useTestimonialForm(initialData);

  const title = initialData ? 'Ubah Testimonial' : 'Tambah Testimonial';
  const description = initialData ? 'Ubah data testimonial pelanggan.' : 'Tambah testimonial baru';
  const action = initialData ? 'Ubah' : 'Simpan';

  return (
    <section className="relative min-h-[calc(100vh-200px)] max-w-4xl">
      <AlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={onDelete}
        loading={deleteMutation.isPending}
      />

      <div className="flex items-center justify-between mb-4">
        <Heading title={title} description={description} />
        {initialData && hasPermission('testimonial.delete') && (
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

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-5 pb-10">
        <FieldGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="client"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Nama Client <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Contoh: Budi Sudarsono"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="redirect"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Link Portfolio</FieldLabel>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <PortfolioPicker
                        onSelect={(url) => field.onChange(url)}
                        currentUrl={field.value || ''}
                      />
                      {field.value && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="shrink-0"
                          onClick={() => field.onChange('')}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <Input
                      {...field}
                      value={field.value || ''}
                      aria-invalid={fieldState.invalid}
                      placeholder="Belum ada link terpilih"
                      readOnly
                      disabled
                    />
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="location"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Lokasi <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Contoh: CEO of Tech"
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
                    aria-invalid={fieldState.invalid}
                    placeholder="Contoh: Jakarta"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <Controller
            name="testimony"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Testimonial <span className="text-red-600">*</span>
                </FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Masukkan testimonial pelanggan"
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

        <div className="flex items-center gap-2 justify-end pt-6">
          <Button
            disabled={submitMutation.isPending}
            variant="outline"
            type="button"
            onClick={handleBack}
          >
            Kembali
          </Button>
          <Button
            disabled={submitMutation.isPending || !form.formState.isValid}
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

export default TestimonialForm;
