import { TerminalIcon, Icon, CameraIcon, Gamepad2Icon } from 'lucide-react';

export default function ServicesSection() {
  return (
    <section id="services" className="py-22 bg-[#121619]">
      <div className="mx-auto max-w-330 px-6">
        <div className="mb-16 max-w-2xl">
          <span className="block text-sm uppercase tracking-[0.35em] text-[#fe7f2d]">
            Expertise
          </span>
          <h2 className="mt-4 text-4xl font-bold text-white font-headline">What I Do</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: 'Web Development',
              description:
                'I build responsive, accessible, and modern web applications with React, Next.js, TypeScript, and Tailwind CSS.',
              icon: TerminalIcon,
            },
            {
              title: 'Photography',
              description:
                'VannShoot is a creative photography service focused on portraits, graduation, and events with a natural, modern style.',
              icon: CameraIcon,
            },
            {
              title: 'Content Creator',
              description:
                'I design clean interfaces and digital experiences that balance usability, aesthetics, and clarity.',
              icon: Gamepad2Icon,
            },
          ].map((service) => (
            <div
              key={service.title}
              className="glass-panel rounded-[2rem] border border-white/5 p-10 transition-all duration-300 hover:bg-white/5"
            >
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fe7f2d]/10 text-[#fe7f2d]">
                <service.icon className="text-4xl" />
              </div>
              <h3 className="mb-4 text-2xl font-semibold text-white">{service.title}</h3>
              <p className="leading-relaxed text-[#c8c7c4]">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
