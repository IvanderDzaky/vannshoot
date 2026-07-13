export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  image: string;
  cta: string;
  details?: string;
}

export interface Photo {
  id: string;
  title: string;
  image: string;
  tall?: boolean;
  details?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  image: string;
  cta: string;
  details?: string;
}

export const projects: Project[] = [
  {
    id: 'vanguard-os',
    title: 'Vanguard OS',
    category: 'Development',
    description: 'Next-gen dashboard for aerospace logistics with real-time telemetry.',
    tags: ['React', 'Three.js', 'Tailwind'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA_eL8VaxOM1BGiGdaEfoVfZeCCpd0Eq_YqfbQNsJIoWKbjF7cjgyyETYiGJ1jpfc6DDty9FdUzZjNp7Cfbb7m5KT4Ym8PM4EBsjEg6ZW2BKb8wk9-AW_v8pY4OLyHyWqscBvAZk4G4Q3DxO-Rx0_KdQO9h2RkXGCSYdxMo_R5aZiDRvt96CI_OnzkiDVZqeMRd0bFSIS6Pi15makOhYlUD-6QmtknxKfVIJJTN_I4lT2oc-SPG7B0SoKFIGCUMv_bti3xKPWRSQd96',
    cta: 'View Case Study',
    details: 'Full logistics and telemetry dashboard build. Scaled for aerospace data streams, leveraging React and Three.js visualization.',
  },
  {
    id: 'nocturnal-lines',
    title: 'Nocturnal Lines',
    category: 'Design',
    description: 'Exploring urban architecture through long-exposure night photography.',
    tags: ['Sony A7RIV', '35mm', 'Night Shift'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDjP-loSKOjoQXdvWbIb2b8R0gNve8D9innLM_dUA7YM7lEIkc30LqoQ_cQwNisnRd4HhASUGKcNXJcAuzT4bOTJeXHYmfuF9CzVk7WT7J2qZm28I-c-tpm01O0wjFJjY-N0hv02O4PfgCkbwZmvv8eohKt8B_5R_-J9oc6wwsmwVMCggHP7-kDNsA6c8nPJLFwiWdUNbJVeQjzPKPgQSb7ZG7zammlB8xnuDcOvOI34qISsmms4MLOCFgvzSUzRWkIMnpMhMyASr49',
    cta: 'Full Gallery',
    details: 'Long-exposure study on light trails and shadows in modern urban environments.',
  },
  {
    id: 'ethos-archive',
    title: 'Ethos Archive',
    category: 'Design',
    description: 'Brand identity and interactive portfolio for a Paris-based fashion house.',
    tags: ['Figma', 'WebGL'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD7xDB058hXAnfZlbGzjycxte2hZMA7viM7UeKxWvFoaG80fbfxeagrgSE_l_5ahRSjmp5-HqSU_cDzJZjqokuPutT4J0zNi9FGlPIsr3zDQU6foJVtuiwcSz7L_fTuPZiIIchDLKNugYiFoXFQlDH5fMHnfuEhXGCKYf1b99oKJfZh1TH1K7AeiZK9D27lVTrW3xYqZz3NTQZ_VwF0GQxEBmbSHxfEIK2w8v9auTt0CjPEbykE1D_h3PtK5IpZ2UT0KFx7aGWfLLLY',
    cta: 'View Design',
    details: 'Complete design language system, branding architecture, and online portfolio presentation.',
  },
  {
    id: 'quantify',
    title: 'Quantify',
    category: 'Development',
    description: 'Personal finance engine with custom-built data visualization libraries.',
    tags: ['Next.js', 'D3.js'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCSzQTnWYSBbZUkXO_2n3ORMGAY8wDFze6LG2OXF0A1595SHdjKpVwQq5npSMMcxd7VJi3x4E4e-qtE1xy1RZspkwgMoQLBfvC7o5viYC6qkBnB2JHARCcoF8mwXJDGzFw2lL7I3hQY2HZyHy0m6cFgxsz7CJOdnDECYTojqEELF55iQR7GCbFYGLHdK9JKGqqs68227nhohpbxg3rehmPJBd_ASwyyC0TxNm2KhJ0DhNejjnxLeYmXSkkdqSrwysle2edZ7e_-QOT3',
    cta: 'Live Demo',
    details: 'Next.js application featuring optimized real-time calculations and dynamic financial SVGs.',
  },
];

export const photos: Photo[] = [
  {
    id: 'icelandic-fury',
    title: 'Icelandic Fury',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC3L-u1sp5AwnL-dENfmoZpcsKhOl0CR2F3TUBc0j550FsoigMMJ1Qa0BS3ePPtBO8KLZRpDGm7nytMC86BTH3N8ytspjjyPy7tlAnfgGXmNyFvQuhK6EjAFUg66i3stXqN5Qe0UiafUKIaveHQIk4aoh7khKa0skJvNsBdZTAaf4wx6LWBBcpyvlmHEtIF800Fkw-Ma6Uvh3boWMBvPKEVWvuZZSWWtO09VY_clc3pNq6tJR-ZZcc7Tw9T3krjfdCNZcmPYS3-uBAR',
    details: 'Captured in southern Iceland, displaying the rugged power of elements.',
  },
  {
    id: 'nocturne-portrait',
    title: 'Nocturne Portrait',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC5tl8RZR3ttJA3U3OiFQspC8OEZF8EweArtQgDZXm0fE97KIT4rzJZTnbq7hhjcs5lv7ITvKHL4x4-72t_2sSqrbY00hRatPQr4S0yTn7as7v32Ak8AEGgS4EHfJmFHK-Wh63T3v8GPFIu40L515s-fzFyCP5KlySHPMxWB3vcQqX8guZcO_VmptSgneAuLQuHJvWDDE5pp6WA0evDrXyX-k0JvrJLqk5wvBakNhnvU-hEvrZEg3xKZ8JHSRpds5xa3-WzizQswRGc',
    tall: true,
    details: 'Night photography studying shadow falloffs and soft cinematic glow.',
  },
  {
    id: 'curvature-studies',
    title: 'Curvature Studies',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC_3CglH6XFPv0vjHHc54IgIuu9N8DMUzbaqTkWIlYFFoG_FY2VwB6qR5YgecAcOctyGxEgpBwosG9NQ4OQOhAMenEPuyHIJ_RNT5gIDOodXbqM-3WLtqa1OKEO0RlxsBXjO3YhLJY1nI9zFR6sM0s39ZNFGAS7MEKYlsVuG55oTuecCKfw95Y3oBAs9IRXXOsumry46zc2KFjdtlOPASyMtMPLBH5AAtiUhyv-q1l2VMKeLYQDNrSMEJE5dVKKIVZL45Yt882n5g-B',
    details: 'Abstract architectural shapes and lines interacting with midday sunlight.',
  },
  {
    id: 'tokyo-reflection',
    title: 'Tokyo Reflection',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjl0RhkMC0pLu2My4nR0PHgP6QYSXEi6c4lc6omF4baDQOx3eDyJQkRHmuMxlRlaSxi2k9SjoNhv49GthpX7EU4582672rGjH-CWak93lAGU0xdZHX8NRDouGvj1V3E5-WDY1Z7nbpY7bKWacxNacf9NfPDzFgcGyo_ET_FY7VExcIDw6u6btN5-9ezeMrVR0s4aO0GqKFiPQuoG8fuP1w-ndIUZHVb-DWOmQfaz0eeYpMzg3DQ7FUFt4QiJeO7z021gl3ske7qHIO',
    tall: true,
    details: 'Neon reflections on wet streets captured in Shinjuku, Tokyo.',
  },
];

export const contents: ContentItem[] = [
  {
    id: 'cinematic-storytelling',
    title: 'Cinematic Storytelling',
    category: 'Short Film',
    description: 'A short visual essay on urban solitude and concrete landscapes.',
    tags: ['Premiere Pro', 'Color Grading', 'Videography'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDjP-loSKOjoQXdvWbIb2b8R0gNve8D9innLM_dUA7YM7lEIkc30LqoQ_cQwNisnRd4HhASUGKcNXJcAuzT4bOTJeXHYmfuF9CzVk7WT7J2qZm28I-c-tpm01O0wjFJjY-N0hv02O4PfgCkbwZmvv8eohKt8B_5R_-J9oc6wwsmwVMCggHP7-kDNsA6c8nPJLFwiWdUNbJVeQjzPKPgQSb7ZG7zammlB8xnuDcOvOI34qISsmms4MLOCFgvzSUzRWkIMnpMhMyASr49',
    cta: 'Watch Film',
    details: 'Exploring cinematography principles to showcase modern design and urban aesthetics.',
  },
  {
    id: 'bts-vannshoot',
    title: 'Behind the Scenes',
    category: 'Creative Production',
    description: 'Process and editing behind capturing moody, cinematic graduation portraits.',
    tags: ['Vlogging', 'BTS', 'DaVinci Resolve'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC5tl8RZR3ttJA3U3OiFQspC8OEZF8EweArtQgDZXm0fE97KIT4rzJZTnbq7hhjcs5lv7ITvKHL4x4-72t_2sSqrbY00hRatPQr4S0yTn7as7v32Ak8AEGgS4EHfJmFHK-Wh63T3v8GPFIu40L515s-fzFyCP5KlySHPMxWB3vcQqX8guZcO_VmptSgneAuLQuHJvWDDE5pp6WA0evDrXyX-k0JvrJLqk5wvBakNhnvU-hEvrZEg3xKZ8JHSRpds5xa3-WzizQswRGc',
    cta: 'View Behind Scenes',
    details: 'A breakdown of lighting configurations, client directions, and post-production presets.',
  },
];

export interface CategoryCard {
  id: string;
  title: string;
  description: string;
  image: string;
  path: string;
}

export const categories: CategoryCard[] = [
  {
    id: 'projects',
    title: 'Projects',
    description: 'Web development, dashboards, and digital products engineered with code.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA_eL8VaxOM1BGiGdaEfoVfZeCCpd0Eq_YqfbQNsJIoWKbjF7cjgyyETYiGJ1jpfc6DDty9FdUzZjNp7Cfbb7m5KT4Ym8PM4EBsjEg6ZW2BKb8wk9-AW_v8pY4OLyHyWqscBvAZk4G4Q3DxO-Rx0_KdQO9h2RkXGCSYdxMo_R5aZiDRvt96CI_OnzkiDVZqeMRd0bFSIS6Pi15makOhYlUD-6QmtknxKfVIJJTN_I4lT2oc-SPG7B0SoKFIGCUMv_bti3xKPWRSQd96',
    path: '/portfolio/projects',
  },
  {
    id: 'photography',
    title: 'Photography',
    description: 'Cinematic visual stories capturing urban landscapes and graduation portraits.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC3L-u1sp5AwnL-dENfmoZpcsKhOl0CR2F3TUBc0j550FsoigMMJ1Qa0BS3ePPtBO8KLZRpDGm7nytMC86BTH3N8ytspjjyPy7tlAnfgGXmNyFvQuhK6EjAFUg66i3stXqN5Qe0UiafUKIaveHQIk4aoh7khKa0skJvNsBdZTAaf4wx6LWBBcpyvlmHEtIF800Fkw-Ma6Uvh3boWMBvPKEVWvuZZSWWtO09VY_clc3pNq6tJR-ZZcc7Tw9T3krjfdCNZcmPYS3-uBAR',
    path: '/portfolio/photography',
  },
  {
    id: 'contents',
    title: 'Contents',
    description: 'Creative digital production, cinematic videos, and social media campaigns.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDjP-loSKOjoQXdvWbIb2b8R0gNve8D9innLM_dUA7YM7lEIkc30LqoQ_cQwNisnRd4HhASUGKcNXJcAuzT4bOTJeXHYmfuF9CzVk7WT7J2qZm28I-c-tpm01O0wjFJjY-N0hv02O4PfgCkbwZmvv8eohKt8B_5R_-J9oc6wwsmwVMCggHP7-kDNsA6c8nPJLFwiWdUNbJVeQjzPKPgQSb7ZG7zammlB8xnuDcOvOI34qISsmms4MLOCFgvzSUzRWkIMnpMhMyASr49',
    path: '/portfolio/contents',
  },
];
