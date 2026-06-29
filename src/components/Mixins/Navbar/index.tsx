'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, useState, useEffect } from 'react';

import ThemeToggle from '@/components/Common/ThemeToggle';
import { cn } from '@/lib/utils';

import { navlinks } from './constant/navLinks';
import styles from './Navbar.module.css';

const Navbar: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const pathname = usePathname();

  // Navbar fixed position if scrolling
  useEffect(() => {
    window.onscroll = () => {
      const header = document.querySelector('header');
      const fixNav = header?.offsetTop ?? 0;

      if (window.pageYOffset > fixNav) {
        header?.classList.add(styles.navbarFixed);
      } else {
        header?.classList.remove(styles.navbarFixed);
      }
    };
  }, []);

  // Hamburger menu handler
  const hamburgerHandler = () => {
    const hamburger = document.querySelector('#hamburger');
    const navMenu = document.querySelector('#navMenu');

    setIsOpen(!isOpen);

    if (isOpen) {
      hamburger?.classList.remove(styles.hamburgerActive);
      navMenu?.classList.add('hidden');
    } else {
      hamburger?.classList.add(styles.hamburgerActive);
      navMenu?.classList.remove('hidden');
    }
  };

  // isMenuActive handler
  const isMenuActive = (path: string) => {
    const isHomePage = pathname === '/' && path === '/';

    if (isHomePage) {
      return true;
    }

    return pathname !== '/' && path !== '/' && pathname.includes(path);
  };

  return (
    <header className="bg-transparent absolute top-0 left-0 w-full flex items-center z-10">
      <div className="container mx-auto">
        <div className="flex items-center justify-between relative">
          <div className="px-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-primary font-bold text-xl lg:text-2xl py-6"
              aria-label="logo"
            >
              📦️ BikinProject
            </Link>
          </div>
          <div className="flex items-center px-4">
            <button
              id="hamburger"
              name="hamburger"
              type="button"
              className="right-4 block absolute lg:hidden"
              onClick={hamburgerHandler}
            >
              <span
                className={`${styles.hamburgerLine} origin-top-left transition duration-300 ease-in-out`}
              ></span>
              <span
                className={`${styles.hamburgerLine} transition duration-300 ease-in-out`}
              ></span>
              <span
                className={`${styles.hamburgerLine} origin-bottom-left transition duration-300 ease-in-out`}
              ></span>
            </button>

            <nav
              id="navMenu"
              className="hidden absolute py-5 bg-white shadow-lg rounded-lg max-w-[250px] w-full right-4 top-full lg:block lg:static lg:bg-transparent lg:max-w-full lg:shadow-none lg:rounded-none"
            >
              <ul className="block lg:flex lg:items-center">
                {navlinks?.map((a, i) => (
                  <li className="group" key={i}>
                    <Link
                      href={a.path}
                      className={cn(
                        styles.navLink,
                        isMenuActive(a.path) && styles.navLinkActive,
                        'mx-8 lg:mx-4 flex'
                      )}
                    >
                      {a.title}
                    </Link>
                  </li>
                ))}
                <li className="ml-8 lg:ml-6 flex items-center gap-4">
                  <Link
                    href="/login"
                    className="text-zinc-700 dark:text-zinc-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Daftar
                  </Link>
                </li>

                <li className="ml-8 lg:ml-4 flex items-center">
                  <ThemeToggle />
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
