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

/**
 * Membuat order baru untuk checkout gambar berbayar dari portfolio dengan perhitungan harga server-side
 */
export async function createSimulatedOrder(data: {
  name_customer: string;
  email_customer: string;
  phone_customer: string;
  portfolioId: string;
  imageUrl?: string;
  quantity?: number;
}) {
  try {
    if (!data.name_customer || !data.email_customer || !data.phone_customer || !data.portfolioId) {
      return { success: false, error: 'Data pembeli dan portfolio wajib diisi.' };
    }

    const portfolio = await prisma.portfolio.findUnique({
      where: { id: data.portfolioId },
      select: { id: true, price: true, title: true },
    });

    if (!portfolio) {
      return { success: false, error: 'Portfolio tidak ditemukan.' };
    }

    const pricePerUnit = portfolio.price ?? 0;
    const quantity = data.quantity && data.quantity > 0 ? data.quantity : 1;

    // Ambil order setting publik untuk menghitung biaya layanan jika ada
    const settingResult = await prisma.orderSetting.findFirst();
    let serviceFee = 0;
    if (settingResult?.serviceCharge && settingResult.value) {
      if (settingResult.serviceType === 'PERCENTAGE') {
        serviceFee = (pricePerUnit * quantity * settingResult.value) / 100;
      } else {
        serviceFee = settingResult.value;
      }
    }

    const totalPrice = pricePerUnit * quantity + serviceFee;

    // Cari record PortfolioImage berdasarkan image path jika ada
    let portfolioImageId: string | null = null;
    if (data.imageUrl) {
      const imgRecord = await prisma.portfolioImage.findFirst({
        where: { image: data.imageUrl, portfolioId: data.portfolioId },
      });
      if (imgRecord) {
        portfolioImageId = imgRecord.id;
      }
    }

    // Buat data order
    const order = await prisma.order.create({
      data: {
        name_customer: data.name_customer.trim(),
        email_customer: data.email_customer.trim().toLowerCase(),
        phone_customer: data.phone_customer.trim(),
        portfolioId: data.portfolioId,
        price_per_unit: pricePerUnit,
        total_price: totalPrice,
        status: 'PENDING',
        type: 'PRODUCT',
        quantity: quantity,
        ...(portfolioImageId
          ? {
              orderImages: {
                create: {
                  portfolioImageId: portfolioImageId,
                },
              },
            }
          : {}),
      },
    });

    return { success: true, orderId: order.id, totalPrice, pricePerUnit, serviceFee };
  } catch (error) {
    console.error('Create Order Error:', error);
    return { success: false, error: 'Gagal membuat order.' };
  }
}

/**
 * Mendapatkan status order berdasarkan ID
 */
export async function getOrderStatus(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { status: true },
    });
    if (!order) {
      return { success: false, error: 'Order tidak ditemukan.' };
    }
    return { success: true, status: order.status };
  } catch (error) {
    console.error('Get Order Status Error:', error);
    return { success: false, error: 'Gagal mengambil status order.' };
  }
}

/**
 * Mensimulasikan callback sukses pembayaran dari Payment Gateway
 */
export async function simulatePaymentCallback(orderId: string) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CONFIRMED' },
    });
    return { success: true, status: order.status };
  } catch (error) {
    console.error('Simulate Payment Callback Error:', error);
    return { success: false, error: 'Gagal memproses konfirmasi pembayaran.' };
  }
}

/**
 * Mengubah status order menjadi WAITING_CONFIRMATION setelah user melakukan pembayaran,
 * lalu mengirim notifikasi ke admin via Telegram bot.
 */
export async function setWaitingConfirmation(orderId: string) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'WAITING_CONFIRMATION' },
      include: {
        portfolio: {
          select: {
            title: true,
            city: true,
            location: true,
          },
        },
      },
    });

    // Kirim notifikasi Telegram ke admin (fire-and-forget, tidak block response)
    import('@/lib/telegram').then(({ sendOrderNotification }) => {
      sendOrderNotification(order).catch((err) =>
        console.error('[setWaitingConfirmation] Telegram notification error:', err)
      );
    });

    return { success: true, status: order.status };
  } catch (error) {
    console.error('Set Waiting Confirmation Error:', error);
    return { success: false, error: 'Gagal mengubah status order.' };
  }
}

/**
 * Membatalkan order jika batas waktu pembayaran habis
 */
export async function cancelOrder(orderId: string) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });
    return { success: true, status: order.status };
  } catch (error) {
    console.error('Cancel Order Error:', error);
    return { success: false, error: 'Gagal membatalkan order.' };
  }
}
