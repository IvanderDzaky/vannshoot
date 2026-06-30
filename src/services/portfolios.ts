'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { portfolioSchema } from '@/schemas/portfolios';
import { verifyPermission } from './security';
import { deleteImage, renameUploadDir, deleteUploadDir } from './uploads';
import { slugify } from '@/lib/slugify';

import type {
  Portfolio,
  PortfolioResponse,
  PortfolioPaginationResponse,
} from '@/interfaces/features/portfolios';

const BASE_PATH = '/admin/master/portfolio';

export type PortfolioValues = z.infer<typeof portfolioSchema>;

/**
 * Mengambil data portfolio dengan pagination dan pencarian
 */
export async function getPortfolios(
  page: number = 1,
  limit: number = 10,
  search: string = ''
): Promise<PortfolioPaginationResponse> {
  const hasAccess = await verifyPermission('portfolio.read');
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
      prisma.portfolio.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          categories: true,
          images: true,
        },
      }),
      prisma.portfolio.count({ where }),
    ]);

    const mappedData = data.map((portfolio) => ({
      ...portfolio,
      images: portfolio.images.map((img) => img.image),
    }));

    return {
      success: true,
      data: mappedData as unknown as Portfolio[],
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Get Portfolios Error:', error);
    return {
      success: false,
      data: [],
      meta: { total: 0, page: 1, lastPage: 0 },
      error: 'Gagal mengambil data portfolio.',
    };
  }
}

/**
 * Mengambil data portfolio berdasarkan ID
 */
export async function getPortfolioById(id: string): Promise<PortfolioResponse> {
  const hasAccess = await verifyPermission('portfolio.read');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses.' };
  }

  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { id },
      include: {
        categories: true,
        images: true,
      },
    });

    if (!portfolio) {
      return { success: false, error: 'Portfolio tidak ditemukan.' };
    }

    const mappedPortfolio = {
      ...portfolio,
      images: portfolio.images.map((img) => img.image),
    };

    return { success: true, data: mappedPortfolio as unknown as Portfolio };
  } catch (error) {
    return { success: false, error: 'Gagal mengambil data portfolio.' };
  }
}

/**
 * Membuat Portfolio baru
 */
export async function createPortfolio(values: PortfolioValues): Promise<PortfolioResponse> {
  const hasAccess = await verifyPermission('portfolio.create');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk membuat data.' };
  }

  const validatedFields = portfolioSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, error: 'Input tidak valid.' };
  }

  try {
    const { title, description, cover, images, city, location, categoryIds, price } =
      validatedFields.data;

    // Validasi: Cek apakah judul sudah ada
    const existingPortfolio = await prisma.portfolio.findFirst({
      where: { title: { equals: title, mode: 'insensitive' } },
    });

    if (existingPortfolio) {
      return { success: false, error: 'Judul portfolio sudah terdaftar.' };
    }

    // Logika Rename Folder Untitled -> [Title]
    let finalCover = cover;
    let finalImages = [...images];
    const slug = slugify(title);
    const targetSubDir = `portfolios/${slug}`;

    const isFromUntitled =
      cover?.includes('/portfolios/untitled/') ||
      images.some((img) => img.includes('/portfolios/untitled/'));

    if (isFromUntitled) {
      const renameResult = await renameUploadDir('portfolios/untitled', targetSubDir);
      if (renameResult.success) {
        finalCover = cover?.replace('/portfolios/untitled/', `/portfolios/${slug}/`) || cover;
        finalImages = images.map((img) =>
          img.replace('/portfolios/untitled/', `/portfolios/${slug}/`)
        );
      }
    }

    const portfolio = await prisma.portfolio.create({
      data: {
        title,
        description,
        cover: finalCover,
        price: price || null,
        images: {
          create: finalImages.map((image) => ({
            image,
            filename: image.split('/').pop() || '',
          })),
        },
        city: city || null,
        location: location || null,
        categories: {
          connect: categoryIds.map((id) => ({ id })),
        },
      },
      include: {
        categories: true,
        images: true,
      },
    });

    const mappedPortfolio = {
      ...portfolio,
      images: portfolio.images.map((img) => img.image),
    };

    revalidatePath(BASE_PATH);
    revalidatePath('/', 'layout');
    return {
      success: true,
      message: 'Portfolio berhasil dibuat.',
      data: mappedPortfolio as unknown as Portfolio,
    };
  } catch (error) {
    console.error('Create Portfolio Error:', error);
    return { success: false, error: 'Gagal membuat portfolio.' };
  }
}

/**
 * Update Portfolio
 */
