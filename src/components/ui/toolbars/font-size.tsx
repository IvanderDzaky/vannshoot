'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToolbar } from '@/components/ui/toolbars/toolbar-provider';

const sizes = [
  { label: '8px', value: '8px' },
  { label: '10px', value: '10px' },
  { label: '12px', value: '12px' },
  { label: '14px', value: '14px' },
  { label: '16px', value: '16px' },
  { label: '18px', value: '18px' },
  { label: '20px', value: '20px' },
  { label: '24px', value: '24px' },
  { label: '30px', value: '30px' },
  { label: '36px', value: '36px' },
  { label: '48px', value: '48px' },
  { label: '60px', value: '60px' },
  { label: '72px', value: '72px' },
];

export const FontSizeToolbar = () => {
  const { editor } = useToolbar();

  const getCurrentValue = () => {
    // We check for the fontSize attribute in textStyle
    const attributes = editor?.getAttributes('textStyle');
    return attributes?.fontSize || '';
  };

  const onValueChange = (value: string) => {
    editor?.chain().focus().setFontSize(value).run();
  };

  return (
    <Select value={getCurrentValue()} onValueChange={onValueChange}>
      <SelectTrigger className="h-8 w-[80px] text-xs">
        <SelectValue placeholder="Size" />
      </SelectTrigger>
      <SelectContent>
        {sizes.map(size => (
          <SelectItem key={size.label} value={size.value}>
            {size.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
