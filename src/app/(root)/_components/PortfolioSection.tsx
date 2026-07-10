export default function PortfolioSection() {
  return (
    <section id="portfolio" className="py-22">
      <div className="mx-auto max-w-330 px-6">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="block text-sm uppercase tracking-[0.35em] text-[#fe7f2d]">
              Portfolio
            </span>
            <h2 className="mt-4 text-4xl font-bold text-white font-headline">Selected Works</h2>
          </div>
          <a
            className="inline-flex items-center gap-2 text-sm text-[#c8c7c4] transition hover:text-[#fe7f2d]"
            href="#"
          >
            View All Projects
            <span className="material-symbols-outlined">arrow_right_alt</span>
          </a>
        </div>
        <div className="grid gap-10 md:grid-cols-2">
          {[
            {
              title: 'Modern Portfolio Website',
              description:
                'A polished personal website built with a premium and minimal visual identity.',
              tags: ['Next.js', 'TypeScript', 'Tailwind'],
              image: 'https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg',
            },
            {
              title: 'Finance Dashboard',
              description: 'A clean analytics dashboard focused on clarity, speed, and usability.',
              tags: ['React', 'Chart.js', 'UI/UX'],
              image: 'https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg',
            },
            {
              title: 'SaaS Admin Dashboard',
              description:
                'An internal admin experience designed for manageability and modern workflows.',
              tags: ['Next.js', 'Prisma', 'Tailwind'],
              image: 'https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg',
            },
            {
              title: 'Creative Agency Landing Page',
              description: 'A visually strong landing page crafted for a modern creative studio.',
              tags: ['React', 'Framer Motion', 'CSS'],
              image: 'https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg',
            },
            {
              title: 'AI Image Gallery',
              description:
                'An interactive gallery experience featuring image discovery and modern layouts.',
              tags: ['Next.js', 'AI API', 'Tailwind'],
              image: 'https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg',
            },
            {
              title: 'Productivity App',
              description:
                'A sleek productivity app designed to simplify daily planning and focus.',
              tags: ['React', 'TypeScript', 'State Management'],
              image: 'https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg',
            },
          ].map((project) => (
            <div key={project.title} className="group cursor-pointer">
              <div className="relative mb-6 overflow-hidden rounded-3xl border border-white/5 bg-[#111419] aspect-video">
                <div className="absolute inset-0 flex items-center justify-center gap-4 bg-[#fe7f2d]/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <button className="rounded-full bg-white p-4 text-black transition-transform hover:scale-110">
                    <span className="material-symbols-outlined">visibility</span>
                  </button>
                  <button className="rounded-full bg-white p-4 text-black transition-transform hover:scale-110">
                    <span className="material-symbols-outlined">code</span>
                  </button>
                </div>
                <img
                  loading="lazy"
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-2">{project.title}</h3>
                  <p className="mb-3 text-sm leading-relaxed text-[#c8c7c4]">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.25em] text-[#c8c7c4]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
