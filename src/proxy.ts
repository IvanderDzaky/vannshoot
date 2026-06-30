import { NextRequest, NextResponse } from 'next/server';
import { auth } from './lib/auth';
import { prisma } from './lib/prisma';

/**
 * Next.js 16 Proxy implementation for Route Protection
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPath = pathname.startsWith('/admin');
  const isAuthPath = pathname.startsWith('/login');

  const cmsSegments = ['master', 'services', 'managements', 'transactions']; // perlu ditambahkan
  const isCMSPath = cmsSegments.some((segment) => pathname.startsWith(`/admin/${segment}`));

  // Jika bukan path yang diproteksi, langsung lewat saja (optimasi)
  if (!isAdminPath && !isAuthPath && !isCMSPath) {
    return NextResponse.next();
  }

  try {
    // Ambil session secara langsung dari database via Better Auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // Cek apakah session benar-benar valid dan belum kedaluwarsa
    const isAuthenticated = !!(
      session &&
      session.user &&
      session.session &&
      new Date(session.session.expiresAt) > new Date()
    );

    // Blocker 1: Jika akses /admin tapi BELUM login -> Tendang ke /login
    if (isAdminPath && !isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Ambil permissions jika sudah login dan ingin akses /admin
    if (isAdminPath && isAuthenticated) {
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
        return NextResponse.redirect(new URL('/login', request.url));
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

      const hasAdminAccess = permissionsSet.has('admin.access');

      // Jika tidak punya akses admin, tendang ke landing page atau kasih error
      if (!hasAdminAccess) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    // Blocker 2: Jika akses /login tapi SUDAH login -> Tendang ke /admin/dashboard
    if (isAuthPath && isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    /**
     * Blocker 3: Jika paksa akses segment CMS, lempar ke halaman children pertama masing-masing segment
     * [INFO]: Perlu ditambahkan lagi
     *
     * managements
     *  - permissions
     *  - roles
     *  - users
     */
    if (isCMSPath && isAuthenticated) {
      const redirectMap: Record<string, string> = {
        '/admin/managements': '/admin/managements/permissions',
        '/admin/transactions': '/admin/transactions/orders',
      };

      // Cek apakah URL persis sama dengan key redirect map
      if (redirectMap[pathname]) {
        return NextResponse.redirect(new URL(redirectMap[pathname], request.url));
      }
    }
  } catch (error) {
    console.error('Proxy auth check error:', error);
    // Fail-safe: Jika sistem auth down, proteksi halaman admin tetap berjalan
    if (isAdminPath) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
