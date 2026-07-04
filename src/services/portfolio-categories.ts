'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { portfolioCategorySchema } from '@/schemas/portfolio-categories';
import { verifyPermission } from './security';
import { deleteImage } from './uploads';

import type {
  PortfolioCategory,
  PortfolioCategoryResponse,
  PortfolioCategoryPaginationResponse,
} from '@/interfaces/features/portfolio-categories';

const BASE_PATH = '/admin/master/portfolio-categories';

export type PortfolioCategoryValues = z.infer<typeof portfolioCategorySchema>;

/**
 * Helper untuk mengecek apakah judul mengandung kata yang dilarang (Graduation/Kelulusan)
 */
const isGraduationProtected = (title: string) => {
  const lowerTitle = title.toLowerCase();
  return lowerTitle.includes('graduation') || lowerTitle.includes('kelulusan');
};

/**
 * Mengambil data kategori portfolio dengan pagination dan pencarian
 */
export async function getPortfolioCategories(
  page: number = 1,
  limit: number = 10,
  search: string = ''
): Promise<PortfolioCategoryPaginationResponse> {
  const hasAccess = await verifyPermission('portfolio.category.read');
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
            { title: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      prisma.portfolioCategory.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.portfolioCategory.count({ where }),
    ]);

    return {
      success: true,
      data: data as PortfolioCategory[],
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Get Portfolio Categories Error:', error);
    return {
      success: false,
      data: [],
      meta: { total: 0, page: 1, lastPage: 0 },
      error: 'Gagal mengambil data kategori.',
    };
  }
}

/**
 * Mengambil data kategori portfolio berdasarkan ID
 */
export async function getPortfolioCategoryById(id: string): Promise<PortfolioCategoryResponse> {
  const hasAccess = await verifyPermission('portfolio.category.read');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses.' };
  }

  try {
    const category = await prisma.portfolioCategory.findUnique({
      where: { id },
    });

    if (!category) {
      return { success: false, error: 'Kategori tidak ditemukan.' };
    }

    return { success: true, data: category as PortfolioCategory };
  } catch (error) {
    return { success: false, error: 'Gagal mengambil data kategori.' };
  }
}

/**
 * Membuat Kategori baru
 */
export async function createPortfolioCategory(
  values: PortfolioCategoryValues
): Promise<PortfolioCategoryResponse> {
  const hasAccess = await verifyPermission('portfolio.category.create');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk membuat data.' };
  }

  const validatedFields = portfolioCategorySchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, error: 'Input tidak valid.' };
  }

  try {
    const { title } = validatedFields.data;

    // Validasi: Cek apakah judul sudah ada
    const existingCategory = await prisma.portfolioCategory.findFirst({
      where: { title: { equals: title, mode: 'insensitive' } },
    });

    if (existingCategory) {
      return { success: false, error: 'Judul kategori sudah terdaftar.' };
    }

    // Proteksi: Cek apakah judul mengandung kata graduation/kelulusan
    if (isGraduationProtected(title)) {
      const existingGraduation = await prisma.portfolioCategory.findFirst({
        where: {
          OR: [
            { title: { contains: 'graduation', mode: 'insensitive' } },
            { title: { contains: 'kelulusan', mode: 'insensitive' } },
          ],
        },
      });

      if (existingGraduation) {
        return {
          success: false,
          error:
            'Kategori "Graduation/Kelulusan" tidak dapat dibuat karena sudah terdaftar di database.',
        };
      }
    }

    const category = await prisma.portfolioCategory.create({
      data: validatedFields.data,
    });

    revalidatePath(BASE_PATH);
    revalidatePath('/', 'layout');
    return {
      success: true,
      message: 'Kategori berhasil dibuat.',
      data: category as PortfolioCategory,
    };
  } catch (error) {
    console.error('Create Portfolio Category Error:', error);
    return { success: false, error: 'Gagal membuat kategori.' };
  }
}

/**
 * Update Kategori
 */
