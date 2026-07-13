'use client';
import type { FC } from 'react';

const navigation = [
  { label: 'Home', href: '#home' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const socials = [
  { label: 'Instagram', icon: 'alternate_email', href: '#' },
  { label: 'GitHub', icon: 'person', href: '#' },
  { label: 'LinkedIn', icon: 'movie', href: '#' },
  { label: 'Twitter', icon: 'mail', href: '#' },
];

const Footer: FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="py-20 border-t border-white/5 bg-[#121619] text-[#c8c7c4]">
      <div className="mx-auto max-w-330 px-6">
        <div className="grid gap-12 md:grid-cols-4 mb-16">
          <div className="md:col-span-2">
            <div className="text-3xl font-bold text-white font-headline mb-6">Ivander Dzaky</div>
            <p className="max-w-sm leading-relaxed text-[#c8c7c4]">
              Creative technologist and informatics student bridging the gap between digital
              architecture and visual storytelling. Built for the lens and the screen.
            </p>

          </div>

          <div>
            <h5 className="mb-6 text-sm uppercase tracking-[0.35em] text-[#fe7f2d]">Navigation</h5>
            <ul className="space-y-4 text-[#c8c7c4]">
              {navigation.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="mb-6 text-sm uppercase tracking-[0.35em] text-[#fe7f2d]">Socials</h5>
            <ul className="space-y-4 text-[#c8c7c4]">
              {socials.map((item) => (
                <li key={item.label}>
                  <a className="hover:text-white transition-colors" href={item.href}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col items-center justify-between gap-4 text-sm text-[#9da2ab] md:flex-row">
          <p>© {year} Ivander Dzaky. All Rights Reserved.</p>
          <p>Designed and Developed by Ivander Dzaky</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
