'use server';

import { prisma } from '@/lib/prisma';
import { verifyPermission } from './security';

export async function getOrders(page: number = 1, limit: number = 10, search: string = '') {
  const hasAccess = await verifyPermission('order.read');
  if (!hasAccess) {
    return {
      success: false,
      data: [],
      meta: { total: 0, page: 1, lastPage: 0 },
      error: 'Anda tidak memiliki hak akses untuk melihat data ini.',
    };
  }

  try {
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { name_customer: { contains: search, mode: 'insensitive' as const } },
            { email_customer: { contains: search, mode: 'insensitive' as const } },
            { phone_customer: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          portfolio: {
            select: {
              title: true,
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    const lastPage = Math.ceil(total / limit);

    return {
      success: true,
      data: data as any[],
      meta: { total, page, lastPage },
    };
  } catch (error) {
    console.error('Get Orders Error:', error);
    return {
      success: false,
      data: [],
      meta: { total: 0, page: 1, lastPage: 0 },
      error: 'Terjadi kesalahan saat mengambil data order.',
    };
  }
}
