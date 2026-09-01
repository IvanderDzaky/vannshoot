'use client';
import type { FC } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { navlinks } from '../Navbar/constant/navLinks';

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/ivander_dzaky',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/IvanderDzaky',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/ivanderdzaky',
  },
];

const Footer: FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-[#121619] py-12 md:py-16">
      <div className="mx-auto max-w-330 px-6">
        <div className="grid gap-10 md:grid-cols-4 mb-12">
          <div className="md:col-span-2">
            <div className="text-2xl sm:text-3xl font-bold text-white font-headline mb-4">
              Ivander Dzaky
            </div>
            <p className="max-w-sm text-sm sm:text-base text-[#c8c7c4] leading-relaxed">
              Saya membangun pengalaman digital yang bermakna dan menciptakan cerita visual melalui
              pengembangan web dan fotografi.
            </p>
          </div>

          <div>
            <h5 className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#fe7f2d]">
              Navigasi
            </h5>
            <ul className="space-y-3 text-sm text-[#c8c7c4]">
              {navlinks.map((item) => (
                <li key={item.title}>
                  <Link className="hover:text-white transition-colors" href={item.path as Route}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#fe7f2d]">
              Media Sosial
            </h5>
            <ul className="space-y-3 text-sm text-[#c8c7c4]">
              {socialLinks.map((item) => (
                <li key={item.label}>
                  <a
                    className="hover:text-white transition-colors"
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs sm:text-sm text-[#9da2ab] md:flex-row">
          <p>© {year} Ivander Dzaky. Hak Cipta Dilindungi.</p>
          <p>Dirancang dan dikembangkan oleh Ivander Dzaky</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
