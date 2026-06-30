import { z } from 'zod';

export const orderSettingSchema = z.object({
  serviceCharge: z.boolean(),
  serviceType: z.enum(['FIXED', 'PERCENTAGE']),
  value: z.number().min(0, 'Nilai biaya harus positif atau 0').nullable().optional(),
});

export type OrderSettingFormValues = z.infer<typeof orderSettingSchema>;
