import type { FC } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { genPageMetadata } from '@/app/seo';

export const metadata = genPageMetadata({
  title: 'Tentang Saya',
  description:
    'Ivander Dzaky Khairullah — Front-End Developer & Mahasiswa Informatika Universitas Telkom dengan keahlian dalam web development dan fotografi.',
});

interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  period: string;
  location: string;
  descriptions: string[];
}

interface BadgeItem {
  name: string;
  url: string;
}

const badgeSkills: BadgeItem[] = [
  // Languages & Frontend
  {
    name: 'React',
    url: 'https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black',
  },
  {
    name: 'Next.js',
    url: 'https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white',
  },
  {
    name: 'TypeScript',
    url: 'https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white',
  },
  {
    name: 'Tailwind CSS',
    url: 'https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white',
  },
  {
    name: 'Bootstrap',
    url: 'https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white',
  },
  {
    name: 'HTML5',
    url: 'https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white',
  },
  {
    name: 'CSS3',
    url: 'https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white',
  },
  {
    name: 'Flutter',
    url: 'https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white',
  },
  // Backend & Languages
  {
    name: 'Node.js',
    url: 'https://img.shields.io/badge/Node.js-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white',
  },
  {
    name: 'PHP',
    url: 'https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white',
  },
  {
    name: 'Java',
    url: 'https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white',
  },
  {
    name: 'Python',
    url: 'https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white',
  },
  {
    name: 'FastAPI',
    url: 'https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white',
  },
  // Databases
  {
    name: 'MySQL',
    url: 'https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white',
  },
  {
    name: 'PostgreSQL',
    url: 'https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white',
  },
  // Cloud, Tools & Editors
  {
    name: 'Google Cloud',
    url: 'https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white',
  },
  {
    name: 'Microsoft Azure',
    url: 'https://img.shields.io/badge/Microsoft_Azure-0089D6?style=for-the-badge&logo=microsoftazure&logoColor=white',
  },
  {
    name: 'GitHub',
    url: 'https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white',
  },
  {
    name: 'Git',
    url: 'https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white',
  },
  {
    name: 'VS Code',
    url: 'https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white',
  },
  // Design & Media
  {
    name: 'Adobe Lightroom',
    url: 'https://img.shields.io/badge/Adobe_Lightroom-31A8FF?style=for-the-badge&logo=adobelightroom&logoColor=white',
  },
  {
    name: 'Adobe Photoshop',
    url: 'https://img.shields.io/badge/Adobe_Photoshop-31A8FF?style=for-the-badge&logo=adobephotoshop&logoColor=white',
  },
];

interface CertificationItem {
  title: string;
  period: string;
  score?: string;
  details?: string[];
}

interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  description: string;
}

const experiences: ExperienceItem[] = [
  {
    id: 'telkomsel-intern',
    role: 'Web Programmer Intern',
    organization: 'Telkomsel',
    period: '20 Jul 2026 – 28 Aug 2026',
    location: 'Surabaya, Jawa Timur, Indonesia · On-site',
    descriptions: [
      'Mengembangkan website monitoring dan analisis trafik jaringan berbasis AI memanfaatkan data Observium untuk otomatisasi wawasan performa jaringan.',
      'Mengoptimalkan antarmuka dan responsivitas aplikasi web untuk efisiensi pemantauan tim teknis.',
    ],
  },
  {
    id: 'ukm-fotografi-staff',
    role: 'Staff Divisi Hunting',
    organization: 'UKM Fotografi Universitas Telkom',
    period: 'Des 2024 – Sekarang',
    location: 'Bandung, Jawa Barat, Indonesia',
    descriptions: [
      'Merencanakan dan melaksanakan sesi fotografi untuk acara universitas, lokakarya, dan aktivitas organisasi.',
      'Mengabadikan foto berkualitas tinggi menggunakan peralatan fotografi profesional.',
      'Melakukan penyuntingan foto menggunakan Adobe Lightroom dan Adobe Photoshop.',
      'Berkontribusi dalam penyusunan konsep kreatif untuk narasi visual dan pencitraan merek organisasi.',
    ],
  },
  {
    id: 'kaderisasi-humas',
    role: 'Kepala Humas Panitia',
    organization: 'Kaderisasi Dasar 2025 - UKM Fotografi',
    period: 'Okt 2025 – Des 2025',
    location: 'Bandung, Jawa Barat, Indonesia · On-site',
    descriptions: [
      'Memimpin Divisi Hubungan Masyarakat dalam perencanaan dan eksekusi strategi komunikasi acara.',
      'Mengoordinasikan komunikasi internal dan eksternal antara peserta, pembicara, dan panitia.',
      'Mengelola aktivitas promosi serta penyebaran informasi melalui berbagai saluran komunikasi.',
      'Berkolaborasi lintas divisi untuk memastikan kelancaran dan keberhasilan pelaksanaan acara.',
    ],
  },
  {
    id: 'telu-esports',
    role: 'Exclusive Member',
    organization: 'Telkom University Esports',
    period: 'Jan 2026 – Sekarang',
    location: 'Bandung, Jawa Barat, Indonesia · Hybrid',
    descriptions: [
      'Aktif berpartisipasi dalam program dan aktivitas komunitas Telkom University Esports, mengasah kerja sama tim dan wawasan industri e-sports.',
    ],
  },
];

