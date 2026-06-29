'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CornerDownLeft, Home, Search } from 'lucide-react';
import type { Route } from 'next';

import { useMounted } from '@/hooks/useMounted';
import { Label } from '@/components/ui/label';
import { SidebarInput } from '@/components/ui/sidebar';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { sideLinks } from './constant/sideLinks';

const BASE_ADMIN_PATH = '/admin';

export function SearchForm() {
  const isMounted = useMounted();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (!isMounted) return;
    setIsMac(navigator.userAgent.toLowerCase().includes('mac'));

    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isMounted]);

  if (!isMounted) {
    return <div className="h-8 w-40 animate-pulse rounded-md bg-sidebar-accent" />;
  }

  return (
    <>
      <div className="relative">
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <SidebarInput
          id="search"
          onClick={() => setOpen(true)}
          readOnly
          placeholder="Cari Menu..."
          className="cursor-pointer pl-8 pr-12 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
        <kbd className="pointer-events-none absolute top-1/2 right-2 flex h-5 -translate-y-1/2 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
          <span className="text-xs">{isMac ? '⌘' : 'Ctrl'}</span>+ K
        </kbd>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Cari Menu..." />
          <CommandList>
            <CommandEmpty>Oops! Tidak ada hasil.</CommandEmpty>
            {sideLinks.navMain.map((group) => (
              <CommandGroup key={group.title} heading={group.title}>
                {group.hasChildren ? (
                  group.items?.map((item) => (
                    <CommandItem
                      key={item.title}
                      onSelect={() => {
                        router.push(`${BASE_ADMIN_PATH}/${item.url}` as Route);
                        setOpen(false);
                      }}
                    >
                      {item.title}
                    </CommandItem>
                  ))
                ) : (
                  <CommandItem
                    key={group.title}
                    onSelect={() => {
                      router.push(`${BASE_ADMIN_PATH}/${group.url}` as Route);
                      setOpen(false);
                    }}
                  >
                    {group.title}
                  </CommandItem>
                )}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Cari Menu..." className="border-none focus:ring-0" />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>Oops! Tidak ada hasil.</CommandEmpty>

            {sideLinks.navMain.map((group) => (
              <CommandGroup key={group.title} heading={group.title} className="px-2">
                {group.hasChildren ? (
                  group.items?.map((item) => (
                    <CommandItem
                      key={item.title}
                      onSelect={() => {
                        router.push(`${BASE_ADMIN_PATH}/${item.url}` as Route);
                        setOpen(false);
                      }}
                      className="group flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm outline-none hover:bg-accent aria-selected:bg-accent"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="size-4 text-muted-foreground group-hover:text-foreground" />
                        <span>{item.title}</span>
                      </div>
                    </CommandItem>
                  ))
                ) : (
                  <CommandItem
                    key={group.title}
                    onSelect={() => {
                      router.push(`${BASE_ADMIN_PATH}/${group.url}` as Route);
                      setOpen(false);
                    }}
                    className="group flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm outline-none hover:bg-accent aria-selected:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <Home className="size-4 text-muted-foreground group-hover:text-foreground" />
                      <span>{group.title}</span>
                    </div>
                  </CommandItem>
                )}
              </CommandGroup>
            ))}
          </CommandList>

          <div className="flex items-center gap-2 border-t bg-muted/50 px-4 py-3 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1.5 rounded border bg-background px-1.5 py-0.5 font-mono font-medium">
              <CornerDownLeft className="size-3" />
            </div>
            <span className="font-medium uppercase tracking-wider">Menuju ke Halaman</span>
          </div>
        </Command>
      </CommandDialog>
    </>
  );
}
