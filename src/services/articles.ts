'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { articleSchema } from '@/schemas/articles';
import { verifyPermission } from './security';
import { deleteImage } from './uploads';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

import type {
  Article,
  ArticleCategory,
  ArticleResponse,
  ArticlePaginationResponse,
} from '@/interfaces/features/articles';

const BASE_PATH = '/admin/publications/articles';

export type ArticleValues = z.infer<typeof articleSchema>;

/**
 * Mengambil data artikel dengan pagination dan pencarian
 */
export async function getArticles(
  page: number = 1,
  limit: number = 10,
  search: string = ''
): Promise<ArticlePaginationResponse> {
  const hasAccess = await verifyPermission('article.read');
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
            { content: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          articleCategories: true,
        },
      }),
      prisma.article.count({ where }),
    ]);

    return {
      success: true,
      data: data as unknown as Article[],
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Get Articles Error:', error);
    return {
      success: false,
      data: [],
      meta: { total: 0, page: 1, lastPage: 0 },
      error: 'Gagal mengambil data artikel.',
    };
  }
}

/**
 * Mengambil data artikel berdasarkan Title (Name in param)
 */
export async function getArticleByTitle(title: string): Promise<ArticleResponse> {
  const hasAccess = await verifyPermission('article.read');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses.' };
  }

  try {
    const article = await prisma.article.findFirst({
      where: { title },
      include: {
        articleCategories: true,
      },
    });

    if (!article) {
      return { success: false, error: 'Artikel tidak ditemukan.' };
    }

    return { success: true, data: article as unknown as Article };
  } catch (error) {
    return { success: false, error: 'Gagal mengambil data artikel.' };
  }
}

/**
 * Mengambil data artikel berdasarkan ID (UUID)
 */
export async function getArticleById(id: string): Promise<ArticleResponse> {
  const hasAccess = await verifyPermission('article.read');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses.' };
  }

  try {
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        articleCategories: true,
      },
    });

    if (!article) {
      return { success: false, error: 'Artikel tidak ditemukan.' };
    }

    return { success: true, data: article as unknown as Article };
  } catch (error) {
    return { success: false, error: 'Gagal mengambil data artikel.' };
  }
}

/**
 * Membuat Artikel baru
 */
export async function createArticle(values: ArticleValues): Promise<ArticleResponse> {
  const hasAccess = await verifyPermission('article.create');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk membuat data.' };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: 'Sesi tidak valid.' };
  }

  const validatedFields = articleSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, error: 'Input tidak valid.' };
  }

  try {
    const { title, content, cover, categories } = validatedFields.data;

    // Validasi: Cek apakah judul sudah ada
    const existingArticle = await prisma.article.findFirst({
      where: { title: { equals: title, mode: 'insensitive' } },
    });

    if (existingArticle) {
      return { success: false, error: 'Judul artikel sudah terdaftar.' };
    }

    // Cari record kategori master yang sesuai dengan nama yang dipilih
    const categoryRecords = await prisma.articleCategory.findMany({
      where: {
        name: { in: categories.map((c) => c.name) },
      },
    });

    const article = await prisma.article.create({
      data: {
        title,
        content,
        cover,
        createdById: session.user.id,
        articleCategories: {
          connect: categoryRecords.map((cat) => ({ id: cat.id })),
        },
      },
    });

    revalidatePath(BASE_PATH);
    revalidatePath('/', 'layout');
    return {
      success: true,
      message: 'Artikel berhasil dibuat.',
      data: article as unknown as Article,
    };
  } catch (error) {
    console.error('Create Article Error:', error);
    return { success: false, error: 'Gagal membuat artikel.' };
  }
}

/**
 * Update Artikel berdasarkan Judul
 */
