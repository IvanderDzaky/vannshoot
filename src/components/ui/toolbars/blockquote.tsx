'use client';

import { Quote } from 'lucide-react';
import React from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useToolbar } from '@/components/ui/toolbars/toolbar-provider';
import { getModKey } from '@/lib/os';

const BlockquoteToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useToolbar();
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-8 w-8', editor?.isActive('blockquote') && 'bg-accent', className)}
            onClick={(e) => {
              editor?.chain().focus().toggleBlockquote().run();
              onClick?.(e);
            }}
            disabled={!editor?.can().chain().focus().toggleBlockquote().run()}
            ref={ref}
            {...props}
          >
            {children || <Quote className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Blockquote ({getModKey()} + Shift + B)</p>
        </TooltipContent>
      </Tooltip>
    );
  }
);

BlockquoteToolbar.displayName = 'BlockquoteToolbar';

export { BlockquoteToolbar };
