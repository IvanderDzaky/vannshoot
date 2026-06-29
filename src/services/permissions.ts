'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { prisma } from '@/lib/prisma';
import type {
  Permission,
  PermissionResponse,
  PermissionPaginationResponse,
} from '@/interfaces/features/permissions';
import { permissionSchema } from '@/schemas/permissions';
import { verifyPermission } from './security';

const BASE_PATH = '/admin/managements/permissions';

export type PermissionValues = z.infer<typeof permissionSchema>;

/**
 * Mengambil data permissions dengan pagination dan pencarian
 */
export async function getPermissions(
  page: number = 1,
  limit: number = 10,
  search: string = ''
): Promise<PermissionPaginationResponse> {
  const hasAccess = await verifyPermission('permission.read');
  if (!hasAccess) {
    return {
      success: false,
      data: [],
      meta: { total: 0, page: 1, lastPage: 0 },
      error: 'Anda tidak memiliki hak akses untuk melihat data ini.',
    } as any;
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
      prisma.permission.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              roles: true,
              role_has_permissions: true,
              model_has_permissions: true,
            },
          },
        },
      }),
      prisma.permission.count({ where }),
    ]);

    return {
      success: true,
      data: data as unknown as Permission[],
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Get Permissions Error:', error);
    return {
      success: false,
      data: [],
      meta: { total: 0, page: 1, lastPage: 0 },
    };
  }
}

/**
 * Mengambil data permission berdasarkan nama
 */
export async function getPermissionByName(name: string): Promise<PermissionResponse> {
  const hasAccess = await verifyPermission('permission.read');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses.' };
  }

  try {
    const permission = await prisma.permission.findFirst({
      where: { name },
    });

    if (!permission) {
      return { success: false, error: 'Hak akses tidak ditemukan.' };
    }

    return { success: true, data: permission as unknown as Permission };
  } catch (error) {
    return { success: false, error: 'Gagal mengambil data hak akses.' };
  }
}

/**
 * Membuat Permission baru
 */
export async function createPermission(values: PermissionValues): Promise<PermissionResponse> {
  const hasAccess = await verifyPermission('permission.create');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk membuat data.' };
  }

  const validatedFields = permissionSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, error: 'Input tidak valid.' };
  }

  try {
    const existing = await prisma.permission.findFirst({
      where: { name: validatedFields.data.name },
    });

    if (existing) {
      return { success: false, error: 'Nama hak akses sudah digunakan.' };
    }

    const permission = await prisma.permission.create({
      data: {
        name: validatedFields.data.name,
        description: validatedFields.data.description || null,
      },
    });

    revalidatePath(BASE_PATH);
    return {
      success: true,
      message: 'Hak akses berhasil dibuat.',
      data: permission as unknown as Permission,
    };
  } catch (error) {
    return { success: false, error: 'Gagal membuat hak akses.' };
  }
}

/**
 * Membuat banyak Permission sekaligus (CRUD mode)
 */
export async function createBulkPermissions(
  moduleName: string,
  description: string
): Promise<PermissionResponse> {
  const hasAccess = await verifyPermission('permission.create');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk membuat data.' };
  }

  const suffixes = [
    { key: 'read', label: 'Melihat daftar' },
    { key: 'create', label: 'Membuat data' },
    { key: 'update', label: 'Mengubah data' },
    { key: 'delete', label: 'Menghapus data' },
  ];

  const permissionsToCreate = suffixes.map((s) => ({
    name: `${moduleName.toLowerCase()}.${s.key}`,
    description: description
      ? `${description} (${s.key})`
      : `${s.label} ${moduleName.toLowerCase()}`,
  }));

  try {
    // Cek apakah ada yang sudah ada
    const existing = await prisma.permission.findMany({
      where: {
        name: { in: permissionsToCreate.map((p) => p.name) },
      },
    });

    if (existing.length > 0) {
      return {
        success: false,
        error: `Beberapa hak akses sudah ada: ${existing.map((e) => e.name).join(', ')}`,
      };
    }

    await prisma.permission.createMany({
      data: permissionsToCreate,
    });

    revalidatePath(BASE_PATH);
    return {
      success: true,
      message: 'Hak akses CRUD berhasil dibuat.',
    };
  } catch (error) {
    console.error('Create Bulk Permissions Error:', error);
    return { success: false, error: 'Gagal membuat hak akses CRUD.' };
  }
}

/**
 * Update Permission
 */
export async function updatePermission(
  name: string,
  values: PermissionValues
): Promise<PermissionResponse> {
  const hasAccess = await verifyPermission('permission.update');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk mengubah data.' };
  }

  const validatedFields = permissionSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, error: 'Input tidak valid.' };
  }

  try {
    const existing = await prisma.permission.findFirst({
      where: { name: validatedFields.data.name },
    });

    if (existing && existing.name !== name) {
      return { success: false, error: 'Nama hak akses sudah digunakan.' };
    }

    const permission = await prisma.permission.update({
      where: { name },
      data: {
        name: validatedFields.data.name,
        description: validatedFields.data.description || null,
      },
    });

    revalidatePath(BASE_PATH);
    return {
      success: true,
      message: 'Hak akses berhasil diperbarui.',
      data: permission as unknown as Permission,
    };
  } catch (error) {
    return { success: false, error: 'Gagal memperbarui hak akses.' };
  }
}

/**
 * Hapus Permission
 */
export async function deletePermission(id: string): Promise<PermissionResponse> {
  const hasAccess = await verifyPermission('permission.delete');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk menghapus data.' };
  }

  try {
    // Cek apakah sedang digunakan oleh role
    const inUse = await prisma.roleHasPermission.count({
      where: { permissionId: id },
    });

    if (inUse > 0) {
      return {
        success: false,
        error: 'Gagal menghapus. Hak akses ini sedang digunakan oleh satu atau lebih jabatan.',
      };
    }

    await prisma.permission.delete({ where: { id } });

    revalidatePath(BASE_PATH);
    return { success: true, message: 'Hak akses berhasil dihapus.' };
  } catch (error) {
    return { success: false, error: 'Gagal menghapus hak akses.' };
  }
}

/**
 * Hapus banyak Permission sekaligus
 */
export async function deleteBulkPermissions(ids: string[]): Promise<PermissionResponse> {
  const hasAccess = await verifyPermission('permission.delete');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk menghapus data.' };
  }

  try {
    // Cek apakah ada yang sedang digunakan oleh role
    const inUse = await prisma.roleHasPermission.findMany({
      where: { permissionId: { in: ids } },
      include: { permissions: true },
    });

    if (inUse.length > 0) {
      const inUseNames = Array.from(new Set(inUse.map((p) => p.permissions.name)));

      return {
        success: false,
        error: `Gagal menghapus. Hak akses berikut sedang digunakan: ${inUseNames.join(', ')}`,
      };
    }

    await prisma.permission.deleteMany({
      where: { id: { in: ids } },
    });

    revalidatePath(BASE_PATH);
    return { success: true, message: 'Berhasil menghapus beberapa hak akses.' };
  } catch (error) {
    return { success: false, error: 'Gagal menghapus beberapa hak akses.' };
  }
}

/**
 * Mengambil seluruh data permissions tanpa pagination
 */
export async function getAllPermissions(): Promise<PermissionResponse> {
  const hasAccess = await verifyPermission('permission.read');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses.' };
  }

  try {
    const data = await prisma.permission.findMany({
      orderBy: { name: 'desc' },
    });
    return { success: true, data: data as unknown as Permission[] };
  } catch (error) {
    return { success: false, error: 'Gagal mengambil data hak akses.' };
  }
}
