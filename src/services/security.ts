import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

/**
 * Helper untuk mengecek hak akses di sisi server (Server Actions / Route Handlers)
 * Menjamin keamanan data dari akses yang tidak sah melalui manipulasi client-side.
 */
export async function verifyPermission(permissionName: string): Promise<boolean> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return false;
    }

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

    if (!user) return false;

    const permissionsSet = new Set<string>();

    // Cek permissions dari relasi multi-roles
    user.roles.forEach((role) => {
      role.permissions.forEach((p) => permissionsSet.add(p.name));
    });

    // Cek permissions dari roleId (relasi legacy/tunggal jika ada)
    if (user.roleId) {
      const singleRole = await prisma.role.findUnique({
        where: { id: user.roleId },
        include: { permissions: { select: { name: true } } },
      });
      singleRole?.permissions.forEach((p) => permissionsSet.add(p.name));
    }

    return permissionsSet.has(permissionName);
  } catch (error) {
    console.error('Verify Permission Error:', error);
    return false;
  }
}

/**
 * Memastikan user sudah login.
 */
export async function verifySession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}
