'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { clientSchema } from '@/schemas/clients';
import { verifyPermission } from './security';
import { deleteImage } from './uploads';

import type {
  Client,
  ClientResponse,
  ClientPaginationResponse,
  ClientCategory,
} from '@/interfaces/features/clients';

const BASE_PATH = '/admin/services/clients';

export type ClientValues = z.infer<typeof clientSchema>;

/**
 * Mengambil data klien dengan pagination dan pencarian
 */
export async function getClients(
  page: number = 1,
  limit: number = 10,
  search: string = ''
): Promise<ClientPaginationResponse> {
  const hasAccess = await verifyPermission('client.read');
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
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          categories: true,
          _count: {
            select: { categories: true },
          },
        },
      }),
      prisma.client.count({ where }),
    ]);

    return {
      success: true,
      data: data as unknown as Client[],
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Get Clients Error:', error);
    return {
      success: false,
      data: [],
      meta: { total: 0, page: 1, lastPage: 0 },
      error: 'Gagal mengambil data klien.',
    };
  }
}

/**
 * Mengambil data klien berdasarkan Name
 */
export async function getClientByName(name: string): Promise<ClientResponse> {
  const hasAccess = await verifyPermission('client.read');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses.' };
  }

  try {
    const client = await prisma.client.findFirst({
      where: { name },
      include: {
        categories: true,
      },
    });

    if (!client) {
      return { success: false, error: 'Klien tidak ditemukan.' };
    }

    return { success: true, data: client as unknown as Client };
  } catch (error) {
    return { success: false, error: 'Gagal mengambil data klien.' };
  }
}

/**
 * Mengambil data klien berdasarkan ID (UUID)
 */
export async function getClientById(id: string): Promise<ClientResponse> {
  const hasAccess = await verifyPermission('client.read');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses.' };
  }

  try {
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        categories: true,
      },
    });

    if (!client) {
      return { success: false, error: 'Klien tidak ditemukan.' };
    }

    return { success: true, data: client as unknown as Client };
  } catch (error) {
    return { success: false, error: 'Gagal mengambil data klien.' };
  }
}

/**
 * Membuat Klien baru
 */
export async function createClient(values: ClientValues): Promise<ClientResponse> {
  const hasAccess = await verifyPermission('client.create');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk membuat data.' };
  }

  const validatedFields = clientSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, error: 'Input tidak valid.' };
  }

  try {
    const { name, description, image, categories } = validatedFields.data;

    // Validasi: Cek apakah nama sudah ada
    const existingClient = await prisma.client.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });

    if (existingClient) {
      return { success: false, error: 'Nama klien sudah terdaftar.' };
    }

    const categoryRecords = await prisma.clientCategory.findMany({
      where: {
        name: { in: categories.map((c) => c.name) },
      },
    });

    const client = await prisma.client.create({
      data: {
        name,
        description,
        image,
        categories: {
          connect: categoryRecords.map((cat) => ({ id: cat.id })),
        },
      },
    });

    revalidatePath(BASE_PATH);
    revalidatePath('/', 'layout');
    return {
      success: true,
      message: 'Klien berhasil dibuat.',
      data: client as unknown as Client,
    };
  } catch (error) {
    console.error('Create Client Error:', error);
    return { success: false, error: 'Gagal membuat klien.' };
  }
}

/**
 * Update Klien berdasarkan Nama
 */
export async function updateClient(
  targetName: string,
  values: ClientValues
): Promise<ClientResponse> {
  const hasAccess = await verifyPermission('client.update');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk mengubah data.' };
  }

  const validatedFields = clientSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, error: 'Input tidak valid.' };
  }

  try {
    const { name, description, image, categories } = validatedFields.data;

    // Cari data berdasarkan nama untuk mendapatkan ID
    const oldClient = await prisma.client.findFirst({
      where: { name: targetName },
      select: { id: true, image: true },
    });

    if (!oldClient) {
      return { success: false, error: 'Klien tidak ditemukan.' };
    }

    // Validasi: Jika ganti nama, cek apakah nama baru sudah dipakai orang lain
    if (name !== targetName) {
      const duplicateName = await prisma.client.findFirst({
        where: {
          name: { equals: name, mode: 'insensitive' },
          id: { not: oldClient.id },
        },
      });

      if (duplicateName) {
        return { success: false, error: 'Nama klien sudah digunakan oleh klien lain.' };
      }
    }

    const categoryRecords = await prisma.clientCategory.findMany({
      where: {
        name: { in: categories.map((c) => c.name) },
      },
    });

    const client = await prisma.client.update({
      where: { id: oldClient.id },
      data: {
        name,
        description,
        image,
        categories: {
          set: categoryRecords.map((cat) => ({ id: cat.id })),
        },
      },
    });

    // Cleanup image lama jika diganti
    if (oldClient.image && oldClient.image !== image) {
      await deleteImage(oldClient.image);
    }

    revalidatePath(BASE_PATH);
    revalidatePath('/', 'layout');
    return {
      success: true,
      message: 'Klien berhasil diperbarui.',
      data: client as unknown as Client,
    };
  } catch (error) {
    console.error('Update Client Error:', error);
    return { success: false, error: 'Gagal memperbarui klien.' };
  }
}

/**
 * Update Klien berdasarkan ID (UUID)
 */
