'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { resolveLabel } from '@/services/labels';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { SearchForm } from '@/components/Mixins/Sidebar/SearchForm';

const isUUID = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

const labelMapping: Record<string, string> = {
  dashboard: 'Dashboard',
  managements: 'Manajemen',
  publications: 'Publikasi',
  services: 'Pelayanan',
  master: 'Data Master',
  'portfolio-categories': 'Kategori Portofolio',
  portfolio: 'Portofolio',
  clients: 'Klien',
  testimonials: 'Testimoni',
  users: 'Pengguna',
  roles: 'Jabatan',
  permissions: 'Hak Akses',
  new: 'Tambah',
  transactions: 'Transaksi',
  'order-settings': 'Pengaturan Order',
  orders: 'Order',
};

export function CMSHeader() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter((v) => v);
  const [resolvedLabels, setResolvedLabels] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchLabels = async () => {
      const newLabels: Record<string, string> = {};
      let changed = false;

      for (let i = 0; i < pathSegments.length; i++) {
        const segment = pathSegments[i];
        const prevSegment = pathSegments[i - 1];

        // Skip static segments or already resolved ones
        if (labelMapping[segment] || resolvedLabels[segment]) continue;

        // Resolve dynamic segments based on parent
        const resolvableParents = [
          'portfolio-categories',
          'clients',
          'portfolio',
          'youtube-links',
          'articles',
          'users',
          'roles',
          'testimonials',
        ];
        if (prevSegment && resolvableParents.includes(prevSegment)) {
          const label = await resolveLabel(segment, prevSegment);
          if (label) {
            newLabels[segment] = label;
            changed = true;
          }
        }
      }

      if (changed) {
        setResolvedLabels((prev) => ({ ...prev, ...newLabels }));
      }
    };

    fetchLabels();
  }, [pathSegments, pathname, resolvedLabels]); // Re-run when path changes

  const formatSegment = (segment: string) => {
    if (labelMapping[segment]) return labelMapping[segment];
    if (resolvedLabels[segment]) return resolvedLabels[segment];

    return segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <header className="z-10 sticky top-0 flex h-16 w-full shrink-0 items-center justify-between gap-2 border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />

        <Breadcrumb>
          <BreadcrumbList>
            {pathSegments.length > 0 && (
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/admin/dashboard">Vannshoot CMS</BreadcrumbLink>
              </BreadcrumbItem>
            )}

            {pathSegments.map((segment, index) => {
              if (segment === 'admin') return null;

              const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
              const isLast = index === pathSegments.length - 1;
              const label = formatSegment(segment);

              const staticSegments = [
                'managements',
                'publications',
                'services',
                'master',
                'transactions',
              ];
              const isNonClickable = staticSegments.includes(segment);

              return (
                <div key={href} className="flex items-center gap-2">
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    {isLast || isNonClickable ? (
                      <BreadcrumbPage>{label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={href} className="hidden md:block">
                        {label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <SearchForm />
    </header>
  );
}
