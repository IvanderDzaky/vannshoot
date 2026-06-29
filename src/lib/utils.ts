import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const NODE_HANDLES_SELECTED_STYLE_CLASSNAME = 'node-handles-selected-style';

export function isValidUrl(url: string) {
  return /^https?:\/\/\S+$/.test(url);
}

export function duplicateContent(editor: any) {
  const { state } = editor;
  const { selection } = state;

  editor
    .chain()
    .insertContentAt(selection.to, selection.content().content)
    .focus(selection.to)
    .run();
}
