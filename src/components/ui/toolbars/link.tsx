'use client';

import { Link as LinkIcon, Unlink, ExternalLink } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToolbar } from '@/components/ui/toolbars/toolbar-provider';
import { getModKey } from '@/lib/os';
import { cn } from '@/lib/utils';

export const LinkToolbar = () => {
  const { editor } = useToolbar();
  const [url, setUrl] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setUrl(editor?.getAttributes('link').href || '');
    }
  }, [open, editor]);

  const setLink = () => {
    // empty
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      setOpen(false);
      return;
    }

    // update link
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    setOpen(false);
  };

  const removeLink = () => {
    editor?.chain().focus().extendMarkRange('link').unsetLink().run();
    setOpen(false);
  };

  return (
    <div className="flex items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn('h-8 w-8', editor?.isActive('link') && 'bg-accent text-accent-foreground')}
                disabled={!editor}
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Insert Link ({getModKey()} + K)</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="w-80 p-3" align="start">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="url" className="text-xs font-medium text-muted-foreground">
                URL
              </label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setLink();
                    }
                  }}
                  className="h-8"
                  autoFocus
                />
                <Button size="sm" className="h-8" onClick={setLink}>
                  Apply
                </Button>
              </div>
            </div>
            {editor?.isActive('link') && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={removeLink}
              >
                <Unlink className="mr-2 h-4 w-4" />
                Remove Link
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
