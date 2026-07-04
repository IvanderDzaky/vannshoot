'use client';
import { useState, useEffect, type FC, type ReactNode } from 'react';

interface CMSContentProps {
  children: ReactNode;
}

export const CMSContent: FC<CMSContentProps> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <main className="flex flex-1 flex-col gap-6 p-6">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center justify-between">
          <div className="space-y-2 w-full md:w-1/3">
            <div className="h-8 w-3/4 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
          </div>
          <div className="h-10 w-32 animate-pulse rounded-md bg-muted shrink-0" />
        </div>

        {/* Table / Content Area Skeleton */}
        <div className="space-y-4 w-full mt-4">
          <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
          <div className="h-[300px] w-full animate-pulse rounded-xl bg-muted" />
        </div>
      </main>
    );
  }

  return <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>;
};

export default CMSContent;
