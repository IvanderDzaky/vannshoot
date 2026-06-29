import Link from 'next/link';
import type { FC } from 'react';
import Image from 'next/image';
import { AlertCircle } from 'lucide-react';
import { Ovo, Raleway } from 'next/font/google';

import { genPageMetadata } from '@/app/seo';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

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
  title: 'Registrasi Ditutup',
  description:
    'Layanan registrasi hanya bisa dilakukan oleh Super Admin, silakan hubungi Super Admin.',
});

const Register: FC = () => {
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

        <div className="p-8 space-y-6">
          <Alert
            variant="destructive"
            className="bg-destructive/5 dark:bg-destructive/10 border-destructive/20 rounded-2xl p-4 text-left"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-bold text-destructive">Registrasi Dibatasi</AlertTitle>
            <AlertDescription className="text-muted-foreground mt-1.5 leading-relaxed">
              Oops! Layanan registrasi hanya bisa dilakukan oleh{' '}
              <span className="font-bold text-foreground">Super Admin</span>, silahkan hubungi Super
              Admin.
            </AlertDescription>
          </Alert>

          <Button
            asChild
            className="w-full h-12 rounded-xl bg-[#4e7145] hover:bg-[#3d5936] text-white font-bold transition-all shadow-md shadow-[#4e7145]/20 active:scale-[0.98]"
          >
            <Link href="/">Kembali ke Beranda</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Register;
