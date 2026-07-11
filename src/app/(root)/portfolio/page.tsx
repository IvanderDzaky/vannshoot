import type { FC } from 'react';

import { genPageMetadata } from '@/app/seo';

export const metadata = genPageMetadata({
  title: 'Portfolio',
  description: 'Selected works and creative projects by Vannshoot.',
});

const projects = [
  {
    title: 'Vanguard OS',
    category: 'Development',
    description: 'Next-gen dashboard for aerospace logistics with real-time telemetry.',
    tags: ['React', 'Three.js', 'Tailwind'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA_eL8VaxOM1BGiGdaEfoVfZeCCpd0Eq_YqfbQNsJIoWKbjF7cjgyyETYiGJ1jpfc6DDty9FdUzZjNp7Cfbb7m5KT4Ym8PM4EBsjEg6ZW2BKb8wk9-AW_v8pY4OLyHyWqscBvAZk4G4Q3DxO-Rx0_KdQO9h2RkXGCSYdxMo_R5aZiDRvt96CI_OnzkiDVZqeMRd0bFSIS6Pi15makOhYlUD-6QmtknxKfVIJJTN_I4lT2oc-SPG7B0SoKFIGCUMv_bti3xKPWRSQd96',
    cta: 'View Case Study',
  },
  {
    title: 'Nocturnal Lines',
    category: 'Photography',
    description: 'Exploring urban architecture through long-exposure night photography.',
    tags: ['Sony A7RIV', '35mm', 'Night Shift'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDjP-loSKOjoQXdvWbIb2b8R0gNve8D9innLM_dUA7YM7lEIkc30LqoQ_cQwNisnRd4HhASUGKcNXJcAuzT4bOTJeXHYmfuF9CzVk7WT7J2qZm28I-c-tpm01O0wjFJjY-N0hv02O4PfgCkbwZmvv8eohKt8B_5R_-J9oc6wwsmwVMCggHP7-kDNsA6c8nPJLFwiWdUNbJVeQjzPKPgQSb7ZG7zammlB8xnuDcOvOI34qISsmms4MLOCFgvzSUzRWkIMnpMhMyASr49',
    cta: 'Full Gallery',
  },
  {
    title: 'Ethos Archive',
    category: 'Design',
    description: 'Brand identity and interactive portfolio for a Paris-based fashion house.',
    tags: ['Figma', 'WebGL'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD7xDB058hXAnfZlbGzjycxte2hZMA7viM7UeKxWvFoaG80fbfxeagrgSE_l_5ahRSjmp5-HqSU_cDzJZjqokuPutT4J0zNi9FGlPIsr3zDQU6foJVtuiwcSz7L_fTuPZiIIchDLKNugYiFoXFQlDH5fMHnfuEhXGCKYf1b99oKJfZh1TH1K7AeiZK9D27lVTrW3xYqZz3NTQZ_VwF0GQxEBmbSHxfEIK2w8v9auTt0CjPEbykE1D_h3PtK5IpZ2UT0KFx7aGWfLLLY',
    cta: 'View Design',
  },
  {
    title: 'Quantify',
    category: 'Development',
    description: 'Personal finance engine with custom-built data visualization libraries.',
    tags: ['Next.js', 'D3.js'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCSzQTnWYSBbZUkXO_2n3ORMGAY8wDFze6LG2OXF0A1595SHdjKpVwQq5npSMMcxd7VJi3x4E4e-qtE1xy1RZspkwgMoQLBfvC7o5viYC6qkBnB2JHARCcoF8mwXJDGzFw2lL7I3hQY2HZyHy0m6cFgxsz7CJOdnDECYTojqEELF55iQR7GCbFYGLHdK9JKGqqs68227nhohpbxg3rehmPJBd_ASwyyC0TxNm2KhJ0DhNejjnxLeYmXSkkdqSrwysle2edZ7e_-QOT3',
    cta: 'Live Demo',
  },
];

const photos = [
  {
    title: 'Icelandic Fury',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC3L-u1sp5AwnL-dENfmoZpcsKhOl0CR2F3TUBc0j550FsoigMMJ1Qa0BS3ePPtBO8KLZRpDGm7nytMC86BTH3N8ytspjjyPy7tlAnfgGXmNyFvQuhK6EjAFUg66i3stXqN5Qe0UiafUKIaveHQIk4aoh7khKa0skJvNsBdZTAaf4wx6LWBBcpyvlmHEtIF800Fkw-Ma6Uvh3boWMBvPKEVWvuZZSWWtO09VY_clc3pNq6tJR-ZZcc7Tw9T3krjfdCNZcmPYS3-uBAR',
  },
  {
    title: 'Nocturne Portrait',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC5tl8RZR3ttJA3U3OiFQspC8OEZF8EweArtQgDZXm0fE97KIT4rzJZTnbq7hhjcs5lv7ITvKHL4x4-72t_2sSqrbY00hRatPQr4S0yTn7as7v32Ak8AEGgS4EHfJmFHK-Wh63T3v8GPFIu40L515s-fzFyCP5KlySHPMxWB3vcQqX8guZcO_VmptSgneAuLQuHJvWDDE5pp6WA0evDrXyX-k0JvrJLqk5wvBakNhnvU-hEvrZEg3xKZ8JHSRpds5xa3-WzizQswRGc',
    tall: true,
  },
  {
    title: 'Curvature Studies',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC_3CglH6XFPv0vjHHc54IgIuu9N8DMUzbaqTkWIlYFFoG_FY2VwB6qR5YgecAcOctyGxEgpBwosG9NQ4OQOhAMenEPuyHIJ_RNT5gIDOodXbqM-3WLtqa1OKEO0RlxsBXjO3YhLJY1nI9zFR6sM0s39ZNFGAS7MEKYlsVuG55oTuecCKfw95Y3oBAs9IRXXOsumry46zc2KFjdtlOPASyMtMPLBH5AAtiUhyv-q1l2VMKeLYQDNrSMEJE5dVKKIVZL45Yt882n5g-B',
  },
  {
    title: 'Tokyo Reflection',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjl0RhkMC0pLu2My4nR0PHgP6QYSXEi6c4lc6omF4baDQOx3eDyJQkRHmuMxlRlaSxi2k9SjoNhv49GthpX7EU4582672rGjH-CWak93lAGU0xdZHX8NRDouGvj1V3E5-WDY1Z7nbpY7bKWacxNacf9NfPDzFgcGyo_ET_FY7VExcIDw6u6btN5-9ezeMrVR0s4aO0GqKFiPQuoG8fuP1w-ndIUZHVb-DWOmQfaz0eeYpMzg3DQ7FUFt4QiJeO7z021gl3ske7qHIO',
    tall: true,
  },
];

const PortfolioPage: FC = () => {
  return (
    <main className="min-h-screen bg-[#0b0f11] text-[#e0e2e6]">
      <section className="relative overflow-hidden py-24 px-6">
        <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-[#ffb68f]/10 blur-[120px]" />
        <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-[#afcade]/10 blur-[120px]" />
        <div className="relative z-10 mx-auto max-w-300 space-y-6 text-center">
          <span className="block text-[14px] uppercase tracking-[0.35em] text-[#ffb68f] font-label">
            Portfolio
          </span>
          <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight text-white md:text-[56px] font-headline">
            Selected Works & creative projects
            <span className="text-[#ffb68f] italic"> with cinematic impact</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-7 text-[#c8c7c4] md:text-lg">
            A curated collection of digital architecture and visual art, bridging the gap between
            functional performance and cinematic aesthetic.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto flex flex-wrap justify-center gap-4 max-w-300">
          {['All Projects', 'Development', 'Photography', 'Digital Art'].map((label, index) => (
            <button
              key={label}
              className={
                index === 0
                  ? 'rounded-full border border-[#ffb68f] bg-[#ffb68f] px-8 py-3 text-[13px] font-semibold uppercase tracking-[0.15em] text-[#331100] transition-all'
                  : 'rounded-full border border-[#4b525a] bg-[#171c20] px-8 py-3 text-[13px] font-semibold uppercase tracking-[0.15em] text-[#c8c7c4] transition-all hover:border-[#ffb68f]/60 hover:text-[#ffb68f]'
              }
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid gap-6 max-w-300 md:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project.title}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#111419] shadow-[0_24px_80px_rgba(0,0,0,0.25)] transition-all duration-500 hover:-translate-y-2"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  loading="lazy"
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-8">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-semibold text-white">{project.title}</h3>
                  <span className="rounded-full bg-[#ffb68f]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ffb68f]">
                    {project.category}
                  </span>
                </div>
                <p className="mb-6 text-sm leading-7 text-[#c8c7c4]">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#3d4652]/80 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#c8c7c4]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-[#0b0f11]/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <button className="rounded-full border border-[#ffb68f] bg-[#ffb68f] px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#331100] transition-transform duration-300 hover:scale-105">
                  {project.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#171c20] border-t border-[#2a3036] py-24 px-6">
        <div className="mx-auto flex flex-col gap-8 max-w-300 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <span className="block text-sm uppercase tracking-[0.28em] text-[#ffb68f] font-label">
              Cinematic Vision
            </span>
            <h2 className="text-4xl font-bold leading-tight text-white md:text-5xl font-headline">
              Photography Gallery
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[#c8c7c4] md:text-base">
            A focus on cinematic lighting, professional color grading, and the beauty found in the
            intersection of shadows and architecture.
          </p>
        </div>

        <div className="mx-auto mt-12 grid gap-6 max-w-300 md:grid-cols-2 auto-rows-fr">
          {photos.map((photo) => (
            <div
              key={photo.title}
              className={`relative overflow-hidden rounded-3xl border border-white/10 bg-[#111419] transition-all duration-500 group cursor-pointer ${
                photo.tall ? 'md:row-span-2' : ''
              }`}
            >
              <img
                loading="lazy"
                src={photo.image}
                alt={photo.title}
                className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/80 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ffb68f]">
                  {photo.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="mx-auto max-w-200 rounded-[2rem] border border-[#2a3036] bg-[#111419] p-12 text-center shadow-[0_40px_120px_rgba(0,0,0,0.25)]">
          <h2 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl font-headline">
            Ready to start a project?
          </h2>
          <p className="mb-10 text-base leading-7 text-[#c8c7c4]">
            Let&apos;s collaborate to build something that stands out from the noise.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button className="w-full rounded-full bg-[#ffb68f] px-10 py-4 text-sm font-bold uppercase tracking-[0.15em] text-[#331100] transition-transform duration-300 hover:scale-105 sm:w-auto">
              Send a Message
            </button>
            <button className="w-full rounded-full border border-[#4b525a] bg-transparent px-10 py-4 text-sm font-bold uppercase tracking-[0.15em] text-[#e0e2e6] transition-colors duration-300 hover:bg-[#1f262c] sm:w-auto">
              Download Resume
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PortfolioPage;