export async function updatePortfolioCategory(
  id: string,
  values: PortfolioCategoryValues
): Promise<PortfolioCategoryResponse> {
  const hasAccess = await verifyPermission('portfolio.category.update');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk mengubah data.' };
  }

  const validatedFields = portfolioCategorySchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, error: 'Input tidak valid.' };
  }

  try {
    const { title } = validatedFields.data;

    // Cari data lama untuk cleanup
    const oldCategory = await prisma.portfolioCategory.findUnique({
      where: { id },
      select: { title: true, cover: true },
    });

    if (!oldCategory) {
      return { success: false, error: 'Kategori tidak ditemukan.' };
    }

    const isOldProtected = isGraduationProtected(oldCategory.title);
    const isTitleChanged = title !== oldCategory.title;

    // Proteksi: Judul graduation/kelulusan hanya boleh dipertahankan, tidak boleh diganti
    if (isOldProtected && isTitleChanged) {
      return {
        success: false,
        error: 'Judul kategori graduation/kelulusan tidak dapat diubah.',
      };
    }

    // Proteksi: Kategori biasa tidak boleh diubah menjadi graduation/kelulusan
    if (!isOldProtected && isGraduationProtected(title)) {
      const existingGraduation = await prisma.portfolioCategory.findFirst({
        where: {
          OR: [
            { title: { contains: 'graduation', mode: 'insensitive' } },
            { title: { contains: 'kelulusan', mode: 'insensitive' } },
          ],
        },
      });

      if (existingGraduation) {
        return {
          success: false,
          error: 'Kategori "Graduation/Kelulusan" hanya boleh dipakai jika belum ada di database.',
        };
      }
    }

    // Validasi: Jika ganti judul, cek apakah judul baru sudah dipakai kategori lain
    if (isTitleChanged) {
      const duplicateTitle = await prisma.portfolioCategory.findFirst({
        where: {
          title: { equals: title, mode: 'insensitive' },
          id: { not: id },
        },
      });

      if (duplicateTitle) {
        return { success: false, error: 'Judul kategori sudah digunakan oleh kategori lain.' };
      }
    }

    const category = await prisma.portfolioCategory.update({
      where: { id },
      data: validatedFields.data,
    });

    // Cleanup old cover if changed
    if (oldCategory.cover && oldCategory.cover !== validatedFields.data.cover) {
      await deleteImage(oldCategory.cover);
    }

    revalidatePath(BASE_PATH);
    revalidatePath('/', 'layout');
    return {
      success: true,
      message: 'Kategori berhasil diperbarui.',
      data: category as PortfolioCategory,
    };
  } catch (error) {
    console.error('Update Portfolio Category Error:', error);
    return { success: false, error: 'Gagal memperbarui kategori.' };
  }
}

/**
 * Hapus Kategori berdasarkan ID
 */
export async function deletePortfolioCategory(id: string): Promise<PortfolioCategoryResponse> {
  const hasAccess = await verifyPermission('portfolio.category.delete');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk menghapus data.' };
  }

  try {
    const category = await prisma.portfolioCategory.findUnique({
      where: { id },
      select: { cover: true, title: true },
    });

    if (!category) {
      return { success: false, error: 'Kategori tidak ditemukan.' };
    }

    // Proteksi: Jika kategori adalah graduation, tidak boleh dihapus
    if (isGraduationProtected(category.title)) {
      return {
        success: false,
        error: 'Kategori graduation/kelulusan tidak dapat dihapus.',
      };
    }

    await prisma.portfolioCategory.delete({ where: { id } });

    if (category.cover) {
      await deleteImage(category.cover);
    }

    revalidatePath(BASE_PATH);
    revalidatePath('/', 'layout');
    return { success: true, message: 'Kategori berhasil dihapus.' };
  } catch (error) {
    console.error('Delete Portfolio Category Error:', error);
    return { success: false, error: 'Gagal menghapus kategori.' };
  }
}

/**
 * Hapus banyak Kategori sekaligus
 */
export async function deleteBulkPortfolioCategories(
  ids: string[]
): Promise<PortfolioCategoryResponse> {
  const hasAccess = await verifyPermission('portfolio.category.delete');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk menghapus data.' };
  }

  try {
    const categories = await prisma.portfolioCategory.findMany({
      where: { id: { in: ids } },
      select: { cover: true, title: true },
    });

    // Proteksi: Cek apakah ada kategori graduation di dalam list yang akan dihapus
    const hasProtected = categories.some((c) => isGraduationProtected(c.title));
    if (hasProtected) {
      return {
        success: false,
        error: 'Beberapa kategori graduation/kelulusan tidak dapat dihapus.',
      };
    }

    await prisma.portfolioCategory.deleteMany({
      where: { id: { in: ids } },
    });

    for (const category of categories) {
      if (category.cover) {
        await deleteImage(category.cover);
      }
    }

    revalidatePath(BASE_PATH);
    revalidatePath('/', 'layout');
    return { success: true, message: 'Berhasil menghapus beberapa kategori.' };
  } catch (error) {
    console.error('Delete Bulk Portfolio Categories Error:', error);
    return { success: false, error: 'Gagal menghapus beberapa kategori.' };
  }
}
