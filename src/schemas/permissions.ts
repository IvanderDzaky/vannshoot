import { z } from 'zod';

export const permissionSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Nama hak akses minimal 3 karakter')
      .max(50, 'Nama hak akses maksimal 50 karakter'),
    description: z
      .string()
      .max(1000, 'Deskripsi maksimal 1000 karakter')
      .optional()
      .or(z.literal('')),
    isCrudMode: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    const isCrud = !!data.isCrudMode;
    const name = data.name;

    if (isCrud) {
      if (!/^[a-z]+(\.[a-z]+)*$/.test(name)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Nama modul tidak valid (gunakan pola: modul atau modul.submodul)',
          path: ['name'],
        });
      }
    } else {
      const parts = name.split('.');
      const lastPart = parts[parts.length - 1];
      const validActions = ['read', 'create', 'update', 'delete', 'access'];

      if (!/^[a-z]+(\.[a-z]+)+$/.test(name) || !validActions.includes(lastPart)) {
        ctx.addIssue({
          code: 'custom',
          message:
            'Nama hak akses tidak valid. Pastikan menggunakan pola modul.aksi (contoh: user.read) dan diakhiri dengan aksi yang valid (read, create, update, delete, access).',
          path: ['name'],
        });
      }
    }
  });
