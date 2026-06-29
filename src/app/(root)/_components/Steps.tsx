'use client';
import { FC } from 'react';

const steps = [
  {
    number: '01',
    title: 'Jalankan Command',
    description:
      'Buka terminal favorit Anda dan jalankan "npx bikinproject@latest". Tidak perlu instalasi global yang memberatkan sistem.',
  },
  {
    number: '02',
    title: 'Pilih Konfigurasi',
    description:
      'Pilih framework (Next.js, React, Laravel), bahasa (TS/JS), dan CSS framework melalui antarmuka CLI yang interaktif.',
  },
  {
    number: '03',
    title: 'Project Siap!',
    description:
      'BikinProject akan men-generate starter project lengkap dengan best practices, siap untuk Anda kembangkan lebih lanjut.',
  },
];

const Steps: FC = () => {
  return (
    <section className="py-24 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-8">
            <h2 className="text-3xl md:text-5xl font-extrabold text-zinc-950 dark:text-white leading-tight">
              Langkah Sederhana <br /> Untuk Project Terpercaya
            </h2>
            <p className="text-lg text-zinc-700 dark:text-zinc-400 font-medium tracking-tight">
              Kami menyederhanakan proses kompleks menjadi langkah-langkah yang mudah dipahami,
              memastikan Anda selalu terlibat dalam setiap progres.
            </p>
            <div className="pt-4">
              <button className="px-8 py-4 bg-zinc-950 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-2xl hover:scale-105 transition-transform duration-300 shadow-lg shadow-zinc-500/10">
                Mulai Konsultasi
              </button>
            </div>
          </div>

          <div className="lg:w-1/2 w-full space-y-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-start gap-6 p-6 rounded-3xl border-2 border-transparent hover:border-zinc-100 dark:hover:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all duration-300 group"
              >
                <div className="text-4xl font-black text-blue-600/20 dark:text-blue-500/20 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors duration-300 shrink-0">
                  {step.number}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-zinc-950 dark:text-white">{step.title}</h3>
                  <p className="text-zinc-700 dark:text-zinc-400 leading-relaxed font-medium text-justify">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Steps;
