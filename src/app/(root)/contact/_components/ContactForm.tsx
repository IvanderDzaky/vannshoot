'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { contactSchema, type ContactInput } from '@/schemas/contact';

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactInput>({
    name: '',
    email: '',
    message: '',
    website: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (serverError) setServerError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrorState({});
    setServerError(null);
    setSuccessMessage(null);

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === 'string' && !errors[field]) errors[field] = issue.message;
      }
      setFieldErrors(errors);
      setServerError('Periksa kembali data yang Anda masukkan.');
      return;
    }

    const { name, email, message } = result.data;
    const subject = `[VannShoot Contact] Pesan dari ${name}`;
    const body = [`Nama: ${name}`, `Email: ${email}`, '', 'Pesan:', message].join('\n');

    setSuccessMessage(
      'Draft email sudah dibuka. Klik Send pada aplikasi email Anda untuk mengirim pesan.'
    );
    const gmailComposeUrl =
      'https://mail.google.com/mail/?view=cm&fs=1' +
      `&to=${encodeURIComponent('ivanderdzaky@gmail.com')}` +
      `&su=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.open(gmailComposeUrl, '_blank', 'noopener,noreferrer');
  };

  // Helper setter to avoid name collisions
  const setFieldErrorState = (errs: Record<string, string>) => setFieldErrors(errs);

  return (
    <div className="rounded-3xl border border-white/10 bg-[#111419] p-8 shadow-2xl relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fe7f2d]/10 text-[#fe7f2d]">
          <Mail className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold font-headline text-white">Kirim Pesan</h3>
          <p className="text-xs text-[#9e9d9a]">Respon dalam 1x24 jam kerja</p>
        </div>
      </div>

      {successMessage ? (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center space-y-4 my-6">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h4 className="text-lg font-bold text-white font-headline">Draft Email Dibuka</h4>
          <p className="text-sm text-[#c8c7c4] max-w-md mx-auto">{successMessage}</p>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/10"
          >
            Kirim Pesan Lain
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Honeypot field for bot detection (hidden) */}
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="website"
              tabIndex={-1}
              value={formData.website}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>

          {serverError && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-xs font-medium text-[#c8c7c4] mb-2">
                Nama Lengkap <span className="text-[#fe7f2d]">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Masukkan nama Anda"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-[#0b0f11] px-4 py-3 text-sm text-white placeholder-[#686d76] outline-none transition-colors focus:border-[#fe7f2d]"
              />
              {fieldErrors.name && (
                <p className="mt-1.5 text-xs text-red-400">{fieldErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-medium text-[#c8c7c4] mb-2">
                Alamat Email <span className="text-[#fe7f2d]">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="nama@email.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-[#0b0f11] px-4 py-3 text-sm text-white placeholder-[#686d76] outline-none transition-colors focus:border-[#fe7f2d]"
              />
              {fieldErrors.email && (
                <p className="mt-1.5 text-xs text-red-400">{fieldErrors.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block text-xs font-medium text-[#c8c7c4] mb-2">
              Detail Pesan / Proyek <span className="text-[#fe7f2d]">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder="Jelaskan kebutuhan, ruang lingkup, atau timeline proyek Anda..."
              value={formData.message}
              onChange={handleChange}
              className="min-h-36 w-full rounded-xl border border-white/10 bg-[#0b0f11] px-4 py-3 text-sm leading-6 text-white placeholder-[#686d76] outline-none transition-colors focus:border-[#fe7f2d] resize-y"
            />
            {fieldErrors.message && (
              <p className="mt-1.5 text-xs text-red-400">{fieldErrors.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-[11px] leading-5 text-[#686d76]">
              Dengan mengirim pesan, Anda menyetujui kontak melalui email untuk diskusi proyek.
            </p>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#fe7f2d] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-[#331100] transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shrink-0"
            >
              <span>Buka Email</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
