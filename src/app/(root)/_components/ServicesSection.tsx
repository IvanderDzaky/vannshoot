import {
  TerminalIcon,
  CameraIcon,
  ClapperboardIcon,
} from 'lucide-react';

export default function ServicesSection() {
  const services = [
    {
      title: 'Web Development',
      description:
        'I develop responsive, scalable, and modern web applications using React, Next.js, TypeScript, and Tailwind CSS.',
      icon: TerminalIcon,
    },
    {
      title: 'Photography',
      description:
        'Through VannShoot, I capture portraits, graduation sessions, and events with a clean, cinematic, and timeless visual style.',
      icon: CameraIcon,
    },
    {
      title: 'Content Creation',
      description:
        'I create engaging digital content, from visual storytelling and social media assets to short-form creative productions.',
      icon: ClapperboardIcon,
    },
  ];

  return (
    <section id="services" className="bg-[#121619] py-22">
      <div className="mx-auto max-w-330 px-6">
        <div className="mb-16 max-w-2xl">
          <span className="block text-sm uppercase tracking-[0.35em] text-[#fe7f2d]">
            Expertise
          </span>

          <h2 className="mt-4 font-headline text-4xl font-bold text-white">
            What I Do
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="glass-panel rounded-[2rem] border border-white/5 p-10 transition-all duration-300 hover:bg-white/5"
            >
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fe7f2d]/10 text-[#fe7f2d]">
                <service.icon size={32} />
              </div>

              <h3 className="mb-4 text-2xl font-semibold text-white">
                {service.title}
              </h3>

              <p className="leading-relaxed text-[#c8c7c4]">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}