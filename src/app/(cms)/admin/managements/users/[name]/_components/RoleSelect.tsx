'use client';
import type { FC } from 'react';
import { Controller, type Control } from 'react-hook-form';
import { z } from 'zod';

import { userSchema } from '@/schemas/users';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type RoleSelectProps = {
  control: Control<z.infer<typeof userSchema>>;
  roles: { id: string; name: string }[];
  isCurrentUserSuperAdmin: boolean;
  disabled?: boolean;
};

const RoleSelect: FC<RoleSelectProps> = ({ control, roles, isCurrentUserSuperAdmin, disabled }) => {
  return (
    <Controller
      name="roleId"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>
            Jabatan <span className="text-red-600">*</span>
          </FieldLabel>
          <Select onValueChange={field.onChange} value={field.value || ''} disabled={disabled}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih jabatan" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem
                  key={role.id}
                  value={role.id}
                  disabled={!isCurrentUserSuperAdmin && role.name.toLowerCase() === 'superadmin'}
                >
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default RoleSelect;
