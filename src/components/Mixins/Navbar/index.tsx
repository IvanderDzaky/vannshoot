'use client';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import type { FC } from 'react';

import { cn } from '@/lib/utils';

import { useNavbar } from './useNavbar';
import { navlinks } from './constant/navLinks';
import styles from './Navbar.module.css';
import type { NavLinkItem } from './types';
import Link from 'next/link';

const getIsMenuActive = (pathname: string, path: string) => {
  if (path.startsWith('http')) {
    return false;
  }

  if (pathname === path) {
    return true;
  }

  if (path !== '/' && pathname.startsWith(path)) {
    return true;
  }

  return false;
};

const NavbarLink: FC<{ link: NavLinkItem; isActive: boolean }> = ({ link, isActive }) => {
  const isExternal = link.path.startsWith('http');
  const linkClassName = cn(
    styles.navLink,
    isActive && styles.navLinkActive,
    'mx-4 lg:mx-5 flex items-center text-[13px] uppercase tracking-[0.24em]'
  );
  const internalHref = link.path as Route;

  return (
    <li className="group">
      {isExternal ? (
        <a href={link.path} target="_blank" rel="noreferrer" className={linkClassName}>
          {link.title}
        </a>
      ) : (
        <Link href={internalHref} className={linkClassName}>
          {link.title}
        </Link>
      )}
    </li>
  );
};

const Navbar: FC = () => {
  const pathname = usePathname();
  const { isOpen, toggleMenu } = useNavbar();

  const menuClasses = cn(
    'absolute right-4 top-full mt-3 w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-white/10 bg-[#0b0f11]/95 p-4 shadow-xl backdrop-blur-xl lg:static lg:top-auto lg:right-auto lg:mt-0 lg:w-auto lg:max-w-full lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none',
    !isOpen && 'hidden',
    isOpen && 'block'
  );

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <nav className="border-b border-white/5 bg-[#0b0f11]/80 px-6 py-4 shadow-lg backdrop-blur-xl lg:px-8">
        <div className="mx-auto flex max-w-330 w-full items-center justify-between">
          <Link href="/" className="font-headline text-white font-bold tracking-tighter text-2xl">
            IDZ.
          </Link>

          <div className="hidden md:flex items-center gap-2 text-[#c8c7c4]">
            {navlinks.map((link) => (
              <NavbarLink
                key={link.path}
                link={link}
                isActive={getIsMenuActive(pathname, link.path)}
              />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden rounded-full bg-[#fe7f2d] px-7 py-2.5 text-[#331100] font-semibold uppercase tracking-[0.16em] shadow-lg shadow-[#fe7f2d]/20 transition-all duration-300 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] md:inline-flex">
              Let&apos;s Talk
            </button>
            <button
              type="button"
              onClick={toggleMenu}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 md:hidden"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              <span
                className={`${styles.hamburgerLine} ${isOpen ? 'rotate-45 translate-y-0' : ''}`}
              />
              <span className={`${styles.hamburgerLine} ${isOpen ? 'scale-0' : ''}`} />
              <span
                className={`${styles.hamburgerLine} ${isOpen ? '-rotate-45 translate-y-0' : ''}`}
              />
            </button>
          </div>
        </div>

        <div className={menuClasses}>
          <ul className="space-y-3 lg:hidden">
            {navlinks.map((link) => (
              <NavbarLink
                key={link.path}
                link={link}
                isActive={getIsMenuActive(pathname, link.path)}
              />
            ))}
            <li>
              <button className="w-full rounded-full bg-[#fe7f2d] px-6 py-3 text-[#331100] font-semibold uppercase tracking-[0.16em] shadow-lg shadow-[#fe7f2d]/20 transition-all duration-300 hover:brightness-110 active:scale-[0.98]">
                Let&apos;s Talk
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
