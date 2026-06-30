import { Camera, Folder, Home, ShoppingBag, UserCog, type LucideIcon } from 'lucide-react';

type SideLinks = {
  versions: string[];
  navMain: {
    title: string;
    url: string;
    hasChildren: boolean;
    icon: LucideIcon;
    permission?: string;
    items?: {
      title: string;
      url: string;
      icon: LucideIcon;
      permission?: string;
      isActive?: boolean;
    }[];
  }[];
};

export const sideLinks: SideLinks = {
  versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
  navMain: [
    {
      title: 'Dashboard',
      url: 'dashboard',
      hasChildren: false,
      icon: Home,
      permission: 'admin.access',
    },
    {
      title: 'Data Master',
      url: 'master',
      hasChildren: true,
      icon: Folder,
      items: [
        {
          title: 'Kategori Portofolio',
          url: 'master/portfolio-categories',
          icon: Folder,
          permission: 'portfolio.category.read',
        },
        {
          title: 'Portofolio',
          url: 'master/portfolio',
          icon: Folder,
          permission: 'portfolio.read',
        },
      ],
    },
    {
      title: 'Pelayanan',
      url: 'services',
      hasChildren: true,
      icon: Camera,
      items: [
        {
          title: 'Klien',
          url: 'services/clients',
          icon: Camera,
          permission: 'client.read',
        },
        {
          title: 'Testimoni',
          url: 'services/testimonials',
          icon: Camera,
          permission: 'testimonial.read',
        },
      ],
    },
    {
      title: 'Transaksi',
      url: 'transactions',
      hasChildren: true,
      icon: ShoppingBag,
      items: [
        {
          title: 'Orders',
          url: 'transactions/orders',
          icon: ShoppingBag,
          permission: 'order.read',
        },
      ],
    },
    {
      title: 'Manajemen',
      url: 'managements',
      hasChildren: true,
      icon: UserCog,
      items: [
        {
          title: 'Hak Akses',
          url: 'managements/permissions',
          icon: UserCog,
          permission: 'permission.read',
        },
        {
          title: 'Jabatan',
          url: 'managements/roles',
          icon: UserCog,
          permission: 'role.read',
        },
        {
          title: 'Pengguna',
          url: 'managements/users',
          icon: UserCog,
          permission: 'user.read',
        },
      ],
    },
  ],
};
