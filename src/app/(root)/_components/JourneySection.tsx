const journeyContent = {
  breadcrumb: "Perjalanan",
  heading: "Perjalanan Saya",
  timeline: [
    {
      date: '2023',
      title: 'Memulai Studi Informatika di Telkom University',
      description:
        'Memulai perjalanan di bidang Informatika dengan mempelajari dasar-dasar pemrograman, pengembangan perangkat lunak, dan teknologi digital.',
      active: false,
    },
    {
      date: '2024',
      title: 'Mendalami Web Development dan Fotografi',
      description:
        'Mulai berfokus pada pengembangan web, khususnya frontend, sekaligus mengembangkan kemampuan fotografi melalui berbagai kegiatan dan pengalaman.',
      active: false,
    },
    {
      date: '2025',
      title: 'Mengembangkan Proyek dan Pengalaman',
      description:
        'Mengerjakan berbagai proyek pengembangan web untuk memperkuat kemampuan teknis, sekaligus terus mengembangkan pengalaman dalam fotografi, mulai dari potret hingga dokumentasi berbagai kegiatan.',
      active: false,
    },
    {
      date: 'Sekarang',
      title: 'Terus Belajar dan Berkembang',
      description:
        'Terus memperdalam kemampuan di bidang web development, mengeksplorasi teknologi baru, serta mengembangkan kreativitas melalui fotografi dan berbagai proyek yang dikerjakan.',
      active: true,
    },
  ]
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
          <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl font-headline">{heading}</h2>
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
                <p className="mt-1 max-w-2xl text-sm text-[#c8c7c4] leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
