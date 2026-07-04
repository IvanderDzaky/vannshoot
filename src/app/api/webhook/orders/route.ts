import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOrderNotification } from '@/lib/telegram';

/**
 * POST /api/webhook/orders
 *
 * Endpoint ini berfungsi sebagai penerima callback pembayaran dari sistem eksternal.
 * Ketika user sudah melakukan pembayaran QRIS, pihak eksternal (atau payment gateway)
 * memanggil endpoint ini untuk mengubah status order menjadi WAITING_CONFIRMATION,
 * lalu secara otomatis mengirim notifikasi ke admin via Telegram bot.
 *
 * Body:
 *   - orderId  : string  (ID order yang dibayar)
 *   - secret   : string  (harus cocok dengan WEBHOOK_SECRET di .env)
 *
 * Contoh pemanggilan via curl:
 *   curl -X POST http://localhost:3000/api/orders/webhook \
 *     -H "Content-Type: application/json" \
 *     -d '{"orderId": "uuid-order-disini", "secret": "vanshoot-webhook-secret-2024"}'
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, secret } = body as { orderId?: string; secret?: string };

    // 1. Validasi secret key
    const expectedSecret = process.env.WEBHOOK_SECRET;
    if (!expectedSecret || secret !== expectedSecret) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: secret tidak valid.' },
        { status: 401 }
      );
    }

    // 2. Validasi orderId
    if (!orderId || typeof orderId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Bad Request: orderId tidak boleh kosong.' },
        { status: 400 }
      );
    }

    // 3. Cek apakah order ada dan statusnya PENDING
    const existing = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, status: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Order tidak ditemukan.' },
        { status: 404 }
      );
    }

    if (existing.status !== 'PENDING') {
      return NextResponse.json(
        {
          success: false,
          error: `Order sudah dalam status ${existing.status}, tidak bisa diubah ke WAITING_CONFIRMATION.`,
          currentStatus: existing.status,
        },
        { status: 409 }
      );
    }

    // 4. Update status ke WAITING_CONFIRMATION dengan data lengkap untuk notifikasi
    const updated = await prisma.order.update({
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

    // 5. Kirim notifikasi Telegram ke admin (fire-and-forget)
    sendOrderNotification(updated).catch((err) =>
      console.error('[Webhook] Telegram notification error:', err)
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Status order berhasil diubah ke WAITING_CONFIRMATION.',
        order: { id: updated.id, status: updated.status, updatedAt: updated.updatedAt },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Webhook] Error processing payment callback:', error);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}
