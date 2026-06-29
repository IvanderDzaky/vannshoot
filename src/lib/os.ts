'use client';

/**
 * Returns the modifier key name based on the user's operating system.
 * Returns '⌘' for macOS and 'Ctrl' for Windows/Linux.
 */
export const getModKey = (): string => {
  if (typeof navigator === 'undefined') return 'Ctrl';
  return navigator.userAgent.toLowerCase().includes('mac') ? '⌘' : 'Ctrl';
};
