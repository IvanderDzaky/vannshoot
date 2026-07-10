import type { FC } from 'react';

import { genPageMetadata } from '@/app/seo';

export const metadata = genPageMetadata({
  title: 'Contact',
  description: 'Halaman contact sederhana sebagai placeholder untuk konten yang akan datang.',
});

const ContactPage: FC = () => {
  return (
    <section className="min-h-screen bg-[#0b0f11] px-6 py-24 text-[#e0e2e6]">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 rounded-[2rem] border border-white/10 bg-[#111419] p-10 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.35em] text-[#fe7f2d]">Contact</p>
        <h1 className="text-4xl font-bold font-headline text-white sm:text-5xl">Contact Page</h1>
        <p className="text-lg leading-relaxed text-[#c8c7c4]">
          Halaman ini masih dalam tahap starter. Konten kontak akan diisi nanti sesuai kebutuhan.
        </p>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm leading-7 text-[#d8d7d4]">
          <p>Dummy content untuk contact page.</p>
          <p>Silakan tambahkan form atau informasi kontak saat sudah siap.</p>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
