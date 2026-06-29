'use client';

import { Subscript as SubscriptIcon, Superscript as SuperscriptIcon } from 'lucide-react';
import React from 'react';

import { Button, type ButtonProps } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useToolbar } from '@/components/ui/toolbars/toolbar-provider';
import { getModKey } from '@/lib/os';

const SubscriptToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useToolbar();
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-8 w-8', editor?.isActive('subscript') && 'bg-accent', className)}
            onClick={(e) => {
              editor?.chain().focus().toggleSubscript().run();
              onClick?.(e);
            }}
            ref={ref}
            {...props}
          >
            {children || <SubscriptIcon className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Subscript ({getModKey()} + ,)</p>
        </TooltipContent>
      </Tooltip>
    );
  }
);
SubscriptToolbar.displayName = 'SubscriptToolbar';

const SuperscriptToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useToolbar();
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-8 w-8', editor?.isActive('superscript') && 'bg-accent', className)}
            onClick={(e) => {
              editor?.chain().focus().toggleSuperscript().run();
              onClick?.(e);
            }}
            ref={ref}
            {...props}
          >
            {children || <SuperscriptIcon className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Superscript ({getModKey()} + .)</p>
        </TooltipContent>
      </Tooltip>
    );
  }
);
SuperscriptToolbar.displayName = 'SuperscriptToolbar';

export { SubscriptToolbar, SuperscriptToolbar };