export async function updateArticle(
  targetTitle: string,
  values: ArticleValues
): Promise<ArticleResponse> {
  const hasAccess = await verifyPermission('article.update');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk mengubah data.' };
  }

  const validatedFields = articleSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, error: 'Input tidak valid.' };
  }

  try {
    const { title, content, cover, categories } = validatedFields.data;

    // Cari data berdasarkan judul lama untuk mendapatkan ID
    const oldArticle = await prisma.article.findFirst({
      where: { title: targetTitle },
      select: { id: true, cover: true },
    });

    if (!oldArticle) {
      return { success: false, error: 'Artikel tidak ditemukan.' };
    }

    // Validasi: Jika ganti judul, cek apakah judul baru sudah dipakai orang lain
    if (title !== targetTitle) {
      const duplicateTitle = await prisma.article.findFirst({
        where: {
          title: { equals: title, mode: 'insensitive' },
          id: { not: oldArticle.id },
        },
      });

      if (duplicateTitle) {
        return { success: false, error: 'Judul artikel sudah digunakan oleh artikel lain.' };
      }
    }

    // Cari record kategori master yang sesuai dengan nama yang dipilih
    const categoryRecords = await prisma.articleCategory.findMany({
      where: {
        name: { in: categories.map((c) => c.name) },
      },
    });

    const article = await prisma.article.update({
      where: { id: oldArticle.id },
      data: {
        title,
        content,
        cover,
        articleCategories: {
          set: categoryRecords.map((cat) => ({ id: cat.id })),
        },
      },
    });

    // Cleanup cover lama jika diganti
    if (oldArticle.cover && oldArticle.cover !== cover) {
      await deleteImage(oldArticle.cover);
    }

    revalidatePath(BASE_PATH);
    revalidatePath('/', 'layout');
    return {
      success: true,
      message: 'Artikel berhasil diperbarui.',
      data: article as unknown as Article,
    };
  } catch (error) {
    console.error('Update Article Error:', error);
    return { success: false, error: 'Gagal memperbarui artikel.' };
  }
}

/**
 * Update Artikel berdasarkan ID (UUID)
 */
export async function updateArticleById(
  id: string,
  values: ArticleValues
): Promise<ArticleResponse> {
  const hasAccess = await verifyPermission('article.update');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk mengubah data.' };
  }

  const validatedFields = articleSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, error: 'Input tidak valid.' };
  }

  try {
    const { title, content, cover, categories } = validatedFields.data;

    const oldArticle = await prisma.article.findUnique({
      where: { id },
      select: { id: true, title: true, cover: true },
    });

    if (!oldArticle) {
      return { success: false, error: 'Artikel tidak ditemukan.' };
    }

    // Validasi: Jika ganti judul, cek apakah judul baru sudah dipakai artikel lain
    if (title !== oldArticle.title) {
      const duplicateTitle = await prisma.article.findFirst({
        where: {
          title: { equals: title, mode: 'insensitive' },
          id: { not: id },
        },
      });

      if (duplicateTitle) {
        return { success: false, error: 'Judul artikel sudah digunakan oleh artikel lain.' };
      }
    }

    const categoryRecords = await prisma.articleCategory.findMany({
      where: {
        name: { in: categories.map((c) => c.name) },
      },
    });

    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        content,
        cover,
        articleCategories: {
          set: categoryRecords.map((cat) => ({ id: cat.id })),
        },
      },
    });

    // Cleanup cover lama jika diganti
    if (oldArticle.cover && oldArticle.cover !== cover) {
      await deleteImage(oldArticle.cover);
    }

    revalidatePath(BASE_PATH);
    revalidatePath('/', 'layout');
    return {
      success: true,
      message: 'Artikel berhasil diperbarui.',
      data: article as unknown as Article,
    };
  } catch (error) {
    console.error('Update Article By ID Error:', error);
    return { success: false, error: 'Gagal memperbarui artikel.' };
  }
}

/**
 * Hapus banyak Artikel sekaligus
 */
export async function deleteBulkArticles(ids: string[]): Promise<ArticleResponse> {
  const hasAccess = await verifyPermission('article.delete');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk menghapus data.' };
  }

  try {
    const articles = await prisma.article.findMany({
      where: { id: { in: ids } },
      select: { cover: true },
    });

    await prisma.article.deleteMany({
      where: { id: { in: ids } },
    });

    for (const article of articles) {
      if (article.cover) {
        await deleteImage(article.cover);
      }
    }

    revalidatePath(BASE_PATH);
    revalidatePath('/', 'layout');
    return { success: true, message: 'Berhasil menghapus beberapa artikel.' };
  } catch (error) {
    console.error('Delete Bulk Articles Error:', error);
    return { success: false, error: 'Gagal menghapus beberapa artikel.' };
  }
}

/**
 * Hapus Artikel berdasarkan Judul
 */
