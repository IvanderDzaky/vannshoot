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
    <li className="group relative">
      {isExternal ? (
        <a href={link.path} target="_blank" rel="noreferrer" className={linkClassName}>
          <span className="relative z-10">{link.title}</span>
        </a>
      ) : (
        <Link href={internalHref} className={linkClassName}>
          <span className="relative z-10">{link.title}</span>
        </Link>
      )}
    </li>
  );
};

const Navbar: FC = () => {
  const pathname = usePathname();
  const { isOpen, toggleMenu, isFixed } = useNavbar();

  const headerClasses = cn(
    'fixed top-0 left-0 w-full z-50 transition-all duration-300',
    isFixed && 'border-b border-white/10 bg-[#0b0f11]/90 backdrop-blur-xl shadow-lg'
  );

  const menuClasses = cn(
    'absolute right-4 top-full mt-3 w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-white/10 bg-[#0b0f11]/95 p-4 shadow-xl backdrop-blur-xl lg:static lg:top-auto lg:right-auto lg:mt-0 lg:w-auto lg:max-w-full lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none lg:block lg:animate-none',
    !isOpen && 'hidden',
    isOpen && 'block animate-in slide-in-from-top-2 fade-in-100'
  );

  return (
    <header className={headerClasses}>
      <nav className="border-b border-white/5 bg-[#0b0f11]/80 px-6 py-4 backdrop-blur-xl lg:px-8">
        <div className="mx-auto flex max-w-330 w-full items-center justify-between">
          <Link
            href="/"
            className="font-headline text-white font-bold tracking-tighter text-2xl group relative"
          >
            <span className="relative z-10 transition-all duration-300 group-hover:tracking-[0.02em]">
              IDZ.
            </span>
          </Link>

          <ul className="hidden md:flex list-none items-center gap-2 text-[#c8c7c4]">
            {navlinks.map((link) => (
              <NavbarLink
                key={link.path}
                link={link}
                isActive={getIsMenuActive(pathname, link.path)}
              />
            ))}
          </ul>

          <div className="flex items-center gap-3 md:gap-4">
            <button className="hidden rounded-full bg-[#fe7f2d] px-7 py-2.5 text-[#331100] font-semibold uppercase tracking-[0.16em] shadow-lg shadow-[#fe7f2d]/20 transition-all duration-300 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]">
              Hubungi Kami
            </button>
            <button
              type="button"
              onClick={toggleMenu}
              className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-300 hover:bg-white/10 hover:border-white/20 md:hidden"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              <span
                className={`${styles.hamburgerLine} ${isOpen ? 'rotate-45 transition-all duration-300' : 'transition-all duration-300 group-hover:translate-y-1'}`}
              />
              <span
                className={`${styles.hamburgerLine} ${isOpen ? 'scale-0' : 'opacity-60 group-hover:opacity-100 transition-opacity duration-300'}`}
              />
              <span
                className={`${styles.hamburgerLine} ${isOpen ? '-rotate-45 transition-all duration-300' : '-translate-y-1 group-hover:translate-y-0 transition-all duration-300'}`}
              />
              <span className="absolute inset-0 rounded-full ring-2 ring-white/5 opacity-0 transition-all group-hover:opacity-100" />
            </button>
          </div>
        </div>

        <div className={menuClasses}>
          <ul className="list-none space-y-2 lg:hidden">
            {navlinks.map((link) => (
              <NavbarLink
                key={link.path}
                link={link}
                isActive={getIsMenuActive(pathname, link.path)}
              />
            ))}
            <li>
              <Link
                href={'/contact' as Route}
                className="inline-flex w-full rounded-full bg-[#fe7f2d] px-6 py-3 text-[#331100] font-semibold uppercase tracking-[0.16em] shadow-lg shadow-[#fe7f2d]/20 transition-all duration-300 hover:brightness-110 active:scale-[0.98] items-center justify-center"
              >
                Hubungi Kami
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
