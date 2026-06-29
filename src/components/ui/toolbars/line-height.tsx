'use client';

import React from 'react';
import { Baseline } from 'lucide-react';
import { useToolbar } from '@/components/ui/toolbars/toolbar-provider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const heights = [
  { label: 'Default', value: 'normal' },
  { label: '1.0', value: '1' },
  { label: '1.15', value: '1.15' },
  { label: '1.2', value: '1.2' },
  { label: '1.5', value: '1.5' },
  { label: '2.0', value: '2' },
  { label: '2.5', value: '2.5' },
];

export const LineHeightToolbar = () => {
  const { editor } = useToolbar();

  const getCurrentValue = () => {
    const attributes = editor?.getAttributes('paragraph') || editor?.getAttributes('heading');
    return attributes?.lineHeight || 'normal';
  };

  const onValueChange = (value: string) => {
    editor?.chain().focus().setLineHeight(value).run();
  };

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-8 w-8 p-0',
                getCurrentValue() !== 'normal' && 'bg-accent text-accent-foreground'
              )}
            >
              <Baseline className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <span>Line Height</span>
        </TooltipContent>
      </Tooltip>
      <PopoverContent className="w-32 p-1 flex flex-col gap-0.5" align="start">
        {heights.map(height => (
          <Button
            key={height.value}
            variant="ghost"
            size="sm"
            className={cn(
              'w-full justify-start font-normal h-8 px-2 text-xs',
              getCurrentValue() === height.value && 'bg-accent'
            )}
            onClick={() => {
              onValueChange(height.value);
            }}
          >
            {height.label}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
};
