import type { FC } from 'react';
import { Mail, MapPin, Clock } from 'lucide-react';
import { GitHubIcon, InstagramIcon, LinkedInIcon } from '@/components/Common/CustomIcons';
import { genPageMetadata } from '@/app/seo';
import ContactForm from './_components/ContactForm';

export const metadata = genPageMetadata({
  title: 'Kontak',
  description:
    'Hubungi Ivander Dzaky Khairullah untuk diskusi proyek web development, dokumentasi fotografi, atau UI/UX dan visual design.',
});

const contactDirectItems = [
  {
    icon: Mail,
    title: 'Alamat Email',
    value: 'ivanderdzaky@gmail.com',
    href: 'mailto:ivanderdzaky@gmail.com',
    subtext: 'Respons via email biasanya dalam 1x24 jam',
  },
  {
    icon: MapPin,
    title: 'Lokasi & Basis',
    value: 'Malang & Bandung, Indonesia',
    subtext: 'Terbuka untuk pekerjaan Remote & On-site',
  },
  {
    icon: Clock,
    title: 'Waktu Operasional',
    value: 'Senin – Sabtu (09:00 - 20:00 WIB)',
    subtext: 'Waktu Indonesia Barat (UTC+7)',
  },
];

const workflowSteps = [
  {
    step: '01',
    title: 'Diskusi Kebutuhan',
    desc: 'Membahas ide, tujuan, serta ekspektasi proyek melalui pesan atau panggilan singkat.',
  },
  {
    step: '02',
    title: 'Scope & Estimasi',
    desc: 'Menyusun alur kerja, spesifikasi teknis/kreatif, timeline, dan rencana estimasi biaya.',
  },
  {
    step: '03',
    title: 'Eksekusi & Iterasi',
    desc: 'Proses pengerjaan dilakukan secara terukur dengan progres berkala hingga rilis final.',
  },
];

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com/ivander_dzaky', icon: InstagramIcon },
  { label: 'GitHub', href: 'https://github.com/IvanderDzaky', icon: GitHubIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/ivanderdzaky', icon: LinkedInIcon },
];

const ContactPage: FC = () => {
  return (
    <main className="min-h-screen bg-[#0b0f11] text-[#e0e2e6]">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-28">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-[#fe7f2d]/10 blur-[120px]" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-[#afcade]/10 blur-[120px]" />
        <div className="relative z-10 mx-auto max-w-300 space-y-5 text-center">
          <span className="block text-[14px] uppercase tracking-[0.35em] text-[#fe7f2d] font-label">
            Kontak
          </span>
          <h1 className="mx-auto max-w-4xl text-3xl font-bold leading-tight text-white font-headline md:text-5xl lg:text-[56px]">
            Mari Terhubung
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-7 text-[#c8c7c4] md:text-lg">
            Sampaikan ide atau kebutuhan Anda melalui form kontak. Saya akan menghubungi Anda
            melalui email.
          </p>
        </div>
      </section>

      {/* Main Content Grid: Direct Contacts + Contact Form */}
      <section className="px-6 pb-28">
        <div className="mx-auto grid max-w-300 gap-8 lg:grid-cols-12">
          {/* Left Column: Direct Info */}
          <div className="flex h-full flex-col gap-8 lg:col-span-5">
            {/* Direct Cards */}
            <div className="flex-1 space-y-4 rounded-3xl border border-white/10 bg-[#111419] p-8">
              <div className="space-y-4">
                {contactDirectItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-white/5 bg-[#111419]/50 p-5 flex items-start gap-4 transition-colors hover:border-white/10"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fe7f2d]/10 text-[#fe7f2d]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 overflow-hidden">
                        <p className="text-xs font-medium text-[#9e9d9a]">{item.title}</p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="block font-semibold text-white hover:text-[#fe7f2d] transition-colors truncate text-sm sm:text-base"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="font-semibold text-white text-sm sm:text-base">
                            {item.value}
                          </p>
                        )}
                        <p className="text-xs text-[#c8c7c4]">{item.subtext}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Social Links */}
            <div className="rounded-3xl border border-white/10 bg-[#111419] p-8 space-y-3">
              <h3 className="text-sm font-bold font-headline text-white">Media Sosial & Profil</h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {socialLinks.map((soc) => (
                  <a
                    key={soc.label}
                    href={soc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={soc.label}
                    title={soc.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#c8c7c4] transition-all hover:border-[#fe7f2d]/30 hover:bg-[#fe7f2d]/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fe7f2d]"
                  >
                    <soc.icon />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
