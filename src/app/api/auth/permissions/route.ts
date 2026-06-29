import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ success: false, permissions: [] }, { status: 401 });
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

    if (!user) {
      return NextResponse.json({ success: false, permissions: [] }, { status: 404 });
    }

    // Ambil permissions dari relasi many-to-many (roles)
    const permissionsSet = new Set<string>();

    user.roles.forEach((role) => {
      role.permissions.forEach((p) => permissionsSet.add(p.name));
    });

    // Jika ada roleId (one-to-many), ambil juga permissions-nya
    if (user.roleId) {
      const singleRole = await prisma.role.findUnique({
        where: { id: user.roleId },
        include: { permissions: { select: { name: true } } },
      });
      singleRole?.permissions.forEach((p) => permissionsSet.add(p.name));
    }

    const permissions = Array.from(permissionsSet);

    return NextResponse.json({ success: true, permissions });
  } catch (error) {
    console.error('Fetch permissions error:', error);
    return NextResponse.json({ success: false, permissions: [] }, { status: 500 });
  }
}
