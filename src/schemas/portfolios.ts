import { z } from 'zod';

export const portfolioSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi'),
  description: z.string().max(1000, 'Maksimal 1000 karakter').nullable().optional(),
  cover: z.string().nullable().optional(),
  images: z.array(z.string()),
  city: z.string().min(1, 'Kota wajib diisi'),
  location: z.string().min(1, 'Lokasi wajib diisi').nullable().optional(),
  categoryIds: z.array(z.string()),
  price: z.number().min(0, 'Harga harus positif atau 0').nullable().optional(),
});

export type PortfolioFormValues = z.infer<typeof portfolioSchema>;
