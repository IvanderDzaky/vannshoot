import * as z from 'zod';

export const renameSchema = z.object({
  name: z.string().min(1, 'Nama tidak boleh kosong').max(255),
});

export const moveSchema = z.object({
  folder: z.string().min(1, 'Pilih folder tujuan'),
});

export const createFolderSchema = z.object({
  name: z.string().min(1, 'Nama folder tidak boleh kosong').max(255),
});
