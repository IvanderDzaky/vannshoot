import type { Route } from 'next';
import Link from 'next/link';

const heroContent = {
  badge: 'Frontend Developer',
  title: 'Ivander',
  titleHighlight: 'Dzaky Khairullah',
  description:
    'Halo, saya Ivan — mahasiswa Informatika Telkom University Bandung yang tertarik pada pengembangan web dan fotografi. Saya suka mengubah ide menjadi pengalaman digital yang simpel, nyaman digunakan, dan punya karakter. Di luar coding, saya juga mengabadikan berbagai cerita melalui VannShoot.',
  cta: 'Lihat Portofolio',
  projectName: 'VANNSHOOT',
  role: 'Frontend',
};

const badge = heroContent.badge;
const title = heroContent.title;
const titleHighlight = heroContent.titleHighlight;
const description = heroContent.description;
const cta = heroContent.cta;
const projectName = heroContent.projectName;
const role = heroContent.role;

export default function HeroSection() {
  return (
    <section id="home" className="relative pt-28">
      <div className="mx-auto grid max-w-330 gap-12 px-6 py-6 md:py-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#fe7f2d]/30 bg-[#fe7f2d]/10 px-4 py-1.5 text-sm font-bold uppercase tracking-[0.3em] text-[#fe7f2d]">
            {badge}
          </div>
          <h1 className="max-w-3xl text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white font-headline">
            {title}
            <br />
            <span className="text-[#fe7f2d]">{titleHighlight}</span>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-[#d8d7d4] md:text-lg">
            {description}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={'/portfolio' as Route}
              className="magnetic-button rounded-xl bg-[#fe7f2d] px-8 py-3.5 text-sm md:text-base text-[#331100] font-semibold shadow-xl shadow-[#fe7f2d]/20 transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
            >
              {cta}
            </Link>
          </div>
        </div>

        <div className="relative group z-0">
          <div className="relative z-0 aspect-5/6 overflow-hidden rounded-[2.5rem] border border-white/10 orange-glow transition-all duration-500">
            <img
              loading="lazy"
              src="/assets/img/IvanderDzaky.JPEG"
              alt="Portfolio showcase"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="absolute -top-10 -right-10 hidden rounded-2xl border border-white/10 bg-[#111419]/75 p-6 shadow-2xl shadow-black/40 animate-bounce-slow md:block z-20 pointer-events-none">
            <p className="font-label text-xs uppercase tracking-[0.3em] text-[#fe7f2d]">{role}</p>
            <p className="mt-1 text-sm font-semibold text-white">{role.toLowerCase()}</p>
          </div>
          <div
            className="absolute bottom-10 -left-10 hidden rounded-2xl border border-white/10 bg-[#111419]/75 p-6 shadow-2xl shadow-black/40 animate-bounce-slow md:block z-20 pointer-events-none"
            style={{ animationDelay: '1s' }}
          >
            <p className="font-label text-xs uppercase tracking-[0.3em] text-[#fe7f2d]">
              Fotografi
            </p>
            <p className="mt-1 text-sm font-semibold text-white">{projectName}</p>
          </div>
          {/* <div
            className="absolute bottom-40 -right-4 hidden rounded-xl border border-white/10 bg-[#111419]/75 p-4 shadow-2xl shadow-black/40 md:block z-20 pointer-events-none"
            style={{ animationDelay: '1.5s' }}
          >
            <span className="material-symbols-outlined text-[#fe7f2d]">photo_camera</span>
          </div> */}
        </div>
      </div>
    </section>
  );
}
