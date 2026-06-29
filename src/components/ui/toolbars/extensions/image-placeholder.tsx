'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NODE_HANDLES_SELECTED_STYLE_CLASSNAME, cn, isValidUrl } from '@/lib/utils';
import {
  type CommandProps,
  type Editor,
  Node,
  type NodeViewProps,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  mergeAttributes,
} from '@tiptap/react';
import { Image as ImageIcon, Link, Loader2, Upload } from 'lucide-react';
import { type FormEvent, useId, useState } from 'react';

export interface ImagePlaceholderOptions {
  HTMLAttributes: Record<string, any>;
  onDrop: (files: File[], editor: Editor) => void | Promise<void>;
  onDropRejected?: (files: File[], editor: Editor) => void;
  onEmbed: (url: string, editor: Editor) => void;
  allowedMimeTypes?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imagePlaceholder: {
      /**
       * Inserts an image placeholder
       */
      insertImagePlaceholder: () => ReturnType;
    };
  }
}

export const ImagePlaceholder = Node.create<ImagePlaceholderOptions>({
  name: 'image-placeholder',

  addOptions() {
    return {
      HTMLAttributes: {},
      onDrop: () => {},
      onDropRejected: () => {},
      onEmbed: () => {},
    };
  },

  group: 'block',

  parseHTML() {
    return [{ tag: `div[data-type="${this.name}"]` }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImagePlaceholderComponent, {
      className: NODE_HANDLES_SELECTED_STYLE_CLASSNAME,
    });
  },

  addCommands() {
    return {
      insertImagePlaceholder: () => (props: CommandProps) => {
        return props.commands.insertContent({
          type: 'image-placeholder',
        });
      },
    };
  },
});

function ImagePlaceholderComponent(props: NodeViewProps) {
  const { editor, extension, selected } = props;
  const inputId = useId();

  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleAcceptedFiles = async (acceptedFiles: File[]) => {
    setIsUploading(true);
    try {
      if (extension.options.onDrop) {
        await extension.options.onDrop(acceptedFiles, editor);
      }
      setOpen(false);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isUploading) return;
    const files = Array.from(e.target.files || []);
    handleAcceptedFiles(files);
  };

  const handleInsertEmbed = (e: FormEvent) => {
    e.preventDefault();
    const valid = isValidUrl(url);
    if (!valid) {
      setUrlError(true);
      return;
    }
    if (url !== '') {
      extension.options.onEmbed(url, editor);
      setOpen(false);
    }
  };

  return (
    <NodeViewWrapper className="w-full">
      <Popover modal open={open} onOpenChange={isUploading ? undefined : setOpen}>
        <PopoverTrigger
          onClick={() => {
            if (!isUploading) setOpen(true);
          }}
          asChild
          className="w-full"
        >
          <div
            className={cn(
              'flex cursor-pointer items-center gap-3 rounded-md bg-accent p-2 py-3 text-sm text-accent-foreground transition-colors hover:bg-secondary',
              selected && 'bg-primary/10 hover:bg-primary/20',
              isUploading && 'cursor-wait opacity-70'
            )}
          >
            {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImageIcon className="h-6 w-6" />}
            {isUploading ? 'Uploading image...' : 'Add an image'}
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[450px] px-0 py-2"
          onPointerDownOutside={() => {
            if (!isUploading) setOpen(false);
          }}
          onEscapeKeyDown={() => {
            if (!isUploading) setOpen(false);
          }}
        >
          <Tabs defaultValue="upload" className="px-3">
            <TabsList>
              <TabsTrigger className="px-2 py-1 text-sm" value="upload" disabled={isUploading}>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </TabsTrigger>
              <TabsTrigger className="px-2 py-1 text-sm" value="url" disabled={isUploading}>
                <Link className="mr-2 h-4 w-4" />
                Embed link
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <div
                className={cn(
                  'my-2 rounded-md border border-dashed text-sm transition-colors',
                  !isUploading && 'hover:bg-secondary',
                  isUploading && 'opacity-50 cursor-wait'
                )}
              >
                <input
                  type="file"
                  accept={Object.keys(extension.options.allowedMimeTypes || {}).join(',')}
                  multiple={extension.options.maxFiles !== 1}
                  onChange={handleFileInputChange}
                  className="hidden"
                  id={inputId}
                  disabled={isUploading}
                />
                <label
                  htmlFor={inputId}
                  className={cn(
                    "flex h-28 w-full flex-col items-center justify-center text-center",
                    isUploading ? "cursor-wait" : "cursor-pointer"
                  )}
                >
                  {isUploading ? (
                    <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-primary" />
                  ) : (
                    <Upload className="mx-auto mb-2 h-6 w-6" />
                  )}
                  {isUploading ? 'Uploading...' : 'Click to upload from your device'}
                </label>
              </div>
            </TabsContent>
            <TabsContent value="url">
              <form onSubmit={handleInsertEmbed}>
                <Input
                  value={url}
                  disabled={isUploading}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (urlError) {
                      setUrlError(false);
                    }
                  }}
                  placeholder="Paste the image link..."
                />
                {urlError && (
                  <p className="py-1.5 text-xs text-danger-11">Please enter a valid URL</p>
                )}
                <Button
                  onClick={handleInsertEmbed}
                  type="button"
                  size="sm"
                  className="my-2 h-8 w-full p-2 text-xs"
                  disabled={isUploading}
                >
                  Embed Image
                </Button>
                <p className="text-center text-xs text-gray-11">
                  Works with any image from the web
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </NodeViewWrapper>
  );
}
