'use client';
import type { FC } from 'react';
import { Trash, Loader2 } from 'lucide-react';
import { Controller } from 'react-hook-form';
import Link from 'next/link';

import type { Permission } from '@/interfaces/features/permissions';
import { usePermission } from '@/providers/PermissionProvider';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Heading from '@/components/Common/Heading';
import AlertModal from '@/components/Common/Modals/AlertModal';

import { usePermissionForm } from './usePermissionForm';
import PermissionPreview from './PermissionPreview';

type Props = {
  initialData: Permission | null;
};

const PermissionForm: FC<Props> = ({ initialData }) => {
  const { hasPermission } = usePermission();
  const {
    form,
    nameValue,
    isCrudMode,
    onSubmit,
    onDelete,
    isAlertOpen,
    setIsAlertOpen,
    submitMutation,
    deleteMutation,
  } = usePermissionForm(initialData);

  const title = initialData ? 'Ubah Hak Akses' : 'Tambah Hak Akses';
  const description = initialData ? 'Ubah data hak akses.' : 'Tambah hak akses baru';
  const action = initialData ? 'Ubah' : 'Simpan';

  return (
    <section>
      <AlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={onDelete}
        loading={deleteMutation.isPending}
      />
      <div className="flex items-center justify-between mb-4">
        <Heading title={title} description={description} />
        {initialData && hasPermission('permission.delete') && (
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 mt-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            {!initialData && (
              <div className="flex items-center space-x-2 bg-sidebar p-4 rounded-xl border">
                <Switch
                  id="crud-mode"
                  checked={!!isCrudMode}
                  onCheckedChange={(checked) => {
                    form.setValue('isCrudMode', checked);
                    if (checked) {
                      const currentName = form.getValues('name');
                      const parts = currentName.split('.');
                      if (parts.length > 1) {
                        const lastPart = parts[parts.length - 1];
                        const actions = ['read', 'create', 'update', 'delete', 'access'];
                        if (actions.includes(lastPart)) {
                          form.setValue('name', parts.slice(0, -1).join('.'));
                        }
                      }
                    }
                  }}
                />

                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="crud-mode"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Mode Pembuatan CRUD
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Otomatis membuat 5 hak akses (read, create, update, delete).
                  </p>
                </div>
              </div>
            )}

            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      {isCrudMode ? 'Nama Modul' : 'Nama Hak Akses'}{' '}
                      <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder={isCrudMode ? 'Contoh: user' : 'Contoh: user.create'}
                      autoComplete="off"
                    />
                    <FieldDescription>
                      {isCrudMode
                        ? 'Masukkan nama modul saja (contoh: user atau master.user).'
                        : 'Gunakan pola modul.aksi (contoh: user.create atau master.user.create).'}
                    </FieldDescription>
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
                        aria-invalid={fieldState.invalid}
                        placeholder="Masukkan deskripsi"
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
                    <FieldDescription>Isi deskripsi untuk hak akses ini.</FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          <div className="space-y-6">
            <PermissionPreview nameValue={nameValue || ''} isCrudMode={!!isCrudMode} />
          </div>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <Button
            disabled={submitMutation.isPending || deleteMutation.isPending}
            variant={'outline'}
            type="button"
            asChild
          >
            <Link href={'/admin/managements/permissions'}>Kembali</Link>
          </Button>
          <Button
            disabled={
              submitMutation.isPending ||
              deleteMutation.isPending ||
              !form.formState.isValid ||
              (initialData
                ? !hasPermission('permission.update')
                : !hasPermission('permission.create'))
            }
            type="submit"
          >
            {submitMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

export default PermissionForm;
