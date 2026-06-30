import { z } from 'zod';

export const testimonialSchema = z.object({
  client: z.string().min(1, 'Client name is required'),
  testimony: z
    .string()
    .min(1, 'Testimony is required')
    .max(1000, 'Testimonial maksimal 1000 karakter'),
  location: z.string().min(1, 'Location is required'),
  city: z.string().min(1, 'City is required'),
  cover: z.string().nullable().optional(),
  redirect: z.string().nullable().optional(),
});

export type TestimonialFormValues = z.infer<typeof testimonialSchema>;