export async function updatePortfolio(
  id: string,
  values: PortfolioValues
): Promise<PortfolioResponse> {
  const hasAccess = await verifyPermission('portfolio.update');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk mengubah data.' };
  }

  const validatedFields = portfolioSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, error: 'Input tidak valid.' };
  }

  try {
    const { title, description, cover, images, city, location, categoryIds, price } =
      validatedFields.data;

    // Cari data lama untuk cleanup
    const oldPortfolio = await prisma.portfolio.findUnique({
      where: { id },
      include: { categories: true, images: true },
    });

    if (!oldPortfolio) {
      return { success: false, error: 'Portfolio tidak ditemukan.' };
    }

    // Validasi: Jika ganti judul, cek apakah judul baru sudah dipakai portfolio lain
    if (title !== oldPortfolio.title) {
      const duplicateTitle = await prisma.portfolio.findFirst({
        where: {
          title: { equals: title, mode: 'insensitive' },
          id: { not: id },
        },
      });

      if (duplicateTitle) {
        return { success: false, error: 'Judul portfolio sudah digunakan oleh portfolio lain.' };
      }
    }

    // Logika Rename Folder
    let finalCover = cover;
    let finalImages = [...images];
    const newSlug = slugify(title);
    const oldSlug = slugify(oldPortfolio.title);

    // 1. Tangani file yang diunggah ke 'untitled'
    const isFromUntitled =
      cover?.includes('/portfolios/untitled/') ||
      images.some((img) => img.includes('/portfolios/untitled/'));

    if (isFromUntitled) {
      await renameUploadDir('portfolios/untitled', `portfolios/${newSlug}`);
      finalCover = finalCover?.replace('/portfolios/untitled/', `/portfolios/${newSlug}/`) || null;
      finalImages = finalImages.map((img) =>
        img.replace('/portfolios/untitled/', `/portfolios/${newSlug}/`)
      );
    }

    // 2. Tangani perubahan judul (pindahkan folder lama ke baru)
    if (newSlug !== oldSlug) {
      await renameUploadDir(`portfolios/${oldSlug}`, `portfolios/${newSlug}`);
      // Update semua URL yang mengandung path lama
      finalCover =
        finalCover?.replace(`/portfolios/${oldSlug}/`, `/portfolios/${newSlug}/`) || null;
      finalImages = finalImages.map((img) =>
        img.replace(`/portfolios/${oldSlug}/`, `/portfolios/${newSlug}/`)
      );
    }

    // Hitung gambar yang dihapus
    const oldImageUrls = oldPortfolio.images.map((img) => img.image);
    const removedImages = oldImageUrls.filter((imgUrl) => !images.includes(imgUrl));

    // Hapus gambar yang dihilangkan dari database
    if (removedImages.length > 0) {
      await prisma.portfolioImage.deleteMany({
        where: {
          portfolioId: id,
          image: { in: removedImages },
        },
      });
    }

    // Hitung gambar baru yang akan ditambah
    const newImageUrls = finalImages.filter((imgUrl) => !oldImageUrls.includes(imgUrl));

    const portfolio = await prisma.portfolio.update({
      where: { id },
      data: {
        title,
        description,
        cover: finalCover,
        price: price || null,
        city: city || null,
        location: location || null,
        categories: {
          set: categoryIds.map((id) => ({ id })),
        },
        images: {
          create: newImageUrls.map((image) => ({
            image,
            filename: image.split('/').pop() || '',
          })),
        },
      },
      include: {
        categories: true,
        images: true,
      },
    });

    const mappedPortfolio = {
      ...portfolio,
      images: portfolio.images.map((img) => img.image),
    };

    // Cleanup files dari filesystem
    for (const img of removedImages) {
      await deleteImage(img);
    }

    // Cleanup cover lama jika diganti
    if (oldPortfolio.cover && oldPortfolio.cover !== cover) {
      await deleteImage(oldPortfolio.cover);
    }

    revalidatePath(BASE_PATH);
    revalidatePath('/', 'layout');
    return {
      success: true,
      message: 'Portfolio berhasil diperbarui.',
      data: portfolio as unknown as Portfolio,
    };
  } catch (error) {
    console.error('Update Portfolio Error:', error);
    return { success: false, error: 'Gagal memperbarui portfolio.' };
  }
}

/**
 * Hapus Portfolio
 */
export async function deletePortfolio(id: string): Promise<PortfolioResponse> {
  const hasAccess = await verifyPermission('portfolio.delete');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk menghapus data.' };
  }

  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { id },
      select: { title: true, cover: true, images: true },
    });

    if (!portfolio) {
      return { success: false, error: 'Portfolio tidak ditemukan.' };
    }

    await prisma.portfolio.delete({ where: { id } });

    // Cleanup assets folder
    const slug = slugify(portfolio.title);
    await deleteUploadDir(`portfolios/${slug}`);

    revalidatePath(BASE_PATH);
    revalidatePath('/', 'layout');
    return { success: true, message: 'Portfolio berhasil dihapus.' };
  } catch (error) {
    console.error('Delete Portfolio Error:', error);
    return { success: false, error: 'Gagal menghapus portfolio.' };
  }
}

/**
 * Hapus banyak Portfolio sekaligus
 */
export async function deleteBulkPortfolios(ids: string[]): Promise<PortfolioResponse> {
  const hasAccess = await verifyPermission('portfolio.delete');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk menghapus data.' };
  }

  try {
    const portfolios = await prisma.portfolio.findMany({
      where: { id: { in: ids } },
      select: { title: true },
    });

    await prisma.portfolio.deleteMany({
      where: { id: { in: ids } },
    });

    for (const portfolio of portfolios) {
      const slug = slugify(portfolio.title);
      await deleteUploadDir(`portfolios/${slug}`);
    }

    revalidatePath(BASE_PATH);
    revalidatePath('/', 'layout');
    return { success: true, message: 'Berhasil menghapus beberapa portfolio.' };
  } catch (error) {
    console.error('Delete Bulk Portfolios Error:', error);
    return { success: false, error: 'Gagal menghapus beberapa portfolio.' };
  }
}

/**
 * Mengambil seluruh data portfolio untuk picker (tanpa pagination)
 */
export async function getPortfoliosForPicker() {
  const hasAccess = await verifyPermission('portfolio.read');
  if (!hasAccess) return { success: false, data: [], error: 'Anda tidak memiliki hak akses.' };

  try {
    const data = await prisma.portfolio.findMany({
      select: {
        id: true,
        title: true,
        categories: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { title: 'asc' },
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, data: [], error: 'Gagal mengambil data portfolio.' };
  }
}
