import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(3, {
    message: 'Nama minimal 3 karakter.',
  }),
  email: z.string().email({
    message: 'Email tidak valid.',
  }),
  password: z
    .string()
    .min(8, {
      message: 'Password minimal 8 karakter.',
    })
    .optional()
    .or(z.literal('')),
  newPassword: z
    .string()
    .min(8, {
      message: 'Password baru minimal 8 karakter.',
    })
    .optional()
    .or(z.literal('')),
  roleId: z.string().min(1, {
    message: 'Jabatan harus dipilih.',
  }),
  image: z.string().optional().nullable(),
});
