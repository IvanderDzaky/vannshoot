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
type Level = 1 | 2 | 3 | 4 | 5 | 6;

export const HeadingToolbar = () => {
  const { editor } = useToolbar();

  const getCurrentValue = () => {
    if (editor?.isActive('heading', { level: 1 })) return '1';
    if (editor?.isActive('heading', { level: 2 })) return '2';
    if (editor?.isActive('heading', { level: 3 })) return '3';
    if (editor?.isActive('heading', { level: 4 })) return '4';
    return 'p';
  };

  const onValueChange = (value: string) => {
    if (value === 'p') {
      editor?.chain().focus().setParagraph().run();
    } else {
      editor?.chain().focus().toggleHeading({ level: parseInt(value) as Level }).run();
    }
  };

  return (
    <Select value={getCurrentValue()} onValueChange={onValueChange}>
      <SelectTrigger className="h-8 w-[120px] text-xs">
        <SelectValue placeholder="Heading" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="p">Paragraph</SelectItem>
        <SelectItem value="1">Heading 1</SelectItem>
        <SelectItem value="2">Heading 2</SelectItem>
        <SelectItem value="3">Heading 3</SelectItem>
        <SelectItem value="4">Heading 4</SelectItem>
      </SelectContent>
    </Select>
  );
};
