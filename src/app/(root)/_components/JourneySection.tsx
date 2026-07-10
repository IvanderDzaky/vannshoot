export default function JourneySection() {
  return (
    <section className="py-22 bg-[#121619]">
      <div className="mx-auto max-w-330 px-6">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <span className="block text-sm uppercase tracking-[0.35em] text-[#fe7f2d]">
            Evolution
          </span>
          <h2 className="mt-4 text-4xl font-bold text-white font-headline">My Journey</h2>
        </div>
        <div className="space-y-12">
          {[
            {
              date: '2023',
              title: 'Started studying Informatics at Telkom University',
              description:
                'Built the foundation for a career that connects technology, design, and visual storytelling.',
              active: false,
            },
            {
              date: '2024',
              title: 'Focused on frontend development and photography',
              description:
                'Spent more time crafting modern interfaces while growing VannShoot as a creative photography brand.',
              active: false,
            },
            {
              date: '2025',
              title: 'Built personal projects and expanded VannShoot',
              description:
                'Developed practical web projects and created more photography work for portraits, graduation, and events.',
              active: false,
            },
            {
              date: 'Present',
              title: 'Continuously learning and creating digital experiences',
              description:
                'Keeping up with modern web technologies while creating interfaces and visuals that feel thoughtful and refined.',
              active: true,
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-8">
              <div className="flex flex-col items-center">
                <div
                  className={`h-4 w-4 rounded-full ${item.active ? 'bg-[#fe7f2d] shadow-lg shadow-[#fe7f2d]/30' : 'bg-white/20'}`}
                />
                <div className="my-4 h-full w-px bg-white/10" />
              </div>
              <div className="pb-8">
                <span className="block text-sm font-bold uppercase tracking-[0.3em] text-[#fe7f2d]">
                  {item.date}
                </span>
                <h3 className="mt-2 text-2xl font-bold text-white">{item.title}</h3>
                <p className="mt-2 max-w-2xl text-[#c8c7c4] leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
