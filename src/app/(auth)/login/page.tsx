import type { FC } from 'react';
import Image from 'next/image';
import { Ovo, Raleway } from 'next/font/google';

import { genPageMetadata } from '@/app/seo';
import { cn } from '@/lib/utils';
import LoginForm from './_components/LoginForm';

const ovo = Ovo({
  subsets: ['latin'],
  variable: '--font-ovo',
  weight: '400',
});

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
});

export const metadata = genPageMetadata({
  title: 'Masuk',
  description: 'Masuk ke panel admin Vannshoot CMS untuk mengelola konten dan portofolio Anda.',
});

const Login: FC = () => {
  return (
    <section
      className={cn(
        'min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 font-sans',
        ovo.variable,
        raleway.variable
      )}
      style={{
        fontFamily: 'var(--font-raleway), sans-serif',
      }}
    >
      <div className="w-full max-w-md bg-white dark:bg-zinc-900/60 dark:backdrop-blur-md rounded-[2rem] border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xl overflow-hidden">
        <div className="pt-10 px-8 text-center">
          <div className="relative w-64 h-16 mx-auto mb-2">
            <Image
              src="/assets/img/ttn-logo.jpg"
              alt="Vannshoot CMS Logo"
              fill
              className="object-contain dark:invert"
              priority
            />
          </div>
          <p className="font-sans text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-bold mt-2">
            Content Management System
          </p>
          <div className="w-12 h-[2px] bg-[#4e7145]/60 dark:bg-[#4e7145]/40 mx-auto mt-5" />
        </div>

        <LoginForm />
      </div>
    </section>
  );
};

export default Login;
