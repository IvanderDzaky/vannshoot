import Link from 'next/link';
import type { FC } from 'react';

import type { ErrorMetadata, ErrorStateProps, ErrorTheme } from '@/interfaces/error';

const ErrorState: FC<ErrorStateProps> = ({ code, error }) => {
  const getErrorContent = (statusCode: number) => {
    const is5xx = statusCode >= 500;

    const metadataMap: Record<number, ErrorMetadata> = {
      401: {
        titlePrefix: 'Sesi Anda',
        titleSuffix: 'Berakhir',
        description:
          'Maaf, sesi Anda telah berakhir atau Anda belum login. Silakan login kembali untuk melanjutkan.',
        badge: 'Error 401: Unauthorized',
        theme: 'amber',
      },
      403: {
        titlePrefix: 'Akses',
        titleSuffix: 'Dibatasi',
        description:
          'Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi administrator.',
        badge: 'Error 403: Forbidden',
        theme: 'amber',
      },
      404: {
        titlePrefix: 'Halaman Tidak',
        titleSuffix: 'Ditemukan',
        description:
          'Waduh! Sepertinya route yang Anda cari tidak ada atau sudah pindah ke tempat lain.',
        badge: 'Error 404: Not Found',
        theme: 'rose',
      },
      500: {
        titlePrefix: 'Terjadi Kesalahan',
        titleSuffix: 'Internal',
        description: 'Ups! Server kami sedang mengalami gangguan sejenak. Silakan coba lagi nanti.',
        badge: 'Error 500: Server Error',
        theme: 'amber',
      },
      503: {
        titlePrefix: 'Layanan Tidak',
        titleSuffix: 'Tersedia',
        description: 'Saat ini layanan sedang dalam pemeliharaan. Mohon tunggu beberapa saat lagi.',
        badge: 'Error 503: Service Unavailable',
        theme: 'emerald',
      },
    };

    const defaultContent: ErrorMetadata = is5xx
      ? {
          titlePrefix: 'Terjadi Kesalahan',
          titleSuffix: 'Server',
          description:
            'Server mengalami kendala yang tidak terduga. Mohon maaf atas ketidaknyamanan ini.',
          badge: `Error ${statusCode}: Server Exception`,
          theme: 'amber',
        }
      : {
          titlePrefix: 'Terjadi Kesalahan',
          titleSuffix: 'Klien',
          description: 'Permintaan Anda tidak dapat diproses oleh sistem kami.',
          badge: `Error ${statusCode}: Client Error`,
          theme: 'rose',
        };

    const content = metadataMap[statusCode] ?? defaultContent;

    const themes: Record<ErrorMetadata['theme'], ErrorTheme> = {
      amber: {
        badgeColor:
          'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400',
        pingColor: 'bg-amber-400',
        dotColor: 'bg-amber-600 dark:bg-amber-500',
        gradient: 'from-amber-600 to-yellow-400 dark:from-amber-400 dark:to-yellow-400',
        glowStart: 'bg-amber-600/10',
        glowEnd: 'bg-yellow-600/10',
        terminalIcon: 'bg-amber-500/40',
        borderType: 'text-amber-600 dark:text-amber-400',
        errorColor: 'text-amber-600 dark:text-amber-400',
      },
      rose: {
        badgeColor:
          'bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400',
        pingColor: 'bg-rose-400',
        dotColor: 'bg-rose-600 dark:bg-rose-500',
        gradient: 'from-rose-600 to-orange-400 dark:from-rose-400 dark:to-orange-400',
        glowStart: 'bg-rose-600/10',
        glowEnd: 'bg-orange-600/10',
        terminalIcon: 'bg-rose-500/40',
        borderType: 'text-rose-600 dark:text-rose-400',
        errorColor: 'text-rose-600 dark:text-rose-400',
      },
      emerald: {
        badgeColor:
          'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400',
        pingColor: 'bg-emerald-400',
        dotColor: 'bg-emerald-600 dark:bg-emerald-500',
        gradient: 'from-emerald-600 to-teal-400 dark:from-emerald-400 dark:to-teal-400',
        glowStart: 'bg-emerald-600/10',
        glowEnd: 'bg-teal-600/10',
        terminalIcon: 'bg-emerald-500/40',
        borderType: 'text-emerald-600 dark:text-emerald-400',
        errorColor: 'text-emerald-600 dark:text-emerald-400',
      },
    };

    return { ...content, ...themes[content.theme] };
  };

  const meta = getErrorContent(code);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-zinc-950 pt-32 pb-20">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div
          className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] ${meta.glowStart} blur-[120px] rounded-full`}
        />
        <div
          className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] ${meta.glowEnd} blur-[120px] rounded-full`}
        />
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-8 text-left">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-semibold shadow-sm ${meta.badgeColor}`}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${meta.pingColor}`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${meta.dotColor}`}
                ></span>
              </span>
              {meta.badge}
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-tight">
              {meta.titlePrefix} <br />
              <span
                className={`inline-block py-1 bg-clip-text text-transparent bg-linear-to-r ${meta.gradient}`}
              >
                {meta.titleSuffix}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-400 max-w-xl leading-relaxed font-medium">
              {meta.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link
                href="/"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>

          <div className="lg:w-1/2 w-full animate-float">
            <div className="w-full max-w-2xl mx-auto rounded-3xl overflow-hidden border-2 border-zinc-200 dark:border-zinc-800 shadow-2xl">
              <div className="bg-zinc-100 dark:bg-zinc-900 px-4 py-3 flex items-center gap-2 border-b-2 border-zinc-200 dark:border-zinc-800">
                <div className="flex gap-1.5">
                  <div className={`w-3.5 h-3.5 rounded-full ${meta.terminalIcon}`} />
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-500/40" />
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/40" />
                </div>
                <div className="mx-auto text-xs font-mono text-zinc-500 font-medium">
                  bash — system-error-{code}
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-950 p-6 font-mono text-sm leading-relaxed overflow-x-auto h-[350px]">
                <div className="space-y-2">
                  <p className="text-zinc-400">┌ checking system status...</p>
                  <p className="flex gap-3">
                    <span className={meta.borderType}>│</span>
                    <span className="text-zinc-800 dark:text-zinc-200">
                      ✖ Fatal Error: {meta.badge}
                    </span>
                  </p>
                  <p className="text-zinc-400">│</p>
                  <p className="flex gap-3">
                    <span className={meta.borderType}>│</span>
                    <span className="text-zinc-500">[stacktrace]</span>
                  </p>
                  {error ? (
                    <p className="flex gap-3 text-xs">
                      <span className={meta.borderType}>│</span>
                      <span className="text-rose-500 dark:text-rose-400">
                        Error: {error.name} - {error.message}
                      </span>
                    </p>
                  ) : (
                    <>
                      <p className="flex gap-3 text-xs">
                        <span className={meta.borderType}>│</span>
                        <span className="text-zinc-500">
                          at SystemHandler.resolve (internal/core.js:{code})
                        </span>
                      </p>
                      <p className="flex gap-3 text-xs">
                        <span className={meta.borderType}>│</span>
                        <span className="text-zinc-500">
                          at RequestPipeline.execute (internal/router.js:123)
                        </span>
                      </p>
                    </>
                  )}
                  <p className="text-zinc-400">│</p>
                  <p className="text-zinc-400 text-xs text-center">────────────────────────</p>
                  <p className={`${meta.errorColor} font-bold text-center`}>
                    {' '}
                    ⚠️ ERROR_CODE: {code}
                  </p>
                  <p className="text-zinc-400 text-xs text-center">────────────────────────</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ErrorState;
