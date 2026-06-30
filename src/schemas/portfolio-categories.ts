import * as z from 'zod';

export const portfolioCategorySchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi'),
  description: z.string().max(1000, 'Deskripsi maksimal 1000 karakter').optional().nullable(),
  cover: z.string().optional().nullable(),
});

export type PortfolioCategoryFormValues = z.infer<typeof portfolioCategorySchema>;
