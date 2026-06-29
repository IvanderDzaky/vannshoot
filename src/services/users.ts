'use server';

import { z } from 'zod';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { userSchema } from '@/schemas/users';
import type { User, UserResponse, UserPaginationResponse } from '@/interfaces/features/users';
import { verifyPermission } from './security';

const BASE_PATH = '/admin/managements/users';

export type UserValues = z.infer<typeof userSchema>;

/**
 * Mengambil data users dengan pagination dan pencarian
 */
export async function getUsers(
  page: number = 1,
  limit: number = 10,
  search: string = ''
): Promise<UserPaginationResponse> {
  const hasAccess = await verifyPermission('user.read');
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
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          roles: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      success: true,
      data: data as unknown as User[],
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Get Users Error:', error);
    return {
      success: false,
      data: [],
      meta: { total: 0, page: 1, lastPage: 0 },
    };
  }
}

/**
 * Mengambil data user berdasarkan ID
 */
export async function getUserById(id: string): Promise<UserResponse> {
  const hasAccess = await verifyPermission('user.read');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses.' };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          select: { id: true, name: true },
        },
      },
    });

    if (!user) {
      return { success: false, error: 'Pengguna tidak ditemukan.' };
    }

    return { success: true, data: user as unknown as User };
  } catch (error) {
    return { success: false, error: 'Gagal mengambil data pengguna.' };
  }
}

/**
 * Membuat User baru
 */
export async function createUser(values: UserValues): Promise<UserResponse> {
  const hasAccess = await verifyPermission('user.create');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk membuat data.' };
  }

  const validatedFields = userSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, error: 'Input tidak valid.' };
  }

  if (!values.password) {
    return { success: false, error: 'Password wajib diisi untuk pengguna baru.' };
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { email: validatedFields.data.email },
    });

    if (existing) {
      return { success: false, error: 'Email sudah digunakan.' };
    }

    // Gunakan Better Auth API untuk membuat user (menangani password hashing)
    const result = await auth.api.createUser({
      body: {
        email: validatedFields.data.email,
        password: values.password,
        name: validatedFields.data.name,
      },
    });

    if (!result || !result.user) {
      return { success: false, error: 'Gagal membuat akun melalui auth provider.' };
    }

    // Update role dan status verifikasi
    await prisma.user.update({
      where: { id: result.user.id },
      data: {
        emailVerified: true,
        roles: {
          connect: { id: validatedFields.data.roleId },
        },
        roleId: validatedFields.data.roleId, // Set kolom roleId juga untuk kompatibilitas
      },
    });

    revalidatePath(BASE_PATH);

    return {
      success: true,
      message: 'Pengguna berhasil dibuat.',
    };
  } catch (error) {
    console.error('Create User Error:', error);
    return { success: false, error: 'Gagal membuat pengguna.' };
  }
}

/**
 * Update User
 */
export async function updateUser(id: string, values: UserValues): Promise<UserResponse> {
  const hasAccess = await verifyPermission('user.update');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk mengubah data.' };
  }

  const validatedFields = userSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, error: 'Input tidak valid.' };
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, error: 'Pengguna tidak ditemukan.' };
    }

    // Update data dasar via Prisma
    await prisma.user.update({
      where: { id },
      data: {
        name: validatedFields.data.name,
        email: validatedFields.data.email,
        image: validatedFields.data.image,
        roles: {
          set: [{ id: validatedFields.data.roleId }],
        },
        roleId: validatedFields.data.roleId,
      },
    });

    // Reset password jika diisi (hanya superadmin yang bisa mengirim field ini)
    if (validatedFields.data.newPassword && validatedFields.data.newPassword.trim() !== '') {
      await auth.api.setUserPassword({
        body: {
          userId: id,
          newPassword: validatedFields.data.newPassword,
        },
      });
    }

    revalidatePath(BASE_PATH);

    return {
      success: true,
      message: 'Pengguna berhasil diperbarui.',
    };
  } catch (error) {
    console.error('Update User Error:', error);
    return { success: false, error: 'Gagal memperbarui pengguna.' };
  }
}

/**
 * Hapus User
 */
export async function deleteUser(id: string): Promise<UserResponse> {
  const hasAccess = await verifyPermission('user.delete');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk menghapus data.' };
  }

  try {
    // Gunakan admin API better-auth jika memungkinkan, atau hapus langsung via Prisma
    // Di sini kita hapus langsung via Prisma untuk kesederhanaan,
    // Better-auth akan menangani session yang hangus secara otomatis.
    await prisma.user.delete({
      where: { id },
    });

    revalidatePath(BASE_PATH);

    return { success: true, message: 'Pengguna berhasil dihapus.' };
  } catch (error) {
    console.error('Delete User Error:', error);
    return { success: false, error: 'Gagal menghapus pengguna.' };
  }
}

/**
 * Mengambil data permissions dan roles user yang sedang login
 */
export async function getCurrentUserData(): Promise<{ permissions: string[]; roles: string[] }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) return { permissions: [], roles: [] };

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        roles: {
          include: {
            permissions: {
              select: { name: true },
            },
          },
        },
      },
    });

    const permissionsSet = new Set<string>();
    const roles: string[] = user?.roles.map((r) => r.name) || [];

    user?.roles.forEach((role) => {
      role.permissions.forEach((p) => permissionsSet.add(p.name));
    });

    if (user?.roleId) {
      const singleRole = await prisma.role.findUnique({
        where: { id: user.roleId },
        include: { permissions: { select: { name: true } } },
      });
      if (singleRole) {
        if (!roles.includes(singleRole.name)) roles.push(singleRole.name);
        singleRole.permissions.forEach((p) => permissionsSet.add(p.name));
      }
    }

    return {
      permissions: Array.from(permissionsSet),
      roles,
    };
  } catch (error) {
    console.error('Get Current User Data Error:', error);
    return { permissions: [], roles: [] };
  }
}
