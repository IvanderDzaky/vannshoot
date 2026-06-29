'use client';

import React, { useEffect, useRef } from 'react';
import { EditorContent, type Extension, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

// Tiptap Extensions
import { TextStyle } from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';
import { Underline } from '@tiptap/extension-underline';
import { Link } from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';

// Custom Extensions
import { FontSize } from '@/components/ui/toolbars/extensions/font-size';
import { LineHeight } from '@/components/ui/toolbars/extensions/line-height';
import { SearchAndReplace } from '@/components/ui/toolbars/extensions/search-and-replace';
import { ImageExtension } from '@/components/ui/toolbars/extensions/image';
import { ImagePlaceholder } from '@/components/ui/toolbars/extensions/image-placeholder';
import { uploadImage } from '@/services/uploads';

// UI Components
import { Separator } from '@/components/ui/separator';
import { ToolbarProvider } from '@/components/ui/toolbars/toolbar-provider';

// Toolbar Components
import { UndoToolbar } from '@/components/ui/toolbars/undo';
import { RedoToolbar } from '@/components/ui/toolbars/redo';
import { HeadingToolbar } from '@/components/ui/toolbars/heading';
import { FontFamilyToolbar } from '@/components/ui/toolbars/font-family';
import { FontSizeToolbar } from '@/components/ui/toolbars/font-size';
import { LineHeightToolbar } from '@/components/ui/toolbars/line-height';
import { BoldToolbar } from '@/components/ui/toolbars/bold';
import { ItalicToolbar } from '@/components/ui/toolbars/italic';
import { UnderlineToolbar } from '@/components/ui/toolbars/underline';
import { StrikeThroughToolbar } from '@/components/ui/toolbars/strikethrough';
import { SubscriptToolbar, SuperscriptToolbar } from '@/components/ui/toolbars/sub-super';
import { LinkToolbar } from '@/components/ui/toolbars/link';
import {
  TextAlignCenterToolbar,
  TextAlignJustifyToolbar,
  TextAlignLeftToolbar,
  TextAlignRightToolbar,
} from '@/components/ui/toolbars/text-align';
import { TableToolbar } from '@/components/ui/toolbars/table';
import { EmojiToolbar } from '@/components/ui/toolbars/emoji';
import { BulletListToolbar } from '@/components/ui/toolbars/bullet-list';
import { OrderedListToolbar } from '@/components/ui/toolbars/ordered-list';
import { CodeToolbar } from '@/components/ui/toolbars/code';
import { CodeBlockToolbar } from '@/components/ui/toolbars/code-block';
import { HorizontalRuleToolbar } from '@/components/ui/toolbars/horizontal-rule';
import { BlockquoteToolbar } from '@/components/ui/toolbars/blockquote';
import { HardBreakToolbar } from '@/components/ui/toolbars/hard-break';
import { ImagePlaceholderToolbar } from '@/components/ui/toolbars/image-placeholder-toolbar';
import { SearchAndReplaceToolbar } from '@/components/ui/toolbars/search-and-replace-toolbar';

const extensions = [
  StarterKit.configure({
    orderedList: {
      HTMLAttributes: {
        class: 'list-decimal',
      },
    },
    bulletList: {
      HTMLAttributes: {
        class: 'list-disc',
      },
    },
    code: {
      HTMLAttributes: {
        class: 'bg-accent rounded-md p-1',
      },
    },
    horizontalRule: {
      HTMLAttributes: {
        class: 'my-2',
      },
    },
    codeBlock: {
      HTMLAttributes: {
        class: 'bg-primary text-primary-foreground p-2 text-sm rounded-md p-1',
      },
    },
    heading: {
      levels: [1, 2, 3, 4],
      HTMLAttributes: {
        class: 'tiptap-heading',
      },
    },
  }),
  TextStyle,
  FontFamily,
  FontSize,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  Link.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: 'https',
    HTMLAttributes: {
      class: 'text-primary underline underline-offset-4 cursor-pointer',
    },
  }),
  LineHeight,
  SearchAndReplace,
  Table.configure({
    resizable: true,
    HTMLAttributes: {
      class: 'tiptap-table',
    },
  }),
  TableRow,
  TableHeader,
  TableCell,
  Subscript,
  Superscript,
  Underline,
  ImageExtension,
  ImagePlaceholder.configure({
    onDrop: async (files, editor) => {
      for (const file of files) {
        const result = await uploadImage(file, 'articles');
        if (result.success && result.url) {
          editor.chain().focus().setImage({ src: result.url }).run();
        }
      }
    },
    onEmbed: (url, editor) => {
      editor.chain().focus().setImage({ src: url }).run();
    },
  }),
];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  folderName?: string;
}

