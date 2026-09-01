'use client';

import type { FC } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ShoppingCart, Loader2, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { createSimulatedOrder, setWaitingConfirmation } from '@/services/orders';

const orderSchema = z.object({
  name_customer: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
  email_customer: z.string().email('Format email tidak valid'),
  phone_customer: z.string().min(9, 'Nomor telepon/WhatsApp minimal 9 digit'),
});

type OrderFormValues = z.infer<typeof orderSchema>;

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: {
    id: string;
    title: string;
    cover: string | null;
    price: number;
    selectedImage: string | null;
  };
  serviceFee?: number;
}

export const VannShootOrderModal: FC<OrderModalProps> = ({
  isOpen,
  onClose,
  portfolio,
  serviceFee = 0,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<{
    orderId: string;
    totalPrice: number;
    pricePerUnit: number;
  } | null>(null);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
  });

  if (!isOpen) return null;

  const pricePerUnit = portfolio.price;
  const totalPrice = pricePerUnit + serviceFee;

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(pricePerUnit);

  const formattedTotal = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(createdOrder ? createdOrder.totalPrice : totalPrice);

  const onSubmit = async (values: OrderFormValues) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    const result = await createSimulatedOrder({
      name_customer: values.name_customer,
      email_customer: values.email_customer,
      phone_customer: values.phone_customer,
      portfolioId: portfolio.id,
      imageUrl: portfolio.selectedImage || portfolio.cover || undefined,
      quantity: 1,
    });

    setIsSubmitting(false);

    if (result.success && result.orderId) {
      setCreatedOrder({
        orderId: result.orderId,
        totalPrice: result.totalPrice || totalPrice,
        pricePerUnit: result.pricePerUnit || pricePerUnit,
      });
    } else {
      setErrorMsg(result.error || 'Gagal memproses order. Silakan coba lagi.');
    }
  };

  const handleConfirmPayment = async () => {
    if (!createdOrder) return;
    setIsConfirmingPayment(true);
    const res = await setWaitingConfirmation(createdOrder.orderId);
    setIsConfirmingPayment(false);
    if (res.success) {
      setPaymentConfirmed(true);
    } else {
      setErrorMsg(res.error || 'Gagal mengubah status konfirmasi.');
    }
  };

  const handleClose = () => {
    reset();
    setCreatedOrder(null);
    setPaymentConfirmed(false);
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#111419] p-6 sm:p-8 shadow-2xl space-y-6 text-[#e0e2e6]">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {!createdOrder ? (
          <>
            {/* Modal Header */}
            <div className="space-y-2 pr-8">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#fe7f2d]">
                <ShoppingCart className="h-4 w-4" />
                <span>Form Pemesanan Foto</span>
              </div>
              <h2 className="text-2xl font-bold font-headline text-white">Checkout Foto Lisensi</h2>
            </div>

            {/* Selected Product Summary */}
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-black/40 flex-shrink-0">
                {portfolio.selectedImage || portfolio.cover ? (
                  <Image
                    src={portfolio.selectedImage || portfolio.cover || ''}
                    alt={portfolio.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-white/40">
                    Foto
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">{portfolio.title}</h4>
                <p className="text-xs text-[#c8c7c4]">Lisensi Digital WebP Resolusi Tinggi</p>
                <div className="mt-1 text-sm font-bold text-[#fe7f2d]">{formattedPrice}</div>
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Customer Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#c8c7c4]">
                  Nama Lengkap <span className="text-[#fe7f2d]">*</span>
                </label>
                <input
                  {...register('name_customer')}
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-white placeholder-white/30 focus:border-[#fe7f2d] focus:outline-none transition-colors"
                />
                {errors.name_customer && (
                  <p className="text-[11px] text-red-400">{errors.name_customer.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#c8c7c4]">
                  Email Active <span className="text-[#fe7f2d]">*</span>
                </label>
                <input
                  {...register('email_customer')}
                  type="email"
                  placeholder="contoh@domain.com"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-white placeholder-white/30 focus:border-[#fe7f2d] focus:outline-none transition-colors"
                />
                {errors.email_customer && (
                  <p className="text-[11px] text-red-400">{errors.email_customer.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#c8c7c4]">
                  Nomor WhatsApp / HP <span className="text-[#fe7f2d]">*</span>
                </label>
                <input
                  {...register('phone_customer')}
                  placeholder="08123456789"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-white placeholder-white/30 focus:border-[#fe7f2d] focus:outline-none transition-colors"
                />
                {errors.phone_customer && (
                  <p className="text-[11px] text-red-400">{errors.phone_customer.message}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 space-y-2 text-xs">
                <div className="flex justify-between text-[#c8c7c4]">
                  <span>Harga Foto</span>
                  <span>{formattedPrice}</span>
                </div>
                {serviceFee > 0 && (
                  <div className="flex justify-between text-[#c8c7c4]">
                    <span>Biaya Layanan</span>
                    <span>
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0,
                      }).format(serviceFee)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t border-white/10 pt-2 text-sm font-bold text-white">
                  <span>Total Pembayaran</span>
                  <span className="text-[#fe7f2d]">{formattedTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-[#fe7f2d] py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-[#331100] transition-transform duration-300 hover:scale-[1.02] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Memproses Order...</span>
                  </>
                ) : (
                  <span>Konfirmasi & Buat Order</span>
                )}
              </button>
            </form>
          </>
        ) : (
          /* Order Created Success Screen */
          <div className="space-y-6 text-center py-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold font-headline text-white">
                Order Berhasil Dibuat!
              </h3>
              <p className="text-xs text-[#c8c7c4]">
                ID Transaksi:{' '}
                <span className="font-mono text-white font-bold">{createdOrder.orderId}</span>
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left space-y-3 text-xs">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#c8c7c4]">Status Order</span>
                <span className="font-semibold text-amber-400 uppercase tracking-wider">
                  {paymentConfirmed ? 'WAITING_CONFIRMATION' : 'PENDING'}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[#c8c7c4]">Total Pembayaran</span>
                <span className="font-bold text-[#fe7f2d]">{formattedTotal}</span>
              </div>

              <div className="pt-2 text-[11px] leading-relaxed text-[#c8c7c4]">
                <p className="font-semibold text-white mb-1">Instruksi Pembayaran Manual:</p>
                <p>
                  Silakan lakukan transfer ke rekening studio VannShoot lalu klik konfirmasi
                  pembayaran di bawah ini agar admin dapat memverifikasi.
                </p>
              </div>
            </div>

            {paymentConfirmed ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300 flex items-center justify-center gap-2 font-medium">
                <ShieldCheck className="h-5 w-5 flex-shrink-0" />
                <span>Konfirmasi diterima! Admin akan segera memproses link download Anda.</span>
              </div>
            ) : (
              <button
                onClick={handleConfirmPayment}
                disabled={isConfirmingPayment}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-[#fe7f2d] py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-[#331100] transition-transform duration-300 hover:scale-[1.02]"
              >
                {isConfirmingPayment ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Mengonfirmasi...</span>
                  </>
                ) : (
                  <span>Saya Sudah Transfer (Konfirmasi)</span>
                )}
              </button>
            )}

            <button
              onClick={handleClose}
              className="w-full rounded-full border border-white/10 bg-white/5 py-3 text-xs font-semibold text-[#c8c7c4] hover:bg-white/10 hover:text-white transition-colors"
            >
              Tutup & Kembali ke Katalog
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
