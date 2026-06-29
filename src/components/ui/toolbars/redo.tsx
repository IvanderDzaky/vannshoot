'use client';

import { Redo } from 'lucide-react';
import React from 'react';

import { Button, type ButtonProps } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useToolbar } from '@/components/ui/toolbars/toolbar-provider';
import { getModKey } from '@/lib/os';

const RedoToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
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
              editor?.chain().focus().redo().run();
              onClick?.(e);
            }}
            onMouseDown={(e) => e.preventDefault()}
            disabled={!editor?.can().redo()}
            ref={ref}
            {...props}
          >
            {children || <Redo className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Redo ({getModKey()} + Y)</p>
        </TooltipContent>
      </Tooltip>
    );
  }
);

RedoToolbar.displayName = 'RedoToolbar';

export { RedoToolbar };
