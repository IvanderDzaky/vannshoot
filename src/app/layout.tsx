import type { Metadata } from 'next';

import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';

import './globals.css';
import { cn } from '@/lib/utils';
import { siteMetadata } from '@/data/siteMetadata';
import QueryProvider from '@/providers/QueryProvider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-playfair',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl || 'http://localhost:3000'),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'id_ID',
    type: 'website',
  },
  authors: [{ name: siteMetadata.author }],
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={cn('dark', inter.variable, playfair.variable, jetbrainsMono.variable)}
    >
      <body className="antialiased">
        <QueryProvider>{children}</QueryProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
