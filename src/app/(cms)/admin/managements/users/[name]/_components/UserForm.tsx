'use client';
import type { FC } from 'react';
import { Trash } from 'lucide-react';
import { Controller } from 'react-hook-form';
import Link from 'next/link';

import type { User } from '@/interfaces/features/users';
import { usePermission } from '@/providers/PermissionProvider';
import { useSession } from '@/lib/authClient';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/Common/Heading';
import AlertModal from '@/components/Common/Modals/AlertModal';

import { useUserForm } from './useUserForm';
import RoleSelect from './RoleSelect';

type Props = {
  initialData: User | null;
};

interface ExtendedUser {
  id: string;
  roleId?: string | null;
  role?: string | null;
  roles?: { id: string; name: string }[];
}

const UserForm: FC<Props> = ({ initialData }) => {
  const { hasPermission, hasRole } = usePermission();
  const { data: session } = useSession();
  const {
    form,
    roles,
    onSubmit,
    onDelete,
    isAlertOpen,
    setIsAlertOpen,
    submitMutation,
    deleteMutation,
  } = useUserForm(initialData);

  const currentUser = session?.user as ExtendedUser | undefined;
  const isSelf = currentUser?.id === initialData?.id;
  const isTargetSuperAdmin = initialData?.roles?.some(
    (role) => role.name.toLowerCase() === 'superadmin'
  );
  const isCurrentUserSuperAdmin = hasRole('superadmin');

  const canDelete = !isSelf && (isCurrentUserSuperAdmin || !isTargetSuperAdmin);
  const canEdit = !initialData || isSelf || isCurrentUserSuperAdmin || !isTargetSuperAdmin;

  const title = initialData ? 'Ubah Pengguna' : 'Tambah Pengguna';
  const description = initialData ? 'Ubah data pengguna.' : 'Tambah pengguna baru';
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
        {initialData && hasPermission('user.delete') && canDelete && (
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full md:max-w-1/2 mt-5">
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Nama Lengkap <span className="text-red-600">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="Masukkan nama lengkap"
                  autoComplete="name"
                  disabled={!canEdit}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Email <span className="text-red-600">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  type="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="Masukkan alamat email"
                  autoComplete="email"
                  disabled={!!initialData}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {!initialData && (
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Kata Sandi <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Masukkan kata sandi"
                    autoComplete="new-password"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          )}

          {initialData && isCurrentUserSuperAdmin && (
            <Controller
              name="newPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Reset Kata Sandi</FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Kosongkan jika tidak ingin mengubah"
                    autoComplete="new-password"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          )}

          <RoleSelect
            control={form.control}
            roles={roles}
            isCurrentUserSuperAdmin={isCurrentUserSuperAdmin}
            disabled={!canEdit}
          />
        </FieldGroup>
        <div className="flex items-center gap-2 justify-end pt-6">
          <Button disabled={submitMutation.isPending} variant={'outline'} type="button" asChild>
            <Link href={'/admin/managements/users'}>Kembali</Link>
          </Button>
          {canEdit ? (
            <Button
              disabled={submitMutation.isPending || !form.formState.isValid}
              type="submit"
              className="px-8"
            >
              {action}
            </Button>
          ) : (
            <Button disabled variant="outline" type="button" className="px-8">
              Tidak diizinkan
            </Button>
          )}
        </div>
      </form>
    </section>
  );
};

export default UserForm;
