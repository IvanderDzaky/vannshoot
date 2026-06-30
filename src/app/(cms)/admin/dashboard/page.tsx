import Link from 'next/link';
import type { Route } from 'next';
import {
  Camera,
  MessageSquare,
  Plus,
  Users,
  LayoutDashboard,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  UserPlus,
  ShoppingBag,
} from 'lucide-react';

import GreetingCard from '@/components/Common/GreetingCard';
import { getDashboardData } from '@/services/dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const DashboardCMS = async () => {
  const data = await getDashboardData();

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <p className="text-muted-foreground">Gagal memuat data dashboard.</p>
      </div>
    );
  }

  const { counts, recentPortfolios, portfolioCategoryDistribution } = data;

  // Modern colors/gradients for stats cards
  const statsConfig = [
    {
      title: 'Total Portofolio',
      value: counts.portfolios,
      description: `${counts.portfolioCategories} Kategori Portofolio`,
      icon: Camera,
      href: '/admin/master/portfolio',
      colorClass:
        'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-100 dark:border-emerald-950',
    },
    {
      title: 'Total Order',
      value: counts.orders,
      description: 'Pesanan Layanan & Produk',
      icon: ShoppingBag,
      href: '/admin/transactions/orders',
      colorClass:
        'text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-500/20 border-blue-100 dark:border-blue-950',
    },
    {
      title: 'Total Testimoni',
      value: counts.testimonials,
      description: 'Review dari Klien',
      icon: MessageSquare,
      href: '/admin/services/testimonials',
      colorClass:
        'text-rose-600 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-500/20 border-rose-100 dark:border-rose-950',
    },
    {
      title: 'Total Klien',
      value: counts.clients,
      description: `${counts.clientCategories} Kategori Klien`,
      icon: Users,
      href: '/admin/services/clients',
      colorClass:
        'text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/20 border-amber-100 dark:border-amber-950',
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* 1. Welcoming Section */}
      <GreetingCard />

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsConfig.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card
              key={idx}
              className="hover:scale-[1.02] hover:shadow-lg transition-all duration-300 shadow-md border-none ring-0 group"
            >
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {stat.title}
                  </p>
                  <h3 className="text-3xl font-extrabold tracking-tight text-foreground">
                    {stat.value}
                  </h3>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
                <div
                  className={`p-3 rounded-xl border ${stat.colorClass} transition-transform duration-300 group-hover:-rotate-6`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </CardContent>
              <div className="px-6 pb-4 pt-2 flex justify-end">
                <Link
                  href={stat.href as Route}
                  className="text-xs text-muted-foreground group-hover:text-primary flex items-center gap-1 transition-colors font-medium"
                >
                  Kelola{' '}
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 3. Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Recents (col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Portfolios Card */}
          <Card className="shadow-md border-none ring-0">
            <CardHeader className="flex flex-row items-center justify-between border-b border-foreground/5 pb-4">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" /> Portofolio Terbaru
                </CardTitle>
                <CardDescription>Hasil karya fotografi yang baru ditambahkan</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={'/admin/master/portfolio' as Route}>Lihat Semua</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href={'/admin/master/portfolio/new' as Route}>
                    <Plus className="w-4 h-4 mr-1" /> Baru
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {recentPortfolios.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  Belum ada portofolio yang dibuat.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recentPortfolios.map((portfolio) => (
                    <div
                      key={portfolio.id}
                      className="border border-foreground/5 rounded-lg p-3 hover:border-primary/30 transition-all flex gap-3 group relative"
                    >
                      <div className="w-14 h-14 rounded overflow-hidden bg-muted shrink-0 relative border border-foreground/5">
                        {portfolio.cover ? (
                          <img
                            src={portfolio.cover}
                            alt={portfolio.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                            P
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-semibold text-xs truncate group-hover:text-primary transition-colors">
                            <Link href={`/admin/master/portfolio/${portfolio.id}` as Route}>
                              {portfolio.title}
                            </Link>
                          </h4>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            {portfolio.categories.map((c) => (
                              <Badge
                                key={c.id}
                                className="text-[9px] px-1 py-0 bg-[#4e7145]/10 text-[#4e7145] hover:bg-[#4e7145]/20 border-[#4e7145]/20"
                              >
                                {c.title}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] text-muted-foreground">
                            {portfolio.city || 'Luar Kota'}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {formatDate(portfolio.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Distributions & System Shortcuts */}
        <div className="space-y-6">
          {/* Portfolio Category Distribution Card */}
          <Card className="shadow-md border-none ring-0">
            <CardHeader className="border-b border-foreground/5 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-primary" /> Distribusi Portofolio
              </CardTitle>
              <CardDescription>Penyebaran karya berdasarkan kategori</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {portfolioCategoryDistribution.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  Belum ada kategori portofolio.
                </div>
              ) : (
                <div className="space-y-4">
                  {portfolioCategoryDistribution.map((item) => (
                    <div key={item.id} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-foreground">{item.title}</span>
                        <span className="text-muted-foreground font-semibold">
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-foreground/5 rounded-full h-2">
                        <div
                          className="bg-[#4e7145] h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Info / Quick Shortcuts */}
          <Card className="shadow-md border-none ring-0">
            <CardHeader className="border-b border-foreground/5 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" /> Pintasan Sistem & Akun
              </CardTitle>
              <CardDescription>Akses cepat ke konfigurasi utama</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-foreground/5 rounded-lg border border-foreground/5 hover:border-foreground/10 transition-colors flex flex-col justify-center">
                  <span className="text-2xl font-black text-foreground">{counts.orders}</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold mt-1">
                    Pesanan (Orders)
                  </span>
                  <Link
                    href={'/admin/transactions/orders' as Route}
                    className="text-[10px] text-primary hover:underline mt-2 flex items-center justify-center gap-0.5"
                  >
                    Kelola <ExternalLink className="w-2.5 h-2.5" />
                  </Link>
                </div>
                <div className="p-3 bg-foreground/5 rounded-lg border border-foreground/5 hover:border-foreground/10 transition-colors flex flex-col justify-center">
                  <span className="text-2xl font-black text-foreground">{counts.users}</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold mt-1">
                    Staf Aktif
                  </span>
                  <Link
                    href="/admin/managements/users"
                    className="text-[10px] text-primary hover:underline mt-2 flex items-center justify-center gap-0.5"
                  >
                    Kelola <ExternalLink className="w-2.5 h-2.5" />
                  </Link>
                </div>
              </div>

              <div className="space-y-2 mt-4 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start text-xs text-muted-foreground"
                  asChild
                >
                  <Link href="/admin/managements/roles">
                    <ShieldCheck className="w-4 h-4 mr-2 text-primary" /> Pengaturan Jabatan & Hak
                    Akses
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-start text-xs text-muted-foreground"
                  asChild
                >
                  <Link href="/admin/managements/users/new">
                    <UserPlus className="w-4 h-4 mr-2 text-primary" /> Daftarkan Staff Baru
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardCMS;