export async function updateClientById(id: string, values: ClientValues): Promise<ClientResponse> {
  const hasAccess = await verifyPermission('client.update');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk mengubah data.' };
  }

  const validatedFields = clientSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, error: 'Input tidak valid.' };
  }

  try {
    const { name, description, image, categories } = validatedFields.data;

    const oldClient = await prisma.client.findUnique({
      where: { id },
      select: { id: true, name: true, image: true },
    });

    if (!oldClient) {
      return { success: false, error: 'Klien tidak ditemukan.' };
    }

    // Validasi: Jika ganti nama, cek apakah nama baru sudah dipakai klien lain
    if (name !== oldClient.name) {
      const duplicateName = await prisma.client.findFirst({
        where: {
          name: { equals: name, mode: 'insensitive' },
          id: { not: id },
        },
      });

      if (duplicateName) {
        return { success: false, error: 'Nama klien sudah digunakan oleh klien lain.' };
      }
    }

    const categoryRecords = await prisma.clientCategory.findMany({
      where: {
        name: { in: categories.map((c) => c.name) },
      },
    });

    const client = await prisma.client.update({
      where: { id },
      data: {
        name,
        description,
        image,
        categories: {
          set: categoryRecords.map((cat) => ({ id: cat.id })),
        },
      },
    });

    // Cleanup image lama jika diganti
    if (oldClient.image && oldClient.image !== image) {
      await deleteImage(oldClient.image);
    }

    revalidatePath(BASE_PATH);
    revalidatePath('/', 'layout');
    return {
      success: true,
      message: 'Klien berhasil diperbarui.',
      data: client as unknown as Client,
    };
  } catch (error) {
    console.error('Update Client By ID Error:', error);
    return { success: false, error: 'Gagal memperbarui klien.' };
  }
}

/**
 * Hapus Klien berdasarkan Nama
 */
export async function deleteClient(name: string): Promise<ClientResponse> {
  const hasAccess = await verifyPermission('client.delete');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk menghapus data.' };
  }

  try {
    const client = await prisma.client.findFirst({
      where: { name },
      select: { id: true, image: true },
    });

    if (!client) {
      return { success: false, error: 'Klien tidak ditemukan.' };
    }

    await prisma.client.delete({ where: { id: client.id } });

    if (client.image) {
      await deleteImage(client.image);
    }

    revalidatePath(BASE_PATH);
    revalidatePath('/', 'layout');
    return { success: true, message: 'Klien berhasil dihapus.' };
  } catch (error) {
    console.error('Delete Client Error:', error);
    return { success: false, error: 'Gagal menghapus klien.' };
  }
}

/**
 * Hapus Klien berdasarkan ID (UUID)
 */
export async function deleteClientById(id: string): Promise<ClientResponse> {
  const hasAccess = await verifyPermission('client.delete');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk menghapus data.' };
  }

  try {
    const client = await prisma.client.findUnique({
      where: { id },
      select: { id: true, image: true },
    });

    if (!client) {
      return { success: false, error: 'Klien tidak ditemukan.' };
    }

    await prisma.client.delete({ where: { id } });

    if (client.image) {
      await deleteImage(client.image);
    }

    revalidatePath(BASE_PATH);
    revalidatePath('/', 'layout');
    return { success: true, message: 'Klien berhasil dihapus.' };
  } catch (error) {
    console.error('Delete Client By ID Error:', error);
    return { success: false, error: 'Gagal menghapus klien.' };
  }
}

/**
 * Hapus banyak Klien sekaligus
 */
export async function deleteBulkClients(ids: string[]): Promise<ClientResponse> {
  const hasAccess = await verifyPermission('client.delete');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk menghapus data.' };
  }

  try {
    const clients = await prisma.client.findMany({
      where: { id: { in: ids } },
      select: { image: true },
    });

    await prisma.client.deleteMany({
      where: { id: { in: ids } },
    });

    for (const client of clients) {
      if (client.image) {
        await deleteImage(client.image);
      }
    }

    revalidatePath(BASE_PATH);
    revalidatePath('/', 'layout');
    return { success: true, message: 'Berhasil menghapus beberapa klien.' };
  } catch (error) {
    console.error('Delete Bulk Clients Error:', error);
    return { success: false, error: 'Gagal menghapus beberapa klien.' };
  }
}

/**
 * Mengambil seluruh data kategori klien
 */
export async function getCategories(): Promise<{
  success: boolean;
  data: ClientCategory[];
  error?: string;
}> {
  const hasAccess = await verifyPermission('client.category.read');
  if (!hasAccess) return { success: false, data: [], error: 'Anda tidak memiliki hak akses.' };

  try {
    const data = await prisma.clientCategory.findMany({
      orderBy: { name: 'asc' },
    });
    return { success: true, data: data as unknown as ClientCategory[] };
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
  const hasAccess = await verifyPermission('client.category.create');
  if (!hasAccess) return { success: false, error: 'Anda tidak memiliki hak akses.' };

  try {
    // Validasi: Cek apakah kategori sudah ada
    const existingCategory = await prisma.clientCategory.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
      },
    });

    if (existingCategory) {
      return { success: false, error: 'Nama kategori sudah ada.' };
    }

    await prisma.clientCategory.create({
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
  const hasAccess = await verifyPermission('client.category.update');
  if (!hasAccess) return { success: false, error: 'Anda tidak memiliki hak akses.' };

  try {
    // Validasi: Cek apakah nama baru sudah dipakai kategori lain
    const duplicateCategory = await prisma.clientCategory.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        id: { not: id },
      },
    });

    if (duplicateCategory) {
      return { success: false, error: 'Nama kategori sudah digunakan.' };
    }

    await prisma.clientCategory.update({
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
  const hasAccess = await verifyPermission('client.category.delete');
  if (!hasAccess) return { success: false, error: 'Anda tidak memiliki hak akses.' };

  try {
    await prisma.clientCategory.delete({ where: { id } });
    revalidatePath(BASE_PATH);
    revalidatePath('/', 'layout');
    return { success: true, message: 'Kategori berhasil dihapus.' };
  } catch (error) {
    return { success: false, error: 'Gagal menghapus kategori.' };
  }
}
