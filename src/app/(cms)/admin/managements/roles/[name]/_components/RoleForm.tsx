'use client';
import type { FC } from 'react';
import { Trash } from 'lucide-react';
import { Controller } from 'react-hook-form';
import Link from 'next/link';

import type { Role } from '@/interfaces/features/roles';
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
import Heading from '@/components/Common/Heading';
import AlertModal from '@/components/Common/Modals/AlertModal';

import { useRoleForm } from './useRoleForm';
import PermissionGrid from './PermissionGrid';

type Props = {
  initialData: Role | null;
};

const RoleForm: FC<Props> = ({ initialData }) => {
  const { hasPermission } = usePermission();
  const {
    form,
    allPermissions,
    onSubmit,
    onDelete,
    isAlertOpen,
    setIsAlertOpen,
    submitMutation,
    deleteMutation,
  } = useRoleForm(initialData);

  const title = initialData ? 'Ubah Jabatan' : 'Tambah Jabatan';
  const description = initialData ? 'Ubah data jabatan.' : 'Tambah jabatan baru';
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
        {initialData && hasPermission('role.delete') && (
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
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Nama Jabatan <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="Masukkan nama jabatan"
                      autoComplete="off"
                    />
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
                    <FieldDescription>Isi deskripsi untuk jabatan ini.</FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          <div className="space-y-6">
            <PermissionGrid
              control={form.control}
              allPermissions={allPermissions}
              initialRoleName={initialData?.name}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 justify-end pt-6">
          <Button
            disabled={submitMutation.isPending || deleteMutation.isPending}
            variant={'outline'}
            type="button"
            asChild
          >
            <Link href={'/admin/managements/roles'}>Kembali</Link>
          </Button>
          <Button
            disabled={
              submitMutation.isPending || deleteMutation.isPending || !form.formState.isValid
            }
            type="submit"
            className="px-8"
          >
            {action}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default RoleForm;
