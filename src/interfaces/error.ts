export interface RequestError extends Error {
  status?: number;
  statusCode?: number;
}

export interface ErrorStateProps {
  code: number;
  error?: Error;
}

export interface ErrorMetadata {
  titlePrefix: string;
  titleSuffix: string;
  description: string;
  badge: string;
  theme: 'rose' | 'amber' | 'emerald';
}

export interface ErrorTheme {
  badgeColor: string;
  pingColor: string;
  dotColor: string;
  gradient: string;
  glowStart: string;
  glowEnd: string;
  terminalIcon: string;
  borderType: string;
  errorColor: string;
}
