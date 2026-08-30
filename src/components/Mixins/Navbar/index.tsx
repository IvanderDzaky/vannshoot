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

const NavbarLink: FC<{ link: NavLinkItem; isActive: boolean; onClick?: () => void }> = ({
  link,
  isActive,
  onClick,
}) => {
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
        <a href={link.path} target="_blank" rel="noreferrer" className={linkClassName} onClick={onClick}>
          <span className="relative z-10">{link.title}</span>
        </a>
      ) : (
        <Link href={internalHref} className={linkClassName} onClick={onClick}>
          <span className="relative z-10">{link.title}</span>
        </Link>
      )}
    </li>
  );
};

const Navbar: FC = () => {
  const pathname = usePathname();
  const { isOpen, toggleMenu, closeMenu, isFixed } = useNavbar();

  const headerClasses = cn(
    'fixed top-0 left-0 w-full z-50 transition-all duration-300',
    isFixed && 'border-b border-white/10 bg-[#0b0f11]/90 backdrop-blur-xl shadow-lg'
  );

  const menuClasses = cn(
    'absolute right-4 top-full mt-3 w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-white/10 bg-[#0b0f11]/95 p-4 shadow-xl backdrop-blur-xl md:static md:top-auto md:right-auto md:mt-0 md:w-auto md:max-w-full md:border-none md:bg-transparent md:p-0 md:shadow-none md:block md:animate-none',
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
            <button
              type="button"
              onClick={toggleMenu}
              className="group relative flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 text-white transition-all duration-300 hover:bg-white/10 hover:border-white/20 md:hidden"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              <span
                className={cn(
                  'h-0.5 w-5 bg-white transition-all duration-300',
                  isOpen ? 'translate-y-2 rotate-45' : ''
                )}
              />
              <span
                className={cn(
                  'h-0.5 w-5 bg-white transition-all duration-300',
                  isOpen ? 'opacity-0' : 'opacity-60 group-hover:opacity-100'
                )}
              />
              <span
                className={cn(
                  'h-0.5 w-5 bg-white transition-all duration-300',
                  isOpen ? '-translate-y-2 -rotate-45' : ''
                )}
              />
            </button>
          </div>
        </div>

        <div className={menuClasses}>
          <ul className="list-none space-y-2 md:hidden">
            {navlinks.map((link) => (
              <NavbarLink
                key={link.path}
                link={link}
                isActive={getIsMenuActive(pathname, link.path)}
                onClick={closeMenu}
              />
            ))}
            <li>
              <Link
                href={'/contact' as Route}
                onClick={closeMenu}
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
