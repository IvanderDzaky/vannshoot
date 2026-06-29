import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from '@/components/Common/CustomIcons';

export const footerLinks = [
  {
    title: 'Project',
    links: [
      { name: 'Fitur', href: '#features' },
      { name: 'Cara Kerja', href: '#steps' },
      { name: 'Harga', href: '/pricing' },
      { name: 'Showcase', href: '/showcase' },
    ],
  },
  {
    title: 'Perusahaan',
    links: [
      { name: 'Tentang Kami', href: '/about' },
      { name: 'Karir', href: '/career' },
      { name: 'Blog', href: '/blog' },
      { name: 'Kontak', href: '/contact' },
    ],
  },
  {
    title: 'Dukungan',
    links: [
      { name: 'Bantuan', href: '/help' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Keamanan', href: '/security' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Ketentuan', href: '/terms' },
      { name: 'Privasi', href: '/privacy' },
      { name: 'Lisensi', href: '/license' },
    ],
  },
];

export const socials = [
  { name: 'GitHub', icon: <GitHubIcon />, href: '#' },
  { name: 'Twitter', icon: <TwitterIcon />, href: '#' },
  { name: 'LinkedIn', icon: <LinkedInIcon />, href: '#' },
  { name: 'Instagram', icon: <InstagramIcon />, href: '#' },
];
