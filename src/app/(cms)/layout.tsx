import type { FC, ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AppSidebar } from '@/components/Mixins/Sidebar/AppSidebar';
import { CMSHeader } from '@/components/Mixins/Sidebar/CMSHeader';
import { PermissionProvider } from '@/providers/PermissionProvider';

type Props = {
  children: ReactNode;
};

const CMSLayout: FC<Props> = async ({ children }) => {
  // 1. Ambil session di server
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Jika tidak ada session, tendang ke login
  if (!session || !session.user) {
    return redirect('/login');
  }

  // 2. Ambil permissions di server
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

  const permissions = Array.from(permissionsSet);

  return (
    <TooltipProvider>
      <SidebarProvider>
        <PermissionProvider initialPermissions={permissions} initialRoles={roles}>
          <AppSidebar session={session} permissions={permissions} />
          <SidebarInset>
            <CMSHeader />
            <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
          </SidebarInset>
        </PermissionProvider>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default CMSLayout;
