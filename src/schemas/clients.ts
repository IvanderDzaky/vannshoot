import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string().min(1, 'Nama klien wajib diisi'),
  description: z.string().max(1000, 'Deskripsi maksimal 1000 karakter').optional(),
  image: z.string().optional(),
  categories: z.array(
    z.object({
      name: z.string().min(1, 'Nama kategori wajib diisi'),
    })
  ),
});
