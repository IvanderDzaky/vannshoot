'use client';
import type { FC } from 'react';

const features = [
  {
    title: 'Zero Config',
    description:
      'Lupakan setup yang rumit. Mulai project Anda dalam hitungan detik dengan konfigurasi yang sudah dioptimalkan.',
    icon: '⚙️',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    title: 'Interactive CLI',
    description:
      'Antarmuka baris perintah yang interaktif dan intuitif, memudahkan Anda memilih opsi project.',
    icon: '💻',
    color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  },
  {
    title: 'Multi-framework',
    description:
      'Mendukung berbagai framework populer seperti Next.js, React, Laravel, dan akan terus bertambah.',
    icon: '📚',
    color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  },
  {
    title: 'Standardisasi Kode',
    description:
      'Setiap project dihasilkan dengan struktur folder dan standar kode terbaik yang konsisten.',
    icon: '🛠️',
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  {
    title: 'Developer Experience',
    description:
      'Dibuat dengan fokus utama pada kenyamanan developer untuk produktivitas maksimal.',
    icon: '✨',
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  {
    title: 'Open Source',
    description:
      'Didukung oleh komunitas dan bebas untuk dikustomisasi sesuai kebutuhan spesifik Anda.',
    icon: '🌐',
    color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  },
];

const Features: FC = () => {
  return (
    <section id="features" className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-zinc-950 dark:text-white">
            Fitur Unggulan Kami
          </h2>
          <p className="text-lg text-zinc-700 dark:text-zinc-400 font-medium tracking-tight">
            Segala yang Anda butuhkan untuk membangun project modern dalam satu platform yang
            terintegrasi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 bg-white dark:bg-zinc-950 rounded-3xl border-2 border-zinc-100 dark:border-zinc-800 hover:border-blue-600 dark:hover:border-blue-500 transition-all duration-300 group hover:shadow-2xl hover:shadow-blue-500/10"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 ${feature.color} border border-transparent group-hover:border-current transition-all duration-300 group-hover:scale-110 shadow-sm`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-zinc-950 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-zinc-700 dark:text-zinc-400 leading-relaxed font-medium">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
