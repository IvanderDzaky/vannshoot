'use client';

import * as React from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useMounted } from '@/hooks/useMounted';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { sideLinks } from './constant/sideLinks';
import { UserSetting } from './UserSetting';
import Image from 'next/image';
import { useTheme } from 'next-themes';

const BASE_ADMIN_PATH = '/admin';

export function AppSidebar({
  session,
  permissions,
  ...props
}: React.ComponentProps<typeof Sidebar> & { session: any; permissions: string[] }) {
  const isMounted = useMounted();
  const { resolvedTheme } = useTheme();

  const [logoSrc, setLogoSrc] = React.useState('/assets/img/ttn-logo.jpg');

  React.useEffect(() => {
    if (isMounted) {
      const newSrc =
        resolvedTheme === 'dark' ? '/assets/img/ttn-logo.jpg' : '/assets/img/ttn-logo.jpg';
      setLogoSrc(newSrc);
    }
  }, [resolvedTheme, isMounted]);

  const userPermissions = permissions || [];

  if (!isMounted) {
    return (
      <Sidebar {...props}>
        <SidebarHeader>
          <div className="flex h-12 items-center px-4">
            <div className="h-8 w-32 animate-pulse rounded-md bg-sidebar-accent" />
          </div>
        </SidebarHeader>
        <SidebarContent className="gap-0">
          <SidebarGroup>
            <div className="space-y-2 p-2">
              <div className="h-8 w-full animate-pulse rounded-md bg-sidebar-accent" />
              <div className="h-8 w-full animate-pulse rounded-md bg-sidebar-accent" />
            </div>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    );
  }

  // Mapping data dari session untuk UserSetting
  const userData = {
    name: session?.user?.name || 'User',
    email: session?.user?.email || '...',
    avatar: session?.user?.image || '',
  };

  const hasPermission = (permission?: string) => {
    if (!permission) return true;
    return userPermissions.includes(permission);
  };

  const filteredNavMain = sideLinks.navMain
    .map((item) => {
      // Filter children first
      const visibleItems = item.items?.filter((subItem) => hasPermission(subItem.permission));

      // If item has children, show if at least one child is visible
      if (item.hasChildren) {
        if (visibleItems && visibleItems.length > 0) {
          return { ...item, items: visibleItems };
        }
        return null;
      }

      // If item has no children, check its own permission
      if (hasPermission(item.permission)) {
        return item;
      }

      return null;
    })
    .filter(Boolean) as typeof sideLinks.navMain;

  return (
    <Sidebar {...props}>
      <SidebarHeader className="flex items-center justify-center p-4">
        {/* Menggunakan img standar sementara untuk memastikan path benar-benar bisa diakses */}
        <img src={logoSrc} alt="Logo" className="w-auto h-20 object-contain" loading="lazy" />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {filteredNavMain.map((item) => (
          <SidebarGroup key={item.title}>
            {item.hasChildren ? (
              <Collapsible defaultOpen className="group/collapsible">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="font-medium text-sidebar-foreground hover:bg-sidebar-accent">
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link href={`${BASE_ADMIN_PATH}/${subItem.url}` as Route}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href={`${BASE_ADMIN_PATH}/${item.url}` as Route}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <UserSetting user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
