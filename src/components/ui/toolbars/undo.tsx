'use client';

import { Undo } from 'lucide-react';
import React from 'react';

import { Button, type ButtonProps } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useToolbar } from '@/components/ui/toolbars/toolbar-provider';
import { getModKey } from '@/lib/os';

const UndoToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useToolbar();
    const [_, setUpdate] = React.useState(0);

    React.useEffect(() => {
      if (!editor) return;
      const onTransaction = () => setUpdate(s => s + 1);
      editor.on('transaction', onTransaction);
      return () => {
        editor.off('transaction', onTransaction);
      };
    }, [editor]);

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-8 w-8', className)}
            onClick={(e) => {
              editor?.chain().focus().undo().run();
              onClick?.(e);
            }}
            onMouseDown={(e) => e.preventDefault()}
            disabled={!editor?.can().undo()}
            ref={ref}
            {...props}
          >
            {children || <Undo className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Undo ({getModKey()} + Z)</p>
        </TooltipContent>
      </Tooltip>
    );
  }
);

UndoToolbar.displayName = 'UndoToolbar';

export { UndoToolbar };
