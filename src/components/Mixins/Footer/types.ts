import type { ReactNode } from 'react';

export interface FooterLink {
  name: string;
  href: string;
}

export interface FooterGroup {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  name: string;
  icon: ReactNode;
  href: string;
}
