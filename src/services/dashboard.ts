'use server';

import { prisma } from '@/lib/prisma';
import { verifySession } from './security';

import type { DashboardStats } from '@/interfaces/features/dashboard';

export async function getDashboardData(): Promise<DashboardStats | null> {
  try {
    const session = await verifySession();
    if (!session || !session.user) {
      return null;
    }

    // Parallel counts for existing models in database
    const [
      portfolioCount,
      portfolioCategoryCount,
      testimonialCount,
      clientCount,
      clientCategoryCount,
      orderCount,
      userCount,
      roleCount,
    ] = await Promise.all([
      prisma.portfolio.count(),
      prisma.portfolioCategory.count(),
      prisma.testimonial.count(),
      prisma.client.count(),
      prisma.clientCategory.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.role.count(),
    ]);

    // Fetch recent portfolios from database
    const dbRecentPortfolios = await prisma.portfolio.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        cover: true,
        city: true,
        createdAt: true,
        categories: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    const recentPortfolios = dbRecentPortfolios.map((portfolio) => ({
      id: portfolio.id,
      title: portfolio.title,
      cover: portfolio.cover,
      city: portfolio.city,
      createdAt: portfolio.createdAt,
      categories: portfolio.categories.map((c) => ({
        id: c.id,
        title: c.title,
      })),
    }));

    // Fetch portfolio category distribution dynamically
    const categoriesWithCounts = await prisma.portfolioCategory.findMany({
      select: {
        id: true,
        title: true,
        portfolios: {
          select: { id: true },
        },
      },
    });

    const portfolioCategoryDistribution = categoriesWithCounts.map((cat) => {
      const count = cat.portfolios.length;
      const percentage = portfolioCount > 0 ? Math.round((count / portfolioCount) * 100) : 0;
      return {
        id: cat.id,
        title: cat.title,
        count,
        percentage,
      };
    });

    return {
      counts: {
        portfolios: portfolioCount,
        portfolioCategories: portfolioCategoryCount,
        testimonials: testimonialCount,
        clients: clientCount,
        clientCategories: clientCategoryCount,
        orders: orderCount,
        users: userCount,
        roles: roleCount,
      },
      recentPortfolios,
      portfolioCategoryDistribution,
    };
  } catch (error) {
    console.error('Get Dashboard Data Error:', error);
    return null;
  }
}
