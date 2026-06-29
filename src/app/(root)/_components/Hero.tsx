'use client';
import Link from 'next/link';
import { FC } from 'react';

const Hero: FC = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-zinc-950 pt-32 pb-20">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 dark:bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 dark:bg-cyan-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Side: Content */}
          <div className="lg:w-1/2 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-sm font-semibold shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-blue-500"></span>
              </span>
              CLI-Based Project Generator
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-tight">
              Bikin Project Jadi <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-600 dark:from-blue-500 dark:to-cyan-400">
                Lebih Sat-Set & Terstruktur
              </span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-400 max-w-xl leading-relaxed font-medium">
              Generator starter project yang didesain untuk kenyamanan developer. Lupakan setup
              manual, cukup satu perintah dan project Anda siap tempur.
            </p>

            <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 font-mono text-sm md:text-base flex items-center justify-between group">
              <span className="text-zinc-800 dark:text-zinc-200">
                <span className="text-blue-600 dark:text-blue-400">$</span> npx bikinproject@latest
              </span>
              <button
                onClick={() => navigator.clipboard.writeText('npx bikinproject@latest')}
                className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500 hover:text-blue-600"
                title="Copy to clipboard"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link
                href="/auth/register"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Coba Sekarang
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-300"
              >
                Lihat Fitur
              </Link>
            </div>
          </div>

          {/* Right Side: Terminal Mock-up */}
          <div className="lg:w-1/2 w-full animate-float">
            <div className="w-full max-w-2xl mx-auto rounded-3xl overflow-hidden border-2 border-zinc-200 dark:border-zinc-800 shadow-2xl">
              <div className="bg-zinc-100 dark:bg-zinc-900 px-4 py-3 flex items-center gap-2 border-b-2 border-zinc-200 dark:border-zinc-800">
                <div className="flex gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-rose-500/40" />
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-500/40" />
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/40" />
                </div>
                <div className="mx-auto text-xs font-mono text-zinc-500 font-medium">
                  bash — create-bikinproject-app
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-950 p-6 font-mono text-sm leading-relaxed overflow-x-auto h-[400px]">
                <div className="space-y-2">
                  <p className="text-zinc-400">┌ create-bikinproject-app</p>
                  <p className="flex gap-3">
                    <span className="text-cyan-600 dark:text-cyan-400">│</span>
                    <span className="text-zinc-800 dark:text-zinc-200">
                      ◇ Where should we create your project?
                    </span>
                  </p>
                  <p className="flex gap-3">
                    <span className="text-cyan-600 dark:text-cyan-400">│</span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-bold underline">
                      ./your-project
                    </span>
                  </p>
                  <p className="text-zinc-400">│</p>
                  <p className="flex gap-3">
                    <span className="text-cyan-600 dark:text-cyan-400">│</span>
                    <span className="text-zinc-800 dark:text-zinc-200">◇ Pick a project type</span>
                  </p>
                  <p className="flex gap-3">
                    <span className="text-cyan-600 dark:text-cyan-400">│</span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                      ● Next.js App Router (Tailwind + TypeScript)
                    </span>
                  </p>
                  <p className="flex gap-3 pl-6">
                    <span className="text-zinc-500">○ React.js (Tailwind + JavaScript)</span>
                  </p>
                  <p className="flex gap-3 pl-6">
                    <span className="text-zinc-500">○ Laravel Breeze API w/ Next.js</span>
                  </p>
                  <p className="text-zinc-400">│</p>
                  <p className="flex gap-3">
                    <span className="text-cyan-600 dark:text-cyan-400">│</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      ⏳ Creating project...
                    </span>
                  </p>
                  <p className="flex gap-3">
                    <span className="text-cyan-600 dark:text-cyan-400">│</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      ✅ Project created successfully!
                    </span>
                  </p>
                  <p className="text-zinc-400">│</p>
                  <p className="text-zinc-400 text-xs">────────────────────────╮</p>
                  <p className="text-blue-600 dark:text-blue-400 font-bold">
                    {' '}
                    🎉 Project ready to use!
                  </p>
                  <p className="text-zinc-400 text-xs">────────────────────────╯</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
