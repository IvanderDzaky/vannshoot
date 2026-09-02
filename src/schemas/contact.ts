import { z } from 'zod';

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .transform((v) => v.trim()),
  email: z
    .string()
    .email('Alamat email tidak valid')
    .transform((v) => v.trim().toLowerCase()),
  message: z
    .string()
    .min(10, 'Pesan minimal 10 karakter')
    .max(2000, 'Pesan maksimal 2000 karakter')
    .transform((v) => v.trim()),
  // Honeypot anti-spam field (must be empty)
  website: z.string().max(0, 'Bot detected').optional().or(z.literal('')),
});

export type ContactInput = z.infer<typeof contactSchema>;