const certifications: CertificationItem[] = [
  {
    title: 'Microsoft Certified: Azure AI Fundamentals (AI-900)',
    period: 'Mar 2026',
    score: 'Skor: 929/1000',
  },
  {
    title: 'RevoU Coding Camp',
    period: 'Jul 2026',
    score: 'HTML, JavaScript, Software Development',
  },
  {
    title: '42+ Google Cloud Skill Badges',
    period: 'Jul 2026 – Aug 2026',
    details: [
      'Develop with Apps Script & AppSheet • Network Security Engineer',
      'Privileged Access with IAM • Google Sheets • CI/CD Pipelines',
      'Data Management & Processing • Kubernetes Management • Monitoring',
      'Natural Language API • Cloud Networks • BigQuery • Terraform',
      'Cloud Run Functions • Gemini Enterprise • dan lainnya',
    ],
  },
];

const educations: EducationItem[] = [
  {
    institution: 'Universitas Telkom',
    degree: 'S1 Informatika',
    period: '2023 – 2027',
    description:
      'Fokus studi pada Sistem Manajemen Basis Data, Node.js, Web Development, dan teknologi perangkat lunak modern.',
  },
  {
    institution: 'SMK Telkom Malang',
    degree: 'Teknik Komputer dan Jaringan / Rekayasa Perangkat Lunak',
    period: 'Jul 2020 – Mei 2023',
    description:
      'Pendidikan dasar bidang teknologi informasi dengan fokus pada fondasi pengembangan perangkat lunak.',
  },
];

const webDevCapabilities: string[] = [
  'Frontend Modern — React, Next.js, TypeScript, Tailwind CSS',
  'Backend & Data — Node.js, FastAPI, MySQL, PostgreSQL',
  'Alat & Alur Kerja — GitHub, kontrol versi, integrasi API',
  'Penyelesaian Masalah — Algoritma, pemantauan sistem, clean code',
];

const photographyCapabilities: string[] = [
  'Fotografi Acara — Dokumentasi kegiatan universitas dan komunitas',
  'Penyuntingan Foto — Adobe Lightroom, Adobe Photoshop',
  'Desain & Pencitraan Merek — Materi promosi dan konten visual',
  'Narasi Visual — Konsistensi estetika visual dan konsep kreatif',
];

const commitmentItems: string[] = [
  'Terus mengasah keahlian teknis dan mengikuti perkembangan teknologi modern',
  'Menulis kode yang bersih, terstruktur, dan mudah dikolaborasikan',
  'Berkontribusi pada proyek digital yang memberikan dampak nyata',
  'Mengembangkan keahlian interpersonal seperti kepemimpinan dan komunikasi',
];

