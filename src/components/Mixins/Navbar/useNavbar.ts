'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const SCROLL_THRESHOLD = 0;

export const useNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.pageYOffset > SCROLL_THRESHOLD);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return { isOpen, isFixed, toggleMenu, closeMenu };
};
