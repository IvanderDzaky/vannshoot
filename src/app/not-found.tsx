import type { Metadata } from 'next';
import type { FC } from 'react';

import { genPageMetadata } from '@/app/seo';
import ErrorState from '@/components/Common/ErrorState';

export const metadata: Metadata = genPageMetadata({
  title: '404 - Command Not Found',
  description: 'Halaman yang Anda cari tidak dapat ditemukan di terminal ini.',
});

const NotFound: FC = () => {
  return <ErrorState code={404} />;
};

export default NotFound;
