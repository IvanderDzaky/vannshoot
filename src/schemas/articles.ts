import { z } from 'zod';

export const articleSchema = z.object({
  title: z.string().min(1, 'Judul artikel wajib diisi'),
  content: z.string().min(1, 'Konten artikel wajib diisi'),
  cover: z.string().optional(),
  categories: z.array(
    z.object({
      name: z.string().min(1, 'Nama kategori wajib diisi'),
    })
  ),
});
