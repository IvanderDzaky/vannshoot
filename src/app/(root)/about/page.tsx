import type { FC } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { genPageMetadata } from '@/app/seo';

export const metadata = genPageMetadata({
  title: 'Tentang Saya',
  description: 'Ivander Dzaky Khairullah — Front-End Developer & Mahasiswa Informatika di Universitas Telkom, passion di web development dan fotografi.',
});

const AboutPage: FC = () => {
  return (
    <main className="min-h-screen bg-[#0b0f11] text-[#e0e2e6]">
      {/* Hero Section */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-330 space-y-8">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#fe7f2d] mb-4">Tentang</p>
            <h1 className="text-4xl md:text-6xl font-bold font-headline text-white leading-tight">
              Ivander Dzaky Khairullah
            </h1>
            <p className="text-base md:text-lg leading-relaxed text-[#c8c7c4] mt-6">
              <strong>Front-End Developer</strong> | Mahasiswa Informatika di Universitas Telkom
            </p>
            <p className="text-base leading-relaxed text-[#c8c7c4] mt-2">
              📍 Kota Malang, Jawa Timur, Indonesia
            </p>
          </div>
        </div>
      </section>

      {/* Main About Section */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-330">
          <div className="rounded-[2.5rem] border border-white/5 bg-[#111419] p-12 mb-16">
            <h2 className="text-2xl font-bold font-headline text-white mb-6">
              Siapa Saya
            </h2>
            <div className="space-y-6 text-base leading-relaxed text-[#c8c7c4]">
              <p>
                Saya adalah mahasiswa Informatika di Universitas Telkom dengan passion mendalam terhadap software development, khususnya Frontend Development. Saya memiliki pengalaman mengembangkan aplikasi web menggunakan teknologi modern dan terus berusaha meningkatkan skill teknis serta kemampuan problem-solving saya.
              </p>
              <p>
                Selain akademik, saya aktif terlibat dalam organisasi dan kepanitiaan di kampus, di mana saya telah mengembangkan skill kepemimpinan, teamwork, komunikasi, dan project management. Saya juga memiliki minat kuat di fotografi dan creative design, yang memperkuat perhatian saya terhadap detail dan kreativitas.
              </p>
              <p>
                Saya berkomitmen untuk terus belajar, berkontribusi pada project yang meaningful, dan memperluas pengetahuan melalui kolaborasi dan pengalaman profesional.
              </p>
            </div>
          </div>

          {/* Two Column Section */}
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Development */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold font-headline text-white mb-4">
                  Web Development
                </h2>
                <p className="text-base leading-relaxed text-[#c8c7c4] mb-6">
                  Expertise saya dalam frontend development:
                </p>
                <ul className="space-y-3 text-[#c8c7c4]">
                  <li className="flex gap-3">
                    <span className="text-[#fe7f2d] font-semibold">•</span>
                    <span><strong>Frontend Modern</strong> — React, Next.js, TypeScript</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#fe7f2d] font-semibold">•</span>
                    <span><strong>Database</strong> — DBMS, Node.js backend</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#fe7f2d] font-semibold">•</span>
                    <span><strong>Tools & Workflow</strong> — GitHub, version control, deployment</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#fe7f2d] font-semibold">•</span>
                    <span><strong>Problem Solving</strong> — Algoritma, optimasi, clean code</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Photography & Design */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold font-headline text-white mb-4">
                  Fotografi & Design
                </h2>
                <p className="text-base leading-relaxed text-[#c8c7c4] mb-6">
                  Passion saya di visual storytelling:
                </p>
                <ul className="space-y-3 text-[#c8c7c4]">
                  <li className="flex gap-3">
                    <span className="text-[#fe7f2d] font-semibold">•</span>
                    <span><strong>Event Photography</strong> — Dokumentasi acara universitas & komunitas</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#fe7f2d] font-semibold">•</span>
                    <span><strong>Photo Editing</strong> — Adobe Lightroom, Photoshop</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#fe7f2d] font-semibold">•</span>
                    <span><strong>Design & Branding</strong> — Canva, promotional materials, visual content</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#fe7f2d] font-semibold">•</span>
                    <span><strong>Visual Storytelling</strong> — Konsistensi branding, creative concepts</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="px-6 py-24 border-t border-white/5">
        <div className="mx-auto max-w-330">
          <h2 className="text-3xl font-bold font-headline text-white mb-12">
            Pengalaman Profesional
          </h2>
          <div className="space-y-8">
            {/* Current */}
            <div className="rounded-2xl border border-white/10 bg-[#111419]/50 p-8">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold text-white">Web Programmer Intern</h3>
                  <p className="text-[#fe7f2d] font-semibold">Telkomsel</p>
                </div>
                <span className="text-sm text-[#c8c7c4] bg-[#fe7f2d]/10 px-3 py-1 rounded-full">Jul 2026 - Present</span>
              </div>
              <p className="text-sm text-[#c8c7c4] mb-3">Surabaya, East Java, Indonesia · On-site</p>
              <p className="text-[#c8c7c4] leading-relaxed">
                Intern di Telkomsel sebagai Web Programmer, mengembangkan dan mengoptimalkan aplikasi web.
              </p>
            </div>

            {/* UKM Fotografi */}
            <div className="rounded-2xl border border-white/10 bg-[#111419]/50 p-8">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold text-white">Staff Divisi Hunting</h3>
                  <p className="text-[#fe7f2d] font-semibold">UKM Fotografi Universitas Telkom</p>
                </div>
                <span className="text-sm text-[#c8c7c4] bg-[#fe7f2d]/10 px-3 py-1 rounded-full">Dec 2024 - Present</span>
              </div>
              <p className="text-sm text-[#c8c7c4] mb-3">Bandung, West Java, Indonesia</p>
              <ul className="space-y-2 text-[#c8c7c4] text-sm">
                <li>• Merencanakan dan melaksanakan sesi fotografi untuk acara universitas, workshop, dan aktivitas organisasi</li>
                <li>• Mengabadikan foto berkualitas tinggi menggunakan peralatan profesional</li>
                <li>• Mengedit foto menggunakan Adobe Lightroom dan Adobe Photoshop</li>
                <li>• Berkontribusi konsep kreatif untuk visual storytelling dan branding organisasi</li>
              </ul>
            </div>

            {/* Kepanitiaan */}
            <div className="rounded-2xl border border-white/10 bg-[#111419]/50 p-8">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold text-white">Kepala Humas Panitia</h3>
                  <p className="text-[#fe7f2d] font-semibold">Kaderisasi Dasar 2025 - UKM Fotografi</p>
                </div>
                <span className="text-sm text-[#c8c7c4] bg-[#fe7f2d]/10 px-3 py-1 rounded-full">Oct 2025 - Dec 2025</span>
              </div>
              <p className="text-sm text-[#c8c7c4] mb-3">On-site</p>
              <ul className="space-y-2 text-[#c8c7c4] text-sm">
                <li>• Memimpin Divisi Public Relations untuk perencanaan dan eksekusi strategi komunikasi event</li>
                <li>• Mengoordinasikan komunikasi internal dan eksternal dengan peserta, pembicara, dan panitia</li>
                <li>• Mengelola aktivitas promosi dan diseminasi informasi across communication channels</li>
                <li>• Berkolaborasi dengan divisi lain untuk kesuksesan event</li>
              </ul>
            </div>

            {/* Esports */}
            <div className="rounded-2xl border border-white/10 bg-[#111419]/50 p-8">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold text-white">Exclusive Member</h3>
                  <p className="text-[#fe7f2d] font-semibold">Telkom University Esports</p>
                </div>
                <span className="text-sm text-[#c8c7c4] bg-[#fe7f2d]/10 px-3 py-1 rounded-full">Jan 2026 - Present</span>
              </div>
              <p className="text-sm text-[#c8c7c4] mb-3">Bandung, West Java, Indonesia · Hybrid</p>
              <p className="text-[#c8c7c4] leading-relaxed text-sm">
                Aktif berpartisipasi dalam program dan aktivitas komunitas TELU Esports, mengembangkan teamwork dan pengetahuan industry esports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills & Certifications */}
      <section className="px-6 py-24 bg-[#111419]/50">
        <div className="mx-auto max-w-330">
          <h2 className="text-3xl font-bold font-headline text-white mb-12">
            Skill & Sertifikasi Utama
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Top Skills</h3>
              <div className="flex flex-wrap gap-3">
                {['Web Development', 'Photography', 'Adobe Lightroom', 'React', 'Next.js', 'TypeScript', 'Node.js', 'GitHub', 'Teamwork', 'Leadership'].map((skill) => (
                  <span key={skill} className="px-4 py-2 rounded-full bg-[#fe7f2d]/10 border border-[#fe7f2d]/30 text-sm text-[#fe7f2d] font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Sertifikasi</h3>
              <ul className="space-y-3 text-[#c8c7c4] text-sm">
                <li className="flex gap-2">
                  <span className="text-[#fe7f2d]">✓</span>
                  <span><strong>Microsoft Certified: Azure AI Fundamentals (AI-900)</strong> — Mar 2026, Score: 929/1000</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#fe7f2d]">✓</span>
                  <span><strong>RevoU Coding Camp</strong> — Jul 2026, HTML, JavaScript, Software Development</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#fe7f2d]">✓</span>
                  <span><strong>42+ Google Cloud Certifications</strong> (Aug 2026 - Jul 2026):</span>
                </li>
                <li className="text-[#c8c7c4] text-xs ml-6 space-y-1">
                  <div>• Develop with Apps Script & AppSheet • Network Security Engineer</div>
                  <div>• Privileged Access with IAM • Google Sheets • CI/CD Pipelines</div>
                  <div>• Data Management & Processing • Kubernetes Management • Monitoring</div>
                  <div>• Natural Language API • Cloud Networks • BigQuery • Terraform</div>
                  <div>• Cloud Run Functions • AppSheet • Gemini Enterprise • dan lainnya</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-330">
          <h2 className="text-3xl font-bold font-headline text-white mb-12">
            Pendidikan
          </h2>
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#111419]/50 p-8">
              <h3 className="text-xl font-bold text-white mb-2">Universitas Telkom</h3>
              <p className="text-[#fe7f2d] font-semibold mb-3">Bachelor Degree, Informatika</p>
              <p className="text-[#c8c7c4] text-sm mb-4">2023 – 2027</p>
              <p className="text-[#c8c7c4] text-sm">
                Focus: Database Management System, Node.js, Web Development, dan teknologi modern lainnya.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#111419]/50 p-8">
              <h3 className="text-xl font-bold text-white mb-2">SMK Telkom Malang</h3>
              <p className="text-[#c8c7c4] text-sm mb-4">Jul 2020 – May 2023</p>
              <p className="text-[#c8c7c4] text-sm">
                Foundation di bidang teknologi informasi dengan fokus pada software development basics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy & Vision */}
      <section className="px-6 py-24 border-t border-white/5">
        <div className="mx-auto max-w-330">
          <div className="rounded-[2.5rem] border border-white/5 bg-[#111419] p-12">
            <h2 className="text-3xl font-bold font-headline text-white mb-6">
              Visi & Komitmen
            </h2>
            <div className="space-y-6 text-base leading-relaxed text-[#c8c7c4]">
              <p>
                Saya percaya bahwa web development adalah tentang menciptakan pengalaman yang meaningful bagi user. Fotografi dan design memberi saya perspektif tentang visual storytelling yang saya terapkan dalam development.
              </p>
              <div className="space-y-3">
                <p className="font-semibold text-white">Komitmen saya:</p>
                <ul className="space-y-2">
                  <li className="flex gap-3">
                    <span className="text-[#fe7f2d] font-semibold">→</span>
                    <span>Terus belajar dan mengikuti perkembangan teknologi terbaru</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#fe7f2d] font-semibold">→</span>
                    <span>Menulis clean, maintainable code yang easy to collaborate on</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#fe7f2d] font-semibold">→</span>
                    <span>Berkontribusi pada project yang memberikan dampak positif</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#fe7f2d] font-semibold">→</span>
                    <span>Mengembangkan soft skills: leadership, teamwork, communication</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 bg-[#111419]/50">
        <div className="mx-auto max-w-330 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-white mb-6">
            Tertarik untuk Berkolaborasi?
          </h2>
          <p className="text-lg text-[#c8c7c4] mb-10 max-w-2xl mx-auto">
            Saya terbuka untuk project development, fotografi, atau kolaborasi kreatif. Mari kita ciptakan sesuatu yang luar biasa bersama.
          </p>
          <Link
            href={'/contact' as Route}
            className="inline-flex rounded-full bg-[#fe7f2d] px-12 py-4 text-sm font-bold uppercase tracking-[0.15em] text-[#331100] transition-transform duration-300 hover:scale-105"
          >
            Hubungi Saya
          </Link>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
