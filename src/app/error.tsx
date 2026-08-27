'use client';

import { useEffect } from 'react';

import ErrorState from '@/components/Common/ErrorState';
import type { RequestError } from '@/interfaces/error';

export default function Error({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const reqError = error as RequestError;
  const statusCode = reqError.status || reqError.statusCode || 500;

  return <ErrorState code={statusCode} error={error} />;
}
