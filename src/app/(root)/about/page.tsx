import { FC } from 'react';

import { genPageMetadata } from '@/app/seo';
import { siteMetadata } from '@/data/siteMetadata';

export const metadata = genPageMetadata({
  title: 'Tentang BikinProject',
  description:
    'Pelajari lebih lanjut tentang BikinProject, motivasi di baliknya, dan bagaimana alat ini dapat membantu Anda membangun proyek dengan lebih cepat.',
});

const About: FC = () => {
  return (
    <section className="flex items-center justify-center max-w-7xl mx-auto min-h-screen">
      <div className="container">
        <div className="flex flex-wrap">
          <div className="w-full px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="h-64 md:h-auto bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-lg shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1610465299996-30f240ac2b1c?auto=format&q=75&fit=crop&w=600&h=750"
                  loading="lazy"
                  alt="Laptop"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="md:pt-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-center md:text-left mb-4 md:mb-6">
                  Tentang BikinProject.
                </h1>

                <p className="sm:text-lg mb-6 md:mb-8 text-justify">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 p-1 px-2 rounded font-mono font-bold">
                    BikinProject
                  </span>{' '}
                  adalah sebuah CLI-based starter project generator yang dirancang untuk mempercepat
                  proses inisialisasi aplikasi dengan standar industri. Proyek ini mendukung
                  berbagai framework populer seperti Next.js, React, dan Laravel.
                </p>

                <p className="sm:text-lg mb-6 md:mb-8 text-justify">
                  Dibuatnya BikinProject berawal dari kebutuhan{' '}
                  <a
                    href={siteMetadata.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-bold underline transition duration-100"
                  >
                    Saya
                  </a>{' '}
                  akan standarisasi struktur proyek saat memulai development baru. Alih-alih
                  melakukan setup manual yang repetitif, BikinProject mengotomatisasi segalanya
                  mulai dari pemilihan bahasa, styling framework, hingga struktur folder terbaik.
                </p>

                <div className="sm:text-lg mb-6 md:mb-8 text-justify">
                  Hanya dengan satu perintah di terminal, Anda bisa langsung fokus membangun fitur
                  tanpa pusing dengan boilerplate:
                  <div className="mt-4 p-4 bg-zinc-900 rounded-xl font-mono text-sm text-emerald-400 border border-zinc-800">
                    $ npx bikinproject@latest
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
