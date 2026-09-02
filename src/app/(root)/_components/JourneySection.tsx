const journeyContent = {
  breadcrumb: 'Perjalanan',
  heading: 'Perjalanan Saya',
  timeline: [
    {
      date: '2023',
      title: 'Memulai Studi Informatika di Telkom University',
      description:
        'Memulai perjalanan di bidang Informatika dengan mempelajari dasar pemrograman, pengembangan perangkat lunak, dan berbagai konsep dasar teknologi.',
      active: false,
    },
    {
      date: '2024',
      title: 'Mulai Fokus pada Web Development dan Fotografi',
      description:
        'Mulai mendalami pengembangan web, terutama di sisi frontend, sekaligus mengembangkan kemampuan fotografi melalui berbagai kegiatan dan pengalaman.',
      active: false,
    },
    {
      date: '2025',
      title: 'Berkembang ke Full-Stack Web Development',
      description:
        'Mulai mengembangkan aplikasi web secara lebih menyeluruh, tidak hanya dari sisi frontend, tetapi juga backend, API, autentikasi, dan pengelolaan database. Di saat yang sama, terus mengembangkan kemampuan fotografi melalui berbagai sesi dan dokumentasi kegiatan.',
      active: false,
    },
    {
      date: 'Sekarang',
      title: 'Memperdalam Full-Stack Development',
      description:
        'Terus mengembangkan kemampuan sebagai full-stack web developer dengan mengeksplorasi teknologi dan pendekatan baru dalam membangun aplikasi web. Fotografi juga tetap menjadi bagian dari perjalanan kreatif melalui VannShoot.',
      active: true,
    },
  ],
};

const breadcrumb = journeyContent.breadcrumb;
const heading = journeyContent.heading;
const timeline = journeyContent.timeline;

export default function JourneySection() {
  return (
    <section className="py-12 md:py-16 bg-[#121619]">
      <div className="mx-auto max-w-330 px-6">
        <div className="mx-auto mb-10 max-w-4xl text-center">
          <span className="block text-sm uppercase tracking-[0.35em] text-[#fe7f2d]">
            {breadcrumb}
          </span>
          <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl font-headline">
            {heading}
          </h2>
        </div>
        <div className="space-y-8">
          {timeline.map((item) => (
            <div key={item.title} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div
                  className={`h-3.5 w-3.5 rounded-full ${item.active ? 'bg-[#fe7f2d] shadow-lg shadow-[#fe7f2d]/30' : 'bg-white/20'}`}
                />
                <div className="my-3 h-full w-px bg-white/10" />
              </div>
              <div className="pb-6">
                <span className="block text-xs font-bold uppercase tracking-[0.3em] text-[#fe7f2d]">
                  {item.date}
                </span>
                <h3 className="mt-1 text-lg sm:text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-1 max-w-2xl text-sm text-[#c8c7c4] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
