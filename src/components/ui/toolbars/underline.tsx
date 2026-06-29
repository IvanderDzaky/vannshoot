'use client';

import { Underline as UnderlineIcon } from 'lucide-react';
import React from 'react';

import { Button, type ButtonProps } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useToolbar } from '@/components/ui/toolbars/toolbar-provider';
import { getModKey } from '@/lib/os';

const UnderlineToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useToolbar();
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-8 w-8', editor?.isActive('underline') && 'bg-accent', className)}
            onClick={(e) => {
              editor?.chain().focus().toggleUnderline().run();
              onClick?.(e);
            }}
            ref={ref}
            {...props}
          >
            {children || <UnderlineIcon className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Underline ({getModKey()} + U)</p>
        </TooltipContent>
      </Tooltip>
    );
  }
);
UnderlineToolbar.displayName = 'UnderlineToolbar';

export { UnderlineToolbar };
