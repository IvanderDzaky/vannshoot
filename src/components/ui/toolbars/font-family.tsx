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

const fonts = [
  { label: 'Default', value: 'default' },
  // Sans Serif
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Tahoma', value: 'Tahoma, Geneva, sans-serif' },
  { label: 'Trebuchet MS', value: '"Trebuchet MS", Helvetica, sans-serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'Open Sans', value: '"Open Sans", sans-serif' },
  { label: 'Montserrat', value: 'Montserrat, sans-serif' },
  { label: 'Poppins', value: 'Poppins, sans-serif' },
  // Serif
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: 'Palatino', value: '"Palatino Linotype", "Book Antiqua", Palatino, serif' },
  { label: 'Playfair Display', value: '"Playfair Display", serif' },
  // Monospace
  { label: 'Courier New', value: '"Courier New", Courier, monospace' },
  { label: 'Lucida Console', value: '"Lucida Console", Monaco, monospace' },
  { label: 'Monaco', value: 'Monaco, "Lucida Console", monospace' },
  { label: 'Fira Code', value: '"Fira Code", monospace' },
  // Display/Cursive
  { label: 'Comic Sans', value: '"Comic Sans MS", "Comic Sans", cursive' },
  { label: 'Dancing Script', value: '"Dancing Script", cursive' },
  { label: 'Pacifico', value: 'Pacifico, cursive' },
];

export const FontFamilyToolbar = () => {
  const { editor } = useToolbar();

  const getCurrentValue = () => {
    const currentFont = fonts.find(f => editor?.isActive('textStyle', { fontFamily: f.value }));
    return currentFont?.value || 'default';
  };

  const onValueChange = (value: string) => {
    if (value === 'default') {
      editor?.chain().focus().unsetFontFamily().run();
    } else {
      editor?.chain().focus().setFontFamily(value).run();
    }
  };

  return (
    <Select value={getCurrentValue()} onValueChange={onValueChange}>
      <SelectTrigger className="h-8 w-[140px] text-xs">
        <SelectValue placeholder="Font Family" />
      </SelectTrigger>
      <SelectContent>
        {fonts.map(font => (
          <SelectItem 
            key={font.label} 
            value={font.value}
            style={{ fontFamily: font.value !== 'default' ? font.value : undefined }}
          >
            {font.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
