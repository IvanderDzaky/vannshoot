'use client';
import Link from 'next/link';
import type { Route } from 'next';
import { ArrowRight } from 'lucide-react';

const contactContent = {
  heading: 'Tertarik untuk Berkolaborasi?',
  subheading:
    'Saya terbuka untuk proyek pengembangan web, kebutuhan dokumentasi fotografi, atau kolaborasi kreatif lainnya.',
  cta: 'Hubungi Saya',
};

const heading = contactContent.heading;
const subheading = contactContent.subheading;
const cta = contactContent.cta;

export default function ContactSection() {
  return (
    <section id="contact" className="py-12 md:py-16">
      <div className="mx-auto max-w-330 px-6">
        <div className="glass-panel relative overflow-hidden rounded-3xl border border-white/10 p-6 sm:p-8 md:p-12">
          <div className="absolute inset-0 bg-linear-to-br from-[#fe7f2d]/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative z-10 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-white font-headline">
              {heading}
            </h2>
            <p className="mx-auto mt-4 mb-8 max-w-2xl text-sm md:text-base leading-relaxed text-[#c8c7c4]">
              {subheading}
            </p>
            <Link
              href={'/contact' as Route}
              className="inline-flex items-center gap-2 rounded-full bg-[#fe7f2d] px-10 py-4 text-sm font-bold uppercase tracking-[0.15em] text-[#331100] transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              <span>{cta}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