export async function deleteArticle(title: string): Promise<ArticleResponse> {
  const hasAccess = await verifyPermission('article.delete');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk menghapus data.' };
  }

  try {
    const article = await prisma.article.findFirst({
      where: { title },
      select: { id: true, cover: true },
    });

    if (!article) {
      return { success: false, error: 'Artikel tidak ditemukan.' };
    }

    await prisma.article.delete({ where: { id: article.id } });

    if (article.cover) {
      await deleteImage(article.cover);
    }

    revalidatePath(BASE_PATH);
    revalidatePath('/', 'layout');
    return { success: true, message: 'Artikel berhasil dihapus.' };
  } catch (error) {
    console.error('Delete Article Error:', error);
    return { success: false, error: 'Gagal menghapus artikel.' };
  }
}

/**
 * Hapus Artikel berdasarkan ID (UUID)
 */
export async function deleteArticleById(id: string): Promise<ArticleResponse> {
  const hasAccess = await verifyPermission('article.delete');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk menghapus data.' };
  }

  try {
    const article = await prisma.article.findUnique({
      where: { id },
      select: { id: true, cover: true },
    });

    if (!article) {
      return { success: false, error: 'Artikel tidak ditemukan.' };
    }

    await prisma.article.delete({ where: { id } });

    if (article.cover) {
      await deleteImage(article.cover);
    }

    revalidatePath(BASE_PATH);
    revalidatePath('/', 'layout');
    return { success: true, message: 'Artikel berhasil dihapus.' };
  } catch (error) {
    console.error('Delete Article By ID Error:', error);
    return { success: false, error: 'Gagal menghapus artikel.' };
  }
}

/**
 * Mengambil seluruh data kategori artikel
 */
export async function getCategories(): Promise<{
  success: boolean;
  data: ArticleCategory[];
  error?: string;
}> {
  const hasAccess = await verifyPermission('article.category.read');
  if (!hasAccess) return { success: false, data: [], error: 'Anda tidak memiliki hak akses.' };

  try {
    const data = await prisma.articleCategory.findMany({
      orderBy: { name: 'asc' },
    });
    return { success: true, data: data as unknown as ArticleCategory[] };
  } catch (error) {
    return { success: false, data: [], error: 'Gagal mengambil data kategori.' };
  }
}

/**
 * Membuat Kategori baru
 */
export async function createCategory(
  name: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  const hasAccess = await verifyPermission('article.category.create');
  if (!hasAccess) return { success: false, error: 'Anda tidak memiliki hak akses.' };

  try {
    // Validasi: Cek apakah kategori sudah ada
    const existingCategory = await prisma.articleCategory.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
      },
    });

    if (existingCategory) {
      return { success: false, error: 'Nama kategori sudah ada.' };
    }

    await prisma.articleCategory.create({
      data: { name },
    });
    revalidatePath(BASE_PATH);
    revalidatePath('/', 'layout');
    return { success: true, message: 'Kategori berhasil dibuat.' };
  } catch (error) {
    return { success: false, error: 'Gagal membuat kategori.' };
  }
}

/**
 * Update Kategori
 */
export async function updateCategory(
  id: string,
  name: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  const hasAccess = await verifyPermission('article.category.update');
  if (!hasAccess) return { success: false, error: 'Anda tidak memiliki hak akses.' };

  try {
    // Validasi: Cek apakah nama baru sudah dipakai kategori lain
    const duplicateCategory = await prisma.articleCategory.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        id: { not: id },
      },
    });

    if (duplicateCategory) {
      return { success: false, error: 'Nama kategori sudah digunakan.' };
    }

    await prisma.articleCategory.update({
      where: { id },
      data: { name },
    });
    revalidatePath(BASE_PATH);
    revalidatePath('/', 'layout');
    return { success: true, message: 'Kategori berhasil diperbarui.' };
  } catch (error) {
    return { success: false, error: 'Gagal memperbarui kategori.' };
  }
}

/**
 * Hapus Kategori
 */
export async function deleteCategory(
  id: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  const hasAccess = await verifyPermission('article.category.delete');
  if (!hasAccess) return { success: false, error: 'Anda tidak memiliki hak akses.' };

  try {
    await prisma.articleCategory.delete({ where: { id } });
    revalidatePath(BASE_PATH);
    revalidatePath('/', 'layout');
    return { success: true, message: 'Kategori berhasil dihapus.' };
  } catch (error) {
    return { success: false, error: 'Gagal menghapus kategori.' };
  }
}
