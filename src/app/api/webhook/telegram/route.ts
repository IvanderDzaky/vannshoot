import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { answerCallbackQuery, editMessageText, escapeMarkdown } from '@/lib/telegram';

/**
 * POST /api/webhook/telegram
 *
 * Endpoint ini menerima update dari Telegram Bot (callback_query dari inline button).
 * Telegram akan memanggil URL ini setiap kali ada interaksi dengan pesan bot.
 *
 * Setup webhook Telegram (jalankan sekali):
 *   Development (pakai ngrok):
 *     curl "https://api.telegram.org/bot{TOKEN}/setWebhook?url=https://xxxx.ngrok.io/api/telegram/webhook"
 *
 *   Production:
 *     curl "https://api.telegram.org/bot{TOKEN}/setWebhook?url=https://yourdomain.com/api/telegram/webhook"
 */
export async function POST(req: NextRequest) {
  try {
    // Optional: validate Telegram webhook secret token (set when configuring webhook)
    const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (expectedSecret) {
      const headerSecret =
        req.headers.get('x-telegram-bot-api-secret-token') ??
        req.headers.get('x-telegram-bot-api-secret') ??
        '';
      if (headerSecret !== expectedSecret) {
        console.warn('[Telegram Webhook] Rejected request with invalid secret token');
        return NextResponse.json({ ok: false }, { status: 401 });
      }
    }

    const update = await req.json();

    // Hanya proses callback_query (dari klik inline button)
    if (!update.callback_query) {
      return NextResponse.json({ ok: true });
    }

    const callbackQuery = update.callback_query;
    const fromId = String(callbackQuery.from?.id);
    const callbackQueryId = callbackQuery.id;
    const callbackData: string = callbackQuery.data ?? '';
    const chatId = String(callbackQuery.message?.chat?.id ?? '');
    const messageId: number = callbackQuery.message?.message_id ?? 0;

    // 1. Validasi: hanya admin yang boleh approve/reject
    const adminId = process.env.TELEGRAM_ADMIN_ID;
    if (!adminId || fromId !== adminId) {
      await answerCallbackQuery(callbackQueryId, '⛔ Anda tidak memiliki akses untuk aksi ini.');
      return NextResponse.json({ ok: true });
    }

    // 2. Parse callback data: "approve:orderId" atau "reject:orderId"
    const [action, orderId] = callbackData.split(':');
    if (!action || !orderId || (action !== 'approve' && action !== 'reject')) {
      await answerCallbackQuery(callbackQueryId, '❌ Format callback tidak valid.');
      return NextResponse.json({ ok: true });
    }

    // 3. Cek apakah order ada dan masih WAITING_CONFIRMATION
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        portfolio: {
          select: { title: true },
        },
      },
    });

    if (!order) {
      await answerCallbackQuery(callbackQueryId, '❌ Order tidak ditemukan.');
      return NextResponse.json({ ok: true });
    }

    if (order.status !== 'WAITING_CONFIRMATION') {
      await answerCallbackQuery(callbackQueryId, `ℹ️ Order sudah dalam status ${order.status}.`);
      return NextResponse.json({ ok: true });
    }

    // 4. Update status berdasarkan aksi admin
    const newStatus = action === 'approve' ? 'CONFIRMED' : 'CANCELLED';
    const adminName = escapeMarkdown(
      `${callbackQuery.from?.first_name ?? ''}${callbackQuery.from?.last_name ? ' ' + callbackQuery.from.last_name : ''}`
    );

    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    // 5. Balas callback agar loading indicator di Telegram hilang
    const feedbackText =
      action === 'approve'
        ? '✅ Pembayaran berhasil dikonfirmasi!'
        : '❌ Pembayaran berhasil ditolak.';
    await answerCallbackQuery(callbackQueryId, feedbackText);

    // 6. Edit pesan di Telegram untuk menunjukkan hasil aksi
    const shortId = orderId.split('-')[0].toUpperCase();
    const statusEmoji = action === 'approve' ? '✅' : '❌';
    const statusLabel = action === 'approve' ? 'DIKONFIRMASI' : 'DITOLAK';
    const updatedText = [
      `${statusEmoji} *ORDER ${escapeMarkdown(statusLabel)}*`,
      ``,
      `📋 *Detail Order \\#${shortId}*`,
      `👤 Nama      : ${escapeMarkdown(order.name_customer)}`,
      `📧 Email     : ${escapeMarkdown(order.email_customer)}`,
      `📁 Portfolio : ${escapeMarkdown(order.portfolio.title)}`,
      `💳 Total     : *${escapeMarkdown(
        new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          maximumFractionDigits: 0,
        }).format(order.total_price)
      )}*`,
      ``,
      `👮 Diproses oleh: ${adminName}`,
    ].join('\n');

    if (chatId && messageId) {
      await editMessageText(chatId, messageId, updatedText);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[Telegram Webhook] Error:', error);
    // Selalu return 200 ke Telegram agar tidak retry terus-menerus
    return NextResponse.json({ ok: true });
  }
}
