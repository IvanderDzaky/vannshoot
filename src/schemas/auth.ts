import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Format email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
});
