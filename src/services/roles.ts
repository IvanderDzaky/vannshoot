'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { prisma } from '@/lib/prisma';
import type { Role, RoleResponse, RolePaginationResponse } from '@/interfaces/features/roles';
import { roleSchema } from '@/schemas/roles';
import { verifyPermission } from './security';

const BASE_PATH = '/admin/managements/roles';

export type RoleValues = z.infer<typeof roleSchema>;

/**
 * Mengambil data roles dengan pagination dan pencarian
 */
export async function getRoles(
  page: number = 1,
  limit: number = 10,
  search: string = ''
): Promise<RolePaginationResponse> {
  const hasAccess = await verifyPermission('role.read');
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
      prisma.role.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          permissions: {
            select: { id: true, name: true },
          },
          _count: {
            select: {
              users: true,
              permissions: true,
              roleHasPermissions: true,
              modelHasPermissions: true,
            },
          },
        },
      }),
      prisma.role.count({ where }),
    ]);

    return {
      success: true,
      data: data as unknown as Role[],
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Get Roles Error:', error);
    return {
      success: false,
      data: [],
      meta: { total: 0, page: 1, lastPage: 0 },
    };
  }
}

/**
 * Mengambil data role berdasarkan nama
 */
export async function getRoleByName(name: string): Promise<RoleResponse> {
  const hasAccess = await verifyPermission('role.read');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses.' };
  }

  try {
    const role = await prisma.role.findFirst({
      where: { name },
      include: {
        permissions: {
          select: { id: true, name: true },
        },
      },
    });

    if (!role) {
      return { success: false, error: 'Jabatan tidak ditemukan.' };
    }

    return { success: true, data: role as unknown as Role };
  } catch (error) {
    return { success: false, error: 'Gagal mengambil data jabatan.' };
  }
}

/**
 * Mengambil data role berdasarkan ID (UUID)
 */
export async function getRoleById(id: string): Promise<RoleResponse> {
  const hasAccess = await verifyPermission('role.read');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses.' };
  }

  try {
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          select: { id: true, name: true },
        },
      },
    });

    if (!role) {
      return { success: false, error: 'Jabatan tidak ditemukan.' };
    }

    return { success: true, data: role as unknown as Role };
  } catch (error) {
    return { success: false, error: 'Gagal mengambil data jabatan.' };
  }
}

/**
 * Membuat Role baru
 */
export async function createRole(values: RoleValues): Promise<RoleResponse> {
  const hasAccess = await verifyPermission('role.create');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk membuat data.' };
  }

  const validatedFields = roleSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, error: 'Input tidak valid.' };
  }

  try {
    const existing = await prisma.role.findFirst({
      where: { name: validatedFields.data.name },
    });

    if (existing) {
      return { success: false, error: 'Nama jabatan sudah digunakan.' };
    }

    const role = await prisma.role.create({
      data: {
        name: validatedFields.data.name,
        description: validatedFields.data.description || null,
        permissions: {
          connect: validatedFields.data.permissions.map((id) => ({ id })),
        },
      },
    });

    revalidatePath(BASE_PATH);

    return {
      success: true,
      data: role as unknown as Role,
      message: 'Jabatan berhasil dibuat.',
    };
  } catch (error) {
    return { success: false, error: 'Gagal membuat jabatan.' };
  }
}

/**
 * Update Role
 */
export async function updateRole(name: string, values: RoleValues): Promise<RoleResponse> {
  const hasAccess = await verifyPermission('role.update');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk mengubah data.' };
  }

  const validatedFields = roleSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, error: 'Input tidak valid.' };
  }

  try {
    const existing = await prisma.role.findFirst({
      where: { name: validatedFields.data.name },
    });

    if (existing && existing.name !== name) {
      return { success: false, error: 'Nama jabatan sudah digunakan.' };
    }

    const role = await prisma.role.update({
      where: { name },
      data: {
        name: validatedFields.data.name,
        description: validatedFields.data.description || null,
        permissions: {
          set: validatedFields.data.permissions.map((id) => ({ id })),
        },
      },
    });

    revalidatePath(BASE_PATH);
    revalidatePath(`${BASE_PATH}/${role.name}`);

    return {
      success: true,
      data: role as unknown as Role,
      message: 'Jabatan berhasil diperbarui.',
    };
  } catch (error) {
    return { success: false, error: 'Gagal memperbarui jabatan.' };
  }
}

/**
 * Update Role berdasarkan ID (UUID)
 */
export async function updateRoleById(id: string, values: RoleValues): Promise<RoleResponse> {
  const hasAccess = await verifyPermission('role.update');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk mengubah data.' };
  }

  const validatedFields = roleSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, error: 'Input tidak valid.' };
  }

  try {
    const current = await prisma.role.findUnique({
      where: { id },
    });

    if (!current) {
      return { success: false, error: 'Jabatan tidak ditemukan.' };
    }

    // Cek duplikasi nama jika nama berubah
    if (validatedFields.data.name !== current.name) {
      const duplicate = await prisma.role.findFirst({
        where: {
          name: { equals: validatedFields.data.name, mode: 'insensitive' },
          id: { not: id },
        },
      });
      if (duplicate) {
        return { success: false, error: 'Nama jabatan sudah digunakan.' };
      }
    }

    const role = await prisma.role.update({
      where: { id },
      data: {
        name: validatedFields.data.name,
        description: validatedFields.data.description || null,
        permissions: {
          set: validatedFields.data.permissions.map((permId) => ({ id: permId })),
        },
      },
    });

    revalidatePath(BASE_PATH);
    revalidatePath(`${BASE_PATH}/${id}`);

    return {
      success: true,
      data: role as unknown as Role,
      message: 'Jabatan berhasil diperbarui.',
    };
  } catch (error) {
    return { success: false, error: 'Gagal memperbarui jabatan.' };
  }
}

/**
 * Hapus Role
 */
export async function deleteRole(id: string): Promise<RoleResponse> {
  const hasAccess = await verifyPermission('role.delete');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk menghapus data.' };
  }

  try {
    const existing = await prisma.role.findFirst({
      where: { id },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    if (existing && existing._count.users > 0) {
      return {
        success: false,
        error: 'Jabatan tidak bisa dihapus karena masih digunakan oleh user.',
      };
    }

    await prisma.role.delete({
      where: { id },
    });

    revalidatePath(BASE_PATH);

    return { success: true, message: 'Jabatan berhasil dihapus.' };
  } catch (error) {
    return { success: false, error: 'Gagal menghapus jabatan.' };
  }
}
