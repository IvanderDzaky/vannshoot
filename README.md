## Next.js Template (Tailwind CSS, ESLint, Prettier)

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/nuflakbrr/create-bikinproject-app/blob/v2/assets/BikinProject.jpg?raw=true">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/nuflakbrr/create-bikinproject-app/blob/v2/assets/BikinProject.jpg?raw=true">
    <img alt="Banner BikinProject" src="https://github.com/nuflakbrr/create-bikinproject-app/blob/v2/assets/BikinProject.jpg?raw=true">
  </picture>
</p>

<p align="center">
  <a href="https://badge.fury.io/js/create-bikinproject-app.svg">
    <img src="https://badge.fury.io/js/create-bikinproject-app.svg" alt="NPM Verion">
  </a>
  <a href="https://www.npmjs.com/package/create-bikinproject-app">
    <img src="https://img.shields.io/npm/dt/create-bikinproject-app" alt="NPM Downloads">
  </a>
  <a href="https://www.npmjs.com/package/create-bikinproject-app">
    <img src="https://img.shields.io/npm/l/create-bikinproject-app" alt="NPM License">
  </a>
</p>

Ini adalah proyek [Next.js](https://nextjs.org/) di-bootstrap dengan [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app), di-generate menggunakan [**BikinProject**](https://nuflakbrr.github.io/bikinproject).

## Teknologi Yang Digunakan

- [Next.js (App Router)](https://nextjs.org/)
- [React](https://react.dev/)
- [TailwindCSS v4](https://tailwindcss.com/)
- [Prisma ORM](https://www.prisma.io/)
- [Better Auth](https://better-auth.com/)
- [TanStack Query & Table](https://tanstack.com/)
- [Zod & React Hook Form](https://zod.dev/)

## Fitur

Fitur yang terdapat pada templat proyek ini adalah:

- **Proyek Arsitektur**: Pemisahan komponen yang jelas menggunakan pola `Common` dan `Mixins` di root client-facing, serta folder modular CMS sesuai aturan PBAC.
- **Modern Stack**: Menggunakan versi terbaru dari Next.js 16 (React 19) dan Tailwind CSS v4.
- **Turbopack Build**: Pengalaman pengembangan yang sangat cepat dengan turbopack.
- **Custom Hooks**: Kumpulan hooks yang berguna seperti `useDebounce`, `usePagination`, dan `useSort`.
- **Tema Gelap/Terang**: Dukungan `next-themes` secara bawaan.
- **Master Data YouTube Links**: Manajemen data master tautan YouTube dengan modal preview terintegrasi.
- **Otorisasi PBAC (Permission-Based Access Control)**: Keamanan bertingkat di proxy, actions, dan UI guards.
- **Dinamis & Skalabel UI**: Komponen *carousel* pintar dengan navigasi fraksional otomatis serta pengelompokan portofolio dinamis berdasarkan kota.

### Proyek Arsitektur

Terdapat beberapa poin penting terkait bagaimana menjalankan proyek arsitektur yang benar.

```
/
├── public/              # Aset statis (gambar, font, dll) dan uploads
├── src/
│   ├── app/             # Next.js App Router (Halaman & API)
│   │   ├── api/         # Endpoint API (route.ts)
│   │   ├── (auth)/      # Rute grup untuk autentikasi (login)
│   │   ├── (cms)/       # Rute grup untuk cms (/admin)
│   │   ├── (root)/      # Rute grup untuk halaman utama publik
│   │   └── layout.tsx   # Layout utama aplikasi
│   ├── components/      # Komponen UI
│   │   ├── Common/      # Komponen atomik/kecil
│   │   ├── Mixins/      # Komponen kompleks (gabungan Common)
│   │   └── ui/          # Komponen UI yang sudah jadi dan siap pakai (Shadcn)
│   ├── data/            # Data statis & Metadata
│   ├── hooks/           # Custom React Hooks
│   ├── interfaces/      # TypeScript Interfaces
│   ├── lib/             # Utilitas & Library helper (Better Auth, Prisma Client)
│   ├── providers/       # Wrapper providers untuk layout (Theme, Permission, Query)
│   ├── proxy.ts         # Next.js 16 Proxy Router Protection
│   ├── schemas/         # Skema validasi Zod
│   └── services/        # Server Actions & Otorisasi Server
├── eslint.config.mjs    # Konfigurasi ESLint terbaru
├── tsconfig.json        # Konfigurasi TypeScript path aliases
├── next.config.ts       # Konfigurasi Next.js (TypeScript)
├── package.json         # Dependensi & Scripts
├── tailwind.config.ts   # Konfigurasi Tailwind CSS
└── README.md
```

#### Komponen UI

- **Folder Common**: Berisi komponen-komponen atomik seperti tombol, icon, atau elemen UI dasar lainnya yang dapat digunakan kembali.
- **Folder Mixins**: Berisi komponen-komponen yang lebih besar dan kompleks yang merupakan gabungan dari beberapa komponen `Common`, seperti Navbar atau Footer.
- **Folder ui**: Berisi komponen-komponen UI yang sudah jadi dan siap pakai (Shadcn).

### Custom React Hooks

Terdapat beberapa hooks yang sudah disediakan untuk mempercepat pengembangan:

- `useDebounce`: Untuk menangani input yang memerlukan penundaan aksi.
- `usePagination`: Untuk menangani navigasi halaman melalui query params.
- `useSort`: Untuk menangani logika pengurutan data.

## Mulai Sekarang

Cara memulai pengembangan:

1. **Instal Dependensi**:
   ```bash
   pnpm install
   ```

2. **Konfigurasi Environment**:
   Salin file `.env.example` menjadi `.env` dan sesuaikan URL database PostgreSQL dan secret keys.
   ```bash
   cp .env.example .env
   ```

3. **Migrasi Database & Seeding**:
   Jalankan migrasi Prisma dan data seeding awal.
   ```bash
   pnpm prisma migrate dev
   pnpm prisma db seed
   ```

4. **Jalankan Server Lokal**:
   Jalankan Next.js development server dengan Turbopack.
   ```bash
   pnpm dev
   ```

5. **Akses Aplikasi**:
   Buka [http://localhost:3000](http://localhost:3000) pada browser Anda untuk halaman utama publik, atau [http://localhost:3000/admin](http://localhost:3000/admin) untuk panel CMS (Login: `admin@gmail.com`).

6. **Versioning & Release (SemVer)**:
   * **Memulai Fase Dev**: `pnpm version:minor -- --dev` (membuat tag `-dev.0`).
   * **Menaikkan Versi Dev**: `pnpm version:patch` (menaikkan angka dev counter).
   * **Merilis ke Produksi**: `node scripts/increment-version.cjs release` (membuang tag `-dev.X`).


## API Route

API Route dapat diakses melalui `http://localhost:3000/api`. Endpoint ini dikelola di dalam `src/app/api/`.

## Author

- Naufal Akbar Nugroho ([@nuflakbrr](https://github.com/nuflakbrr))