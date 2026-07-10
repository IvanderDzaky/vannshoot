'use client';

import { useEffect, useState } from 'react';

const SCROLL_THRESHOLD = 0;

export const useNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);

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

  return { isOpen, isFixed, toggleMenu };
};
