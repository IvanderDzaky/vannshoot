import { z } from 'zod';

export const portfolioSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi'),
  description: z.string().max(1000, 'Maksimal 1000 karakter').nullable().optional(),
  cover: z.string().nullable().optional(),
  images: z.array(z.string()),
  city: z.string().min(1, 'Kota wajib diisi'),
  hasVideo: z.boolean(),
  videoUrl: z.string().url('URL video tidak valid').or(z.literal('')).nullable().optional(),
  categoryIds: z.array(z.string()),
});

export type PortfolioFormValues = z.infer<typeof portfolioSchema>;
