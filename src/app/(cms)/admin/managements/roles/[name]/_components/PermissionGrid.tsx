'use client';
import type { FC } from 'react';
import { Controller, type Control } from 'react-hook-form';
import { z } from 'zod';

import type { Permission } from '@/interfaces/features/permissions';
import { roleSchema } from '@/schemas/roles';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Heading from '@/components/Common/Heading';

type PermissionGridProps = {
  control: Control<z.infer<typeof roleSchema>>;
  allPermissions: Permission[];
  initialRoleName?: string;
};

const PermissionGrid: FC<PermissionGridProps> = ({ control, allPermissions, initialRoleName }) => {
  // Group permissions by category (a.b -> a is category, a.b.c -> a.b is category)
  const groupedPermissions = allPermissions.reduce(
    (acc: Record<string, Permission[]>, permission) => {
      const parts = permission.name.split('.');
      const category = parts.length > 1 ? parts.slice(0, -1).join('.') : 'global';
      if (!acc[category]) acc[category] = [];
      acc[category].push(permission);
      return acc;
    },
    {}
  );

  const protectedPermissions = [
    'admin.access',
    'permission.create',
    'permission.update',
    'permission.delete',
    'permission.read',
    'role.create',
    'role.update',
    'role.delete',
    'role.read',
  ];

  return (
    <div className="bg-sidebar p-6 rounded-2xl border space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <Heading title="Hak Akses" description="Pilih hak akses yang diberikan untuk jabatan ini" />

        <Controller
          name="permissions"
          control={control}
          render={({ field }) => {
            const isSuperAdminRole = initialRoleName?.toLowerCase() === 'superadmin';
            const allSelected = field.value?.length === allPermissions.length;

            const handleToggleAll = (checked: boolean) => {
              if (checked) {
                // Select all
                field.onChange(allPermissions.map((p) => p.id));
              } else {
                // Deselect all, but keep protected ones if superadmin
                if (isSuperAdminRole) {
                  const protectedIds = allPermissions
                    .filter((p) => protectedPermissions.includes(p.name))
                    .map((p) => p.id);
                  field.onChange(protectedIds);
                } else {
                  field.onChange([]);
                }
              }
            };

            return (
              <div className="flex items-center gap-2">
                <Switch id="select-all" checked={allSelected} onCheckedChange={handleToggleAll} />
                <Label htmlFor="select-all" className="cursor-pointer font-semibold text-sm">
                  Pilih Semua
                </Label>
              </div>
            );
          }}
        />
      </div>

      <Controller
        name="permissions"
        control={control}
        render={({ field }) => {
          const isSuperAdminRole = initialRoleName?.toLowerCase() === 'superadmin';

          return (
            <div className="space-y-6">
              {Object.keys(groupedPermissions).map((category) => (
                <div key={category} className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    {category.replace(/\./g, ' ')}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
                    {groupedPermissions[category].map((permission: Permission) => {
                      const isProtected =
                        isSuperAdminRole && protectedPermissions.includes(permission.name);

                      return (
                        <label
                          key={permission.id}
                          className={`flex items-start gap-3 transition-colors ${
                            isProtected ? 'cursor-not-allowed opacity-70' : 'cursor-pointer group'
                          }`}
                        >
                          <div className="mt-0.5">
                            <Checkbox
                              checked={field.value?.includes(permission.id)}
                              disabled={isProtected}
                              onCheckedChange={(checked) => {
                                const newValue = checked
                                  ? [...(field.value || []), permission.id]
                                  : field.value?.filter((id: string) => id !== permission.id);
                                field.onChange(newValue);
                              }}
                            />
                          </div>
                          <div className="flex flex-col">
                            <span
                              className={`text-sm font-medium leading-none transition-colors ${
                                !isProtected && 'group-hover:text-primary'
                              }`}
                            >
                              {permission.name.split('.').pop()}
                            </span>

                            {permission.description && (
                              <span className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                                {permission.description}
                              </span>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          );
        }}
      />
    </div>
  );
};

export default PermissionGrid;