const AboutPage: FC = () => {
  return (
    <main className="min-h-screen bg-[#0b0f11] text-[#e0e2e6]">
      {/* Header Section */}
      <section className="pt-28 pb-6 px-6">
        <div className="mx-auto max-w-330 space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-[#fe7f2d]">Tentang</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-headline text-white leading-tight">
            Ivander Dzaky Khairullah
          </h1>
          <p className="text-lg md:text-xl leading-relaxed text-[#c8c7c4] max-w-3xl">
            <strong className="text-white">Front-End Developer</strong> & Mahasiswa S1 Informatika
            di Universitas Telkom
          </p>
          <div className="flex items-center gap-2 text-sm text-[#9e9d9a] pt-1">
            <MapPin className="w-4 h-4 text-[#fe7f2d] shrink-0" aria-hidden="true" />
            <span>Malang, Jawa Timur, Indonesia</span>
          </div>
        </div>
      </section>

      {/* Main About Section */}
      <section className="px-6 pt-2 pb-10 md:pt-4 md:pb-14">
        <div className="mx-auto max-w-330 space-y-12">
          {/* Ringkasan Profil */}
          <div className="rounded-3xl border border-white/10 bg-[#111419] p-6 sm:p-8 md:p-12">
            <div className="space-y-5 text-base leading-relaxed text-[#c8c7c4]">
              <p>
                Saya adalah mahasiswa S1 Informatika di Telkom University dengan fokus utama pada
                Frontend Development dan Fotografi. Saya memiliki ketertarikan dalam membangun
                pengalaman digital yang modern, responsif, dan mudah digunakan dengan tetap
                memperhatikan kualitas visual serta detail antarmuka.
              </p>
              <p>
                Dalam pengembangan web, saya terbiasa menggunakan teknologi seperti React, Next.js,
                TypeScript, Tailwind CSS, Node.js, FastAPI, MySQL, dan PostgreSQL. Saya terus
                mengembangkan kemampuan dalam frontend development sekaligus memperluas pemahaman
                mengenai backend, API, basis data, UI/UX, serta penerapan teknologi Artificial
                Intelligence dalam pengembangan aplikasi.
              </p>
              <p>
                Di luar bidang teknologi, saya aktif dalam kegiatan fotografi dan berbagai kegiatan
                organisasi maupun kepanitiaan kampus. Fotografi membantu saya mengembangkan kepekaan
                terhadap komposisi, warna, pencahayaan, detail, dan storytelling visual, yang juga
                memengaruhi cara saya melihat dan merancang sebuah antarmuka digital.
              </p>
              <p>
                Perpaduan antara kemampuan teknis dan kreativitas visual menjadi dasar pendekatan
                saya dalam berkarya. Saya percaya bahwa pengalaman digital yang baik tidak hanya
                harus berfungsi dengan baik, tetapi juga intuitif, menarik secara visual, dan
                memberikan pengalaman yang nyaman bagi pengguna.
              </p>
            </div>
          </div>

          {/* Kapabilitas Utama */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/5 bg-[#111419]/50 p-6 sm:p-8 space-y-4">
              <h3 className="text-2xl font-bold font-headline text-white">Web Development</h3>
              <p className="text-sm text-[#c8c7c4]">
                Keahlian utama dalam pengembangan aplikasi web modern:
              </p>
              <ul className="space-y-3 text-sm text-[#c8c7c4]">
                {webDevCapabilities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-[#fe7f2d] font-bold select-none">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-white/5 bg-[#111419]/50 p-6 sm:p-8 space-y-4">
              <h3 className="text-2xl font-bold font-headline text-white">Fotografi & Desain</h3>
              <p className="text-sm text-[#c8c7c4]">
                Keahlian dalam dokumentasi visual dan estetika media:
              </p>
              <ul className="space-y-3 text-sm text-[#c8c7c4]">
                {photographyCapabilities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-[#fe7f2d] font-bold select-none">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pengalaman Profesional & Organisasi */}
      <section className="px-6 py-12 md:py-16 border-t border-white/5">
        <div className="mx-auto max-w-330">
          <h2 className="text-3xl font-bold font-headline text-white mb-8 md:mb-10">
            Pengalaman Pengembangan & Organisasi
          </h2>
          <div className="space-y-6">
            {experiences.map((exp) => (
              <article
                key={exp.id}
                className="rounded-2xl border border-white/10 bg-[#111419]/50 p-6 sm:p-8 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                    <p className="text-[#fe7f2d] font-semibold text-sm sm:text-base">
                      {exp.organization}
                    </p>
                  </div>
                  <span className="inline-block text-xs sm:text-sm text-[#c8c7c4] bg-[#fe7f2d]/10 border border-[#fe7f2d]/20 px-3 py-1 rounded-full self-start sm:self-auto shrink-0 whitespace-nowrap">
                    {exp.period}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#9e9d9a]">{exp.location}</p>
                <ul className="space-y-2 text-sm text-[#c8c7c4] pt-1">
                  {exp.descriptions.map((desc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#fe7f2d] shrink-0 select-none">•</span>
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Skill & Sertifikasi */}
      <section className="px-6 py-12 md:py-16 bg-[#111419]/50">
        <div className="mx-auto max-w-330">
          <h2 className="text-3xl font-bold font-headline text-white mb-8 md:mb-10">
            Keahlian & Sertifikasi
          </h2>
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Daftar Keahlian</h3>
              <div className="flex flex-wrap gap-2">
                {badgeSkills.map((badge) => (
                  <img
                    key={badge.name}
                    src={badge.url}
                    alt={badge.name}
                    className="h-7 rounded"
                    loading="lazy"
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-6">Sertifikasi Utama</h3>
              <div className="space-y-4">
                {certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-white/5 bg-[#111419] p-4 space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm sm:text-base font-semibold text-white flex items-start gap-2">
                        <CheckCircle2
                          className="w-4 h-4 text-[#fe7f2d] shrink-0 mt-1"
                          aria-hidden="true"
                        />
                        <span>{cert.title}</span>
                      </h4>
                      <span className="text-xs text-[#9e9d9a] shrink-0">{cert.period}</span>
                    </div>
                    {cert.score && (
                      <p className="text-xs text-[#fe7f2d] font-medium pl-6">{cert.score}</p>
                    )}
                    {cert.details && (
                      <ul className="text-xs text-[#c8c7c4] pl-6 space-y-1 pt-1">
                        {cert.details.map((d, i) => (
                          <li key={i}>• {d}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pendidikan */}
      <section className="px-6 py-12 md:py-16">
        <div className="mx-auto max-w-330">
          <h2 className="text-3xl font-bold font-headline text-white mb-8 md:mb-10">
            Riwayat Pendidikan
          </h2>
          <div className="space-y-6">
            {educations.map((edu, idx) => (
              <article
                key={idx}
                className="rounded-2xl border border-white/10 bg-[#111419]/50 p-6 sm:p-8 space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <h3 className="text-xl font-bold text-white">{edu.institution}</h3>
                  <span className="text-xs sm:text-sm text-[#fe7f2d] font-semibold">
                    {edu.period}
                  </span>
                </div>
                <p className="text-sm font-semibold text-[#c8c7c4]">{edu.degree}</p>
                <p className="text-sm text-[#9e9d9a] leading-relaxed pt-1">{edu.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Visi & Komitmen */}
      <section className="px-6 py-12 md:py-16 border-t border-white/5">
        <div className="mx-auto max-w-330">
          <div className="rounded-3xl border border-white/5 bg-[#111419] p-6 sm:p-8 md:p-12 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold font-headline text-white">
              Visi & Komitmen
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-[#c8c7c4]">
              <p>
                Saya percaya bahwa pengembangan perangkat lunak bukan sekadar menulis baris kode,
                melainkan menghadirkan solusi bernilai yang memudahkan pengguna. Kombinasi latar
                belakang Informatika dan kreativitas dalam fotografi memungkinkan saya merancang
                produk web yang tidak hanya andal secara teknis, tetapi juga nyaman digunakan secara
                estetis.
              </p>
              <div className="space-y-3 pt-2">
                <p className="font-semibold text-white">Komitmen pengembangan saya:</p>
                <ul className="space-y-2.5">
                  {commitmentItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <ArrowRight
                        className="w-4 h-4 text-[#fe7f2d] shrink-0 mt-1"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-330 px-6">
          <div className="glass-panel relative overflow-hidden rounded-3xl border border-white/10 p-6 sm:p-8 md:p-12">
            <div className="absolute inset-0 bg-linear-to-br from-[#fe7f2d]/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative z-10 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-white font-headline">
                Tertarik untuk Berkolaborasi?
              </h2>
              <p className="mx-auto mt-4 mb-8 max-w-2xl text-sm md:text-base leading-relaxed text-[#c8c7c4]">
                Saya terbuka untuk proyek pengembangan web, kebutuhan dokumentasi fotografi, atau
                kolaborasi kreatif lainnya.
              </p>
              <Link
                href={'/contact' as Route}
                className="inline-flex items-center gap-2 rounded-full bg-[#fe7f2d] px-10 py-4 text-sm font-bold uppercase tracking-[0.15em] text-[#331100] transition-transform duration-300 hover:scale-105 active:scale-95"
              >
                <span>Hubungi Saya</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
