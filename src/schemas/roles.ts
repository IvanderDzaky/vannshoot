import { z } from 'zod';

export const roleSchema = z.object({
  name: z
    .string()
    .min(3, 'Nama jabatan minimal 3 karakter')
    .max(50, 'Nama jabatan maksimal 50 karakter'),
  description: z
    .string()
    .max(1000, 'Deskripsi maksimal 1000 karakter')
    .optional()
    .or(z.literal('')),
  permissions: z.array(z.string()),
});
