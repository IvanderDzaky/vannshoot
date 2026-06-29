'use client';

import {
  Table as TableIcon,
  PlusSquare,
  MinusSquare,
  Trash2,
  TableProperties,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  Combine,
  Split,
} from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToolbar } from '@/components/ui/toolbars/toolbar-provider';
import { cn } from '@/lib/utils';

export const TableToolbar = () => {
  const { editor } = useToolbar();

  if (!editor) return null;

  const isTableActive = editor.isActive('table');

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn('h-8 w-8', isTableActive && 'bg-accent')}
            >
              <TableIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <span>Table Actions</span>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        >
          <PlusSquare className="mr-2 h-4 w-4" />
          <span>Insert Table (3x3)</span>
        </DropdownMenuItem>

        {isTableActive && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => editor.chain().focus().addColumnBefore().run()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span>Add Column Before</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().addColumnAfter().run()}>
              <ArrowRight className="mr-2 h-4 w-4" />
              <span>Add Column After</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().deleteColumn().run()}>
              <MinusSquare className="mr-2 h-4 w-4 text-destructive" />
              <span className="text-destructive">Delete Column</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => editor.chain().focus().addRowBefore().run()}>
              <ArrowUp className="mr-2 h-4 w-4" />
              <span>Add Row Before</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().addRowAfter().run()}>
              <ArrowDown className="mr-2 h-4 w-4" />
              <span>Add Row After</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().deleteRow().run()}>
              <MinusSquare className="mr-2 h-4 w-4 text-destructive" />
              <span className="text-destructive">Delete Row</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => editor.chain().focus().mergeCells().run()}>
              <Combine className="mr-2 h-4 w-4" />
              <span>Merge Cells</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().splitCell().run()}>
              <Split className="mr-2 h-4 w-4" />
              <span>Split Cell</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => editor.chain().focus().deleteTable().run()}>
              <Trash2 className="mr-2 h-4 w-4 text-destructive" />
              <span className="text-destructive">Delete Table</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
