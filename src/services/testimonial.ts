'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { testimonialSchema } from '@/schemas/testimonial';
import { verifyPermission } from './security';
import { deleteImage } from './uploads';

import type {
  Testimonial,
  TestimonialResponse,
  TestimonialPaginationResponse,
} from '@/interfaces/features/testimonial';

const BASE_PATH = '/admin/services/testimonials';

export type TestimonialValues = z.infer<typeof testimonialSchema>;

/**
 * Mengambil data testimonial dengan pagination dan pencarian
 */
export async function getTestimonials(
  page: number = 1,
  limit: number = 10,
  search: string = ''
): Promise<TestimonialPaginationResponse> {
  const hasAccess = await verifyPermission('testimonial.read');
  if (!hasAccess) {
    return {
      success: false,
      data: [],
      meta: { total: 0, page: 1, lastPage: 0 },
      error: 'Anda tidak memiliki hak akses untuk melihat data ini.',
    };
  }

  try {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { client: { contains: search, mode: 'insensitive' as const } },
            { testimony: { contains: search, mode: 'insensitive' as const } },
            { city: { contains: search, mode: 'insensitive' as const } },
            { location: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.testimonial.count({ where }),
    ]);

    return {
      success: true,
      data: data as unknown as Testimonial[],
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Get Testimonials Error:', error);
    return {
      success: false,
      data: [],
      meta: { total: 0, page: 1, lastPage: 0 },
      error: 'Gagal mengambil data testimonial.',
    };
  }
}

/**
 * Mengambil data testimonial berdasarkan ID
 */
export async function getTestimonialById(id: string): Promise<TestimonialResponse> {
  const hasAccess = await verifyPermission('testimonial.read');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses.' };
  }

  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      return { success: false, error: 'Testimonial tidak ditemukan.' };
    }

    return { success: true, data: testimonial as unknown as Testimonial };
  } catch (error) {
    return { success: false, error: 'Gagal mengambil data testimonial.' };
  }
}

/**
 * Membuat Testimonial baru
 */
export async function createTestimonial(values: TestimonialValues): Promise<TestimonialResponse> {
  const hasAccess = await verifyPermission('testimonial.create');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk membuat data.' };
  }

  const validatedFields = testimonialSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, error: 'Input tidak valid.' };
  }

  try {
    const testimonial = await prisma.testimonial.create({
      data: {
        ...validatedFields.data,
        redirect: validatedFields.data.redirect || null,
      },
    });

    revalidatePath(BASE_PATH);
    revalidatePath('/', 'layout');
    return {
      success: true,
      message: 'Testimonial berhasil dibuat.',
      data: testimonial as unknown as Testimonial,
    };
  } catch (error) {
    console.error('Create Testimonial Error:', error);
    return { success: false, error: 'Gagal membuat testimonial.' };
  }
}

/**
 * Update Testimonial berdasarkan ID
 */
export async function updateTestimonial(
  id: string,
  values: TestimonialValues
): Promise<TestimonialResponse> {
  const hasAccess = await verifyPermission('testimonial.update');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk mengubah data.' };
  }

  const validatedFields = testimonialSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, error: 'Input tidak valid.' };
  }

  try {
    const oldTestimonial = await prisma.testimonial.findUnique({
      where: { id },
      select: { cover: true },
    });

    if (!oldTestimonial) {
      return { success: false, error: 'Testimonial tidak ditemukan.' };
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        ...validatedFields.data,
        redirect: validatedFields.data.redirect || null,
      },
    });

    // Cleanup image lama jika diganti
    if (oldTestimonial.cover && oldTestimonial.cover !== values.cover) {
      await deleteImage(oldTestimonial.cover);
    }

    revalidatePath(BASE_PATH);
    revalidatePath('/', 'layout');
    return {
      success: true,
      message: 'Testimonial berhasil diperbarui.',
      data: testimonial as unknown as Testimonial,
    };
  } catch (error) {
    console.error('Update Testimonial Error:', error);
    return { success: false, error: 'Gagal memperbarui testimonial.' };
  }
}

/**
 * Hapus Testimonial berdasarkan ID
 */
export async function deleteTestimonial(id: string): Promise<TestimonialResponse> {
  const hasAccess = await verifyPermission('testimonial.delete');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk menghapus data.' };
  }

  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
      select: { cover: true },
    });

    if (!testimonial) {
      return { success: false, error: 'Testimonial tidak ditemukan.' };
    }

    await prisma.testimonial.delete({ where: { id } });

    if (testimonial.cover) {
      await deleteImage(testimonial.cover);
    }

    revalidatePath(BASE_PATH);
    revalidatePath('/', 'layout');
    return { success: true, message: 'Testimonial berhasil dihapus.' };
  } catch (error) {
    console.error('Delete Testimonial Error:', error);
    return { success: false, error: 'Gagal menghapus testimonial.' };
  }
}

/**
 * Hapus banyak Testimonial sekaligus
 */
export async function deleteBulkTestimonials(ids: string[]): Promise<TestimonialResponse> {
  const hasAccess = await verifyPermission('testimonial.delete');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk menghapus data.' };
  }

  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { id: { in: ids } },
      select: { cover: true },
    });

    await prisma.testimonial.deleteMany({
      where: { id: { in: ids } },
    });

    for (const item of testimonials) {
      if (item.cover) {
        await deleteImage(item.cover);
      }
    }

    revalidatePath(BASE_PATH);
    revalidatePath('/', 'layout');
    return { success: true, message: 'Berhasil menghapus beberapa testimonial.' };
  } catch (error) {
    console.error('Delete Bulk Testimonials Error:', error);
    return { success: false, error: 'Gagal menghapus beberapa testimonial.' };
  }
}
