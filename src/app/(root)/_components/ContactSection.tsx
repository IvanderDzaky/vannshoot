'use client';
import Link from 'next/link';
import type { Route } from 'next';

export default function ContactSection() {
  return (
    <section id="contact" className="py-22">
      <div className="mx-auto max-w-330 px-6">
        <div className="glass-panel relative overflow-hidden rounded-[3rem] border border-white/10 p-12 md:p-24">
          <div className="absolute inset-0 bg-linear-to-br from-[#fe7f2d]/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight text-white font-headline">
              Let's Build Something
              <br />
              Amazing Together
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-[#c8c7c4]">
              Available for freelance development projects, professional photography sessions, or
              simply a coffee chat about tech and design.
            </p>
            <Link
              href={'/contact' as Route}
              className="magnetic-button inline-block mt-12 rounded-2xl bg-[#fe7f2d] px-6 md:px-12 py-3 md:py-6 text-sm md:text-lg text-[#331100] font-semibold shadow-2xl shadow-[#fe7f2d]/20 transition-all duration-300 hover:scale-[1.05] active:scale-[0.98]"
            >
              Send a Message
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