const RichTextEditor = ({ value, onChange, placeholder, folderName }: RichTextEditorProps) => {
  const lastContentRef = useRef(value);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc',
          },
        },
        code: {
          HTMLAttributes: {
            class: 'bg-accent rounded-md p-1',
          },
        },
        horizontalRule: {
          HTMLAttributes: {
            class: 'my-2',
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-primary text-primary-foreground p-2 text-sm rounded-md p-1',
          },
        },
        heading: {
          levels: [1, 2, 3, 4],
          HTMLAttributes: {
            class: 'tiptap-heading',
          },
        },
      }),
      TextStyle,
      FontFamily,
      FontSize,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        HTMLAttributes: {
          class: 'text-primary underline underline-offset-4 cursor-pointer',
        },
      }),
      LineHeight,
      SearchAndReplace,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'tiptap-table',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      Subscript,
      Superscript,
      Underline,
      ImageExtension,
      ImagePlaceholder.configure({
        onDrop: async (files, editor) => {
          for (const file of files) {
            // Rename file to include -content suffix
            const extension = file.name.split('.').pop();
            const baseName = file.name.split('.').slice(0, -1).join('.');
            const newName = `${baseName}-content.${extension}`;
            const renamedFile = new File([file], newName, { type: file.type });

            const subDir = folderName ? `articles/${folderName}` : 'articles';
            const result = await uploadImage(renamedFile, subDir);
            if (result.success && result.url) {
              editor.chain().focus().setImage({ src: result.url }).run();
            }
          }
        },
        onEmbed: (url, editor) => {
          editor.chain().focus().setImage({ src: url }).run();
        },
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      lastContentRef.current = html;
      onChange(html);
    },
    editorProps: {
      handleDrop: (view, event) => {
        // Prevent files from being dropped into the editor
        return true;
      },
      handleKeyDown: (view, event) => {
        const isMod = event.ctrlKey || event.metaKey;
        const isShift = event.shiftKey;

        // Strikethrough: Ctrl + Shift + X
        if (isMod && isShift && event.code === 'KeyX') {
          editor?.commands.toggleStrike();
          return true;
        }

        // Align Left: Ctrl + Shift + L
        if (isMod && isShift && event.code === 'KeyL') {
          editor?.commands.setTextAlign('left');
          return true;
        }

        // Align Center: Ctrl + Shift + E
        if (isMod && isShift && event.code === 'KeyE') {
          editor?.commands.setTextAlign('center');
          return true;
        }

        // Align Right: Ctrl + Shift + R
        if (isMod && isShift && event.code === 'KeyR') {
          editor?.commands.setTextAlign('right');
          return true;
        }

        // Align Justify: Ctrl + Shift + J
        if (isMod && isShift && event.code === 'KeyJ') {
          editor?.commands.setTextAlign('justify');
          return true;
        }

        return false;
      },
    },
  });

  // Sync value from outside if it changes (e.g. form reset or initial data)
  useEffect(() => {
    if (!editor) return;

    if (value === lastContentRef.current || value === editor.getHTML()) {
      return;
    }

    editor.commands.setContent(value, { emitUpdate: false });
    lastContentRef.current = value;
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border w-full relative rounded-md overflow-hidden pb-3 bg-background min-h-[300px]">
      <div className="flex w-full items-start py-2 px-2 border-b sticky top-0 left-0 bg-background z-20 transition-all">
        <ToolbarProvider editor={editor}>
          <div className="flex items-center gap-y-2 gap-x-1 flex-wrap">
            <UndoToolbar />
            <RedoToolbar />
            <Separator orientation="vertical" className="h-7 mx-1" />
            <HeadingToolbar />
            <Separator orientation="vertical" className="h-7 mx-1" />
            <FontFamilyToolbar />
            <FontSizeToolbar />
            <Separator orientation="vertical" className="h-7 mx-1" />
            <LineHeightToolbar />
            <Separator orientation="vertical" className="h-7 mx-1" />
            <BoldToolbar />
            <ItalicToolbar />
            <UnderlineToolbar />
            <StrikeThroughToolbar />
            <SubscriptToolbar />
            <SuperscriptToolbar />
            <LinkToolbar />
            <Separator orientation="vertical" className="h-7 mx-1" />
            <TextAlignLeftToolbar />
            <TextAlignCenterToolbar />
            <TextAlignRightToolbar />
            <TextAlignJustifyToolbar />
            <Separator orientation="vertical" className="h-7 mx-1" />
            <TableToolbar />
            <EmojiToolbar />
            <Separator orientation="vertical" className="h-7 mx-1" />
            <BulletListToolbar />
            <OrderedListToolbar />
            <Separator orientation="vertical" className="h-7 mx-1" />
            <CodeToolbar />
            <CodeBlockToolbar />
            <Separator orientation="vertical" className="h-7 mx-1" />
            <HorizontalRuleToolbar />
            <BlockquoteToolbar />
            <HardBreakToolbar />
            <Separator orientation="vertical" className="h-7 mx-1" />
            <ImagePlaceholderToolbar />
            <Separator orientation="vertical" className="h-7 mx-1" />
            <SearchAndReplaceToolbar />
          </div>
        </ToolbarProvider>
      </div>
      <div
        onClick={() => {
          editor?.chain().focus().run();
        }}
        className="cursor-text min-h-80 bg-background p-4"
      >
        <EditorContent
          className="outline-none tiptap prose-table:border-collapse prose-table:border prose-table:border-border"
          editor={editor}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
