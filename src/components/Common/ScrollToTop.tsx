'use client';
import { type FC, useState, useEffect } from 'react';
import smoothscroll from 'smoothscroll-polyfill';

import { cn } from '@/lib/utils';

const ScrollToTop: FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollTop = () => {
    smoothscroll.polyfill();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <>
      <div className="fixed bottom-6 right-6">
        <button
          type="button"
          onClick={scrollTop}
          aria-label="Scroll to top"
          aria-hidden={!isVisible}
          tabIndex={isVisible ? 0 : -1}
          className={cn(
            isVisible ? 'opacity-100' : 'opacity-0 cursor-default',
            'flex flex-col justify-center items-center rounded-lg bg-[#030303] p-2 text-white transition-all hover:bg-[#030303]/90'
          )}
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            fill="currentColor"
          >
            <path d="M352 352c-8.188 0-16.38-3.125-22.62-9.375L192 205.3l-137.4 137.4c-12.5 12.5-32.75 12.5-45.25 0s-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25C368.4 348.9 360.2 352 352 352z" />
          </svg>
        </button>
      </div>
    </>
  );
};

export default ScrollToTop;
