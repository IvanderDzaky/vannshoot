'use client';
import type { FC } from 'react';
import { Copy, Server } from 'lucide-react';

import type { ApiAlert as ApiAlertProps } from '@/interfaces/alert';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { copyToClipboard } from '@/lib/clipboard';

const textMap: Record<ApiAlertProps['variant'], string> = {
  public: 'Public',
  admin: 'Admin',
};

const variantMap: Record<ApiAlertProps['variant'], BadgeProps['variant']> = {
  public: 'secondary',
  admin: 'destructive',
};

const ApiAlert: FC<ApiAlertProps> = ({ title, description, variant = 'public' }) => {
  return (
    <Alert>
      <Server className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-x-2">
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex items-center justify-between">
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
          {description}
        </code>
        <Button variant="outline" size="sm" onClick={() => copyToClipboard(description)}>
          <Copy className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default ApiAlert;
