import '@tiptap/core';
import type { SearchAndReplaceStorage } from '@/components/ui/toolbars/extensions/search-and-replace';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    textAlign: {
      /**
       * Set the text alignment
       */
      setTextAlign: (alignment: string) => ReturnType;
      /**
       * Unset the text alignment
       */
      unsetTextAlign: () => ReturnType;
    };
    searchAndReplace: {
      setSearchTerm: (searchTerm: string) => ReturnType;
      setReplaceTerm: (replaceTerm: string) => ReturnType;
      replace: () => ReturnType;
      replaceAll: () => ReturnType;
      selectNextResult: () => ReturnType;
      selectPreviousResult: () => ReturnType;
      setCaseSensitive: (caseSensitive: boolean) => ReturnType;
    };
    subscript: {
      toggleSubscript: () => ReturnType;
      setSubscript: () => ReturnType;
      unsetSubscript: () => ReturnType;
    };
    superscript: {
      toggleSuperscript: () => ReturnType;
      setSuperscript: () => ReturnType;
      unsetSuperscript: () => ReturnType;
    };
    underline: {
      toggleUnderline: () => ReturnType;
      setUnderline: () => ReturnType;
      unsetUnderline: () => ReturnType;
    };
  }

  interface Storage {
    searchAndReplace: SearchAndReplaceStorage;
  }
}
