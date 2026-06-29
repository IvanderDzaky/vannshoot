'use client';

import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from 'lucide-react';
import React from 'react';

import { Button, type ButtonProps } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useToolbar } from '@/components/ui/toolbars/toolbar-provider';
import { getModKey } from '@/lib/os';

const TextAlignLeftToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useToolbar();
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-8 w-8', editor?.isActive({ textAlign: 'left' }) && 'bg-accent', className)}
            onClick={(e) => {
              editor?.chain().focus().setTextAlign('left').run();
              onClick?.(e);
            }}
            ref={ref}
            {...props}
          >
            {children || <AlignLeft className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Align Left ({getModKey()} + Shift + L)</p>
        </TooltipContent>
      </Tooltip>
    );
  }
);
TextAlignLeftToolbar.displayName = 'TextAlignLeftToolbar';

const TextAlignCenterToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useToolbar();
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-8 w-8', editor?.isActive({ textAlign: 'center' }) && 'bg-accent', className)}
            onClick={(e) => {
              editor?.chain().focus().setTextAlign('center').run();
              onClick?.(e);
            }}
            ref={ref}
            {...props}
          >
            {children || <AlignCenter className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Align Center ({getModKey()} + Shift + E)</p>
        </TooltipContent>
      </Tooltip>
    );
  }
);
TextAlignCenterToolbar.displayName = 'TextAlignCenterToolbar';

const TextAlignRightToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useToolbar();
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-8 w-8', editor?.isActive({ textAlign: 'right' }) && 'bg-accent', className)}
            onClick={(e) => {
              editor?.chain().focus().setTextAlign('right').run();
              onClick?.(e);
            }}
            ref={ref}
            {...props}
          >
            {children || <AlignRight className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Align Right ({getModKey()} + Shift + R)</p>
        </TooltipContent>
      </Tooltip>
    );
  }
);
TextAlignRightToolbar.displayName = 'TextAlignRightToolbar';

const TextAlignJustifyToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useToolbar();
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-8 w-8', editor?.isActive({ textAlign: 'justify' }) && 'bg-accent', className)}
            onClick={(e) => {
              editor?.chain().focus().setTextAlign('justify').run();
              onClick?.(e);
            }}
            ref={ref}
            {...props}
          >
            {children || <AlignJustify className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Align Justify ({getModKey()} + Shift + J)</p>
        </TooltipContent>
      </Tooltip>
    );
  }
);
TextAlignJustifyToolbar.displayName = 'TextAlignJustifyToolbar';

export {
  TextAlignLeftToolbar,
  TextAlignCenterToolbar,
  TextAlignRightToolbar,
  TextAlignJustifyToolbar,
};
