/**
 * src/lib/telegram.ts
 *
 * Helper untuk mengirim notifikasi dan mengelola pesan bot Telegram.
 * Digunakan ketika order berpindah ke status WAITING_CONFIRMATION.
 */

// Prefer server-side env vars, fallback to NEXT_PUBLIC if necessary (better for local dev).
const TELE_TOKEN = process.env.TELE_BOT_API_KEY ?? process.env.NEXT_PUBLIC_TELE_BOT_API_KEY;
const TELEGRAM_API_BASE = TELE_TOKEN ? `https://api.telegram.org/bot${TELE_TOKEN}` : null;
const ADMIN_CHAT_ID =
  process.env.TELE_BOT_CHANNEL_KEY ?? process.env.NEXT_PUBLIC_TELE_BOT_CHANNEL_KEY;

/**
 * Robust fetch wrapper for Telegram API calls with timeout and retry.
 */
async function telegramFetch(
  path: string,
  options: RequestInit = {},
  { timeout = 15000, retries = 4 }: { timeout?: number; retries?: number } = {}
): Promise<Response> {
  if (!TELEGRAM_API_BASE) {
    throw new Error(
      'Telegram API token not configured (TELE_BOT_API_KEY or NEXT_PUBLIC_TELE_BOT_API_KEY)'
    );
  }

  const url = `${TELEGRAM_API_BASE}${path}`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);
      return res;
    } catch (err: any) {
      clearTimeout(id);
      const isAbort = err?.name === 'AbortError' || err?.code === 'ETIMEDOUT';
      console.error(
        `[Telegram] fetch attempt ${attempt + 1} failed for ${path}:`,
        err?.message ?? err
      );
      if (attempt === retries) throw err;
      // backoff
      await new Promise((r) => setTimeout(r, 200 * Math.pow(2, attempt)));
      if (isAbort) continue; // retry on timeout/abort
    }
  }
  // Should never reach here
  throw new Error('telegramFetch: unexpected exit');
}

interface OrderNotificationData {
  id: string;
  name_customer: string;
  email_customer: string;
  phone_customer: string;
  total_price: number;
  price_per_unit: number;
  createdAt: Date;
  portfolio: {
    title: string;
    city: string | null;
    location: string | null;
  };
}

/**
 * Format tanggal ke locale WIB Indonesia
 */
function formatDate(date: Date): string {
  return (
    new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
      hour12: false,
    }).format(new Date(date)) + ' WIB'
  );
}

/**
 * Format angka ke format rupiah
 */
function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Mengirim notifikasi order ke admin Telegram dengan inline keyboard Approve/Reject.
 * Mengembalikan message_id dari pesan yang terkirim (untuk di-edit nanti).
 */
export async function sendOrderNotification(order: OrderNotificationData): Promise<number | null> {
  if (!ADMIN_CHAT_ID || !TELE_TOKEN) {
    console.error('[Telegram] API key atau chat ID tidak dikonfigurasi.');
    return null;
  }

  const shortId = order.id.split('-')[0].toUpperCase();
  const location = [order.portfolio.city, order.portfolio.location].filter(Boolean).join(', ');

  const text = [
    `🔔 *PEMBAYARAN MENUNGGU KONFIRMASI*`,
    ``,
    `📋 *Detail Order \\#${shortId}*`,
    `👤 Nama      : ${escapeMarkdown(order.name_customer)}`,
    `📧 Email     : ${escapeMarkdown(order.email_customer)}`,
    `📱 No\\. HP   : ${escapeMarkdown(order.phone_customer)}`,
    `📁 Portfolio : ${escapeMarkdown(order.portfolio.title)}`,
    location ? `📍 Lokasi    : ${escapeMarkdown(location)}` : null,
    `💰 Per Foto  : ${escapeMarkdown(formatRupiah(order.price_per_unit))}`,
    `💳 Total     : *${escapeMarkdown(formatRupiah(order.total_price))}*`,
    `🕐 Waktu     : ${escapeMarkdown(formatDate(order.createdAt))}`,
    ``,
    `Silakan verifikasi mutasi rekening/QRIS Anda, lalu klik tombol di bawah\\.`,
  ]
    .filter((line) => line !== null)
    .join('\n');

  const inlineKeyboard = {
    inline_keyboard: [
      [
        {
          text: '✅ Konfirmasi Pembayaran',
          callback_data: `approve:${order.id}`,
        },
        {
          text: '❌ Tolak Pembayaran',
          callback_data: `reject:${order.id}`,
        },
      ],
    ],
  };

  try {
    const res = await telegramFetch('/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text,
        parse_mode: 'MarkdownV2',
        reply_markup: inlineKeyboard,
      }),
    });

    const data = await res.json().catch((e) => {
      console.error('[Telegram] sendMessage: failed to parse JSON response', e);
      return null;
    });
    if (!data) return null;
    if (!data.ok) {
      console.error('[Telegram] sendMessage gagal:', data.description ?? data);
      return null;
    }

    return data.result?.message_id ?? null;
  } catch (err) {
    console.error('[Telegram] Gagal mengirim notifikasi:', err);
    return null;
  }
}

/**
 * Menjawab callback_query agar loading indicator di Telegram hilang.
 */
export async function answerCallbackQuery(callbackQueryId: string, text: string): Promise<void> {
  try {
    const res = await telegramFetch('/answerCallbackQuery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: callbackQueryId, text, show_alert: false }),
    });
    const body = await res.text().catch(() => null);
    if (!res.ok) {
      console.error('[Telegram] answerCallbackQuery non-OK response:', res.status, body);
    }
  } catch (err) {
    console.error('[Telegram] answerCallbackQuery gagal:', err);
  }
}

/**
 * Mengedit pesan yang sudah terkirim (untuk update status setelah admin aksi).
 */
export async function editMessageText(
  chatId: string,
  messageId: number,
  newText: string
): Promise<void> {
  try {
    const res = await telegramFetch('/editMessageText', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text: newText,
        parse_mode: 'MarkdownV2',
        reply_markup: { inline_keyboard: [] }, // Hapus tombol setelah aksi
      }),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => null);
      console.error('[Telegram] editMessageText non-OK response:', res.status, txt);
    }
  } catch (err) {
    console.error('[Telegram] editMessageText gagal:', err);
  }
}

/**
 * Escape karakter spesial MarkdownV2 Telegram.
 */
export function escapeMarkdown(text: string): string {
  return text.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
}
