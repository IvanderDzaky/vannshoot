'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  Cog,
  CreditCard,
  LogOut,
  Moon,
  Sparkles,
  Sun,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { signOut } from '@/lib/authClient';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';
import UserSettingsModal from './UserSettingsModal';

export function UserSetting({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { mutate: handleLogout, isPending } = useMutation({
    mutationFn: async () => {
      // Menggunakan signOut dari authClient untuk keandalan maksimal
      const { error } = await signOut();
      if (error) {
        throw new Error('Gagal keluar dari sistem.');
      }
    },
    onSuccess: () => {
      toast.success('Berhasil keluar. Sampai jumpa!');
      router.push('/login');
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg font-bold">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg font-bold">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {/* <DropdownMenuItem className="flex cursor-pointer items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="mr-2">
                    {theme === 'light' ? <Sun className="size-4" /> : <Moon className="size-4" />}
                  </div>
                  Ganti Tema
                </div>
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={(value) => setTheme(value ? 'dark' : 'light')}
                />
              </DropdownMenuItem> */}
              <DropdownMenuItem onClick={() => setIsSettingsOpen(true)} className="cursor-pointer">
                <Cog className="size-4" />
                Pengaturan
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleLogout()}
              disabled={isPending}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="size-4" />
              {isPending ? 'Keluar...' : 'Log out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <UserSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
      />
    </SidebarMenu>
  );
}
