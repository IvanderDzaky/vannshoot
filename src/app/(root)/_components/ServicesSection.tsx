import { TerminalIcon, CameraIcon, ClapperboardIcon } from 'lucide-react';

const servicesContent = {
  breadcrumb: 'Keahlian',
  heading: 'Apa Saya Lakukan',
  services: [
    {
      title: 'Pengembangan Web',
      description:
        'Membangun aplikasi web responsif, skalabel, dan modern menggunakan React, Next.js, TypeScript, dan Tailwind CSS.',
      icon: TerminalIcon,
    },
    {
      title: 'Fotografi',
      description:
        'Menciptakan portret, sesesi wisuda, dan acara dengan gaya visual yang bersih, sinematik, dan abadi.',
      icon: CameraIcon,
    },
    {
      title: 'Konten Digital',
      description:
        'Membuat konten digital yang menarik, mulai dari storytelling visual hingga aset media sosial dan produksi kreatif pendek.',
      icon: ClapperboardIcon,
    },
  ],
};

const breadcrumb = servicesContent.breadcrumb;
const heading = servicesContent.heading;
const services = servicesContent.services;

export default function ServicesSection() {
  return (
    <section id="services" className="bg-[#121619] py-12 md:py-16">
      <div className="mx-auto max-w-330 px-6">
        <div className="mb-10 max-w-2xl">
          <span className="block text-sm uppercase tracking-[0.35em] text-[#fe7f2d]">
            {breadcrumb}
          </span>

          <h2 className="mt-2 font-headline text-3xl font-bold text-white md:text-4xl">
            {heading}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="glass-panel rounded-3xl border border-white/5 p-6 sm:p-8 transition-all duration-300 hover:bg-white/5"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#fe7f2d]/10 text-[#fe7f2d]">
                <service.icon size={24} />
              </div>

              <h3 className="mb-3 text-xl font-semibold text-white">{service.title}</h3>

              <p className="text-sm leading-relaxed text-[#c8c7c4]">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
