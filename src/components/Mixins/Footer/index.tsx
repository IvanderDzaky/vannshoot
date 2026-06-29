'use client';
import type { FC } from 'react';
import type { Route } from 'next';
import Link from 'next/link';

import { footerLinks, socials } from './constant/footerLinks';

const Footer: FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-zinc-950 text-zinc-400 py-20 border-t border-zinc-900">
      <div className="container mx-auto px-4">
        {/* Top Section: Brand & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-zinc-900">
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="inline-flex items-center gap-2 text-white font-bold text-2xl">
              📦️ BikinProject
            </Link>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              CLI-based package starter generator yang dirancang untuk mempercepat workflow
              pengembangan aplikasi Anda dengan standar industri.
            </p>
            <div className="flex gap-4 pt-2">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 border border-zinc-800"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-zinc-900/50 rounded-3xl p-8 border border-zinc-800 space-y-4">
              <h3 className="text-xl font-bold text-white">Dapatkan Update Terbaru</h3>
              <p>Jadilah yang pertama tahu tentang fitur dan promo terbaru dari kami.</p>
              <form className="flex flex-col sm:flex-row gap-3 pt-2">
                <input
                  type="email"
                  placeholder="name@email.com"
                  className="flex-1 px-5 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/10"
                >
                  Langganan
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Middle Section: Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 py-16">
          {footerLinks.map((group) => (
            <div key={group.title} className="space-y-6">
              <h4 className="text-white font-bold uppercase tracking-wider text-sm">
                {group.title}
              </h4>
              <ul className="space-y-4">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href as Route}
                      className="hover:text-blue-500 hover:translate-x-1 inline-block transition-all duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section: Copyright */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-sm tracking-wide">
          <p>© {year} BikinProject. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex gap-8">
            <Link href={'/privacy' as Route} className="hover:text-white transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href={'/terms' as Route} className="hover:text-white transition-colors">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
