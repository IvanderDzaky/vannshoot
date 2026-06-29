# Cetak Biru Arsitektur & Panduan Dokumentasi Fitur - Vannshoot CMS

Dokumen ini berfungsi sebagai peta navigasi utama dan pedoman pengembangan untuk programmer dan AI Agent dalam memahami arsitektur, tech stack, alur kerja pengembangan, serta struktur fitur di proyek **Vannshoot CMS**.

Dokumentasi detail untuk setiap fitur spesifik disimpan dalam folder [docs/features/](docs/features/).

---

## 1. Teknologi Stack (Tech Stack)

Aplikasi dibangun menggunakan arsitektur modern Next.js Fullstack dengan teknologi pendukung berikut:

* **Core Framework**: [Next.js 16.2.6](https://nextjs.org/) (App Router) dengan dukungan **React 19** dan **Turbopack** untuk performa kompilasi instan.
* **Database & ORM**: [Prisma ORM 7.8.0](https://www.prisma.io/) dengan database **PostgreSQL** (`@prisma/adapter-pg` dan driver `pg` untuk pooling koneksi native).
* **Authentication**: [Better Auth 1.6.9](https://better-auth.com/) untuk alur login, session management, pembatasan sesi "hantu" berbasis waktu, serta penutupan registrasi mandiri bagi publik.
* **Styling & UI**: 
  * [Tailwind CSS v4](https://tailwindcss.com/) dengan `@tailwindcss/postcss` untuk pemrosesan CSS modern super cepat.
  * [Shadcn UI](https://ui.shadcn.com/) dan `@radix-ui` untuk fondasi komponen UI yang aksesibel.
  * `@base-ui/react` untuk headless components tambahan.
  * `lucide-react` sebagai library ikon standar.
* **State Management & Data Querying**: [TanStack React Query v5](https://tanstack.com/query/latest) untuk sinkronisasi state client-server secara asinkron.
* **Form Handling & Validation**: [React Hook Form v7](https://react-hook-form.com/) terintegrasi dengan [Zod v4](https://zod.dev/) untuk type-safe validation resolver.
* **Media & File Processing**: [Sharp 0.34.5](https://sharp.pixelplumbing.com/) untuk konversi gambar otomatis ke WebP di server, serta trash & automatic cleanup system.

---

## 2. Arsitektur Proyek (Project Architecture)

Aplikasi diatur berdasarkan pola modular dan *Route Groups* Next.js:

```text
src/
├── app/                      # Next.js App Router Pages & Layouts
│   ├── (auth)/               # Rute Otentikasi (contoh: /login)
│   ├── (cms)/                # Panel Admin (CMS) berkedudukan di /admin
│   │   └── admin/            # Sub-modul CMS utama (master, services, publications, managements)
│   └── (root)/               # Halaman Publik / Client-facing (home, about, portfolio, clients, testimony)
├── components/               # Komponen Reusable global (UI, Mixins, dsb)
│   └── Mixins/Sidebar/       # Termasuk UserSettingsModal.tsx (modal ganti profil & kata sandi diri sendiri)
├── hooks/                    # Custom React Hooks
├── interfaces/               # Tipe Kontrak TypeScript (Fitur-fitur)
├── lib/                      # Inisialisasi Library (Prisma Client, Better Auth, db)
├── providers/                # Provider Global (Permission, Theme, Query Client)
├── proxy.ts                  # Next.js 16 Router Proxy untuk Route Protection
├── schemas/                  # Skema Validasi Zod (Fitur-fitur)
├── services/                 # Server Actions untuk operasi database & Security logic
│   └── profile.ts            # Server Action update email & profil untuk user yang sedang login
└── types/                    # Augmentasi Type TypeScript global
```

### Keamanan & Otorisasi
1. **Route Protection (Proxy Level)**: Rute `/admin/*` diproteksi secara dinamis oleh [src/proxy.ts](src/proxy.ts). Proxy memvalidasi cookie sesi Better Auth secara internal, melakukan pengecekan hak akses `admin.access`, dan secara ketat membandingkan expiry date `expiresAt` sesi terhadap waktu lokal saat ini.
2. **Action Protection (Server Level)**: Setiap Server Action di dalam `src/services/` dilindungi menggunakan helper `verifyPermission('feature.action')` dari [src/services/security.ts](src/services/security.ts).
3. **UI Guard (Client Level)**: Tombol aksi, opsi dropdown, dan tautan navigasi disembunyikan/dinonaktifkan secara dinamis di sisi klien menggunakan hook `usePermission()` dari [src/providers/PermissionProvider.tsx](src/providers/PermissionProvider.tsx).

---

## 3. Alur Kerja Pengembangan Fitur Baru (Step-by-Step Feature Workflow)

Jika Anda ditugaskan untuk menambahkan atau memodifikasi fitur di proyek ini, ikuti alur kerja sistematis berikut:

### Langkah 1: Pembuatan Model Database & Seeding
1. Definisikan tabel baru Anda di [prisma/schema.prisma](prisma/schema.prisma). Gunakan penamaan tabel snake_case melalui direktif `@@map`.
2. Generate Prisma client dan jalankan migrasi database:
   ```bash
   pnpm prisma migrate dev --name nama_migrasi
   ```
3. Daftarkan hak akses (permissions) baru yang dibutuhkan modul di [prisma/seed.ts](prisma/seed.ts) dan hubungkan ke role default `superadmin` / `admin`. Jalankan `pnpm prisma db seed`.

### Langkah 2: Pembuatan Tipe Kontrak & Validasi Zod
1. Buat file interface TypeScript baru di `src/interfaces/features/[feature].ts` untuk mendefinisikan struktur input data, database record, dan format paginated response.
2. Buat skema validasi Zod di `src/schemas/[feature].ts`. Pastikan setiap input form divalidasi dengan pesan error yang human-readable dalam Bahasa Indonesia.

### Langkah 3: Implementasi Server Actions (Services)
1. Buat service CRUD di `src/services/[feature].ts` menggunakan fungsi asinkron (Server Actions).
2. Terapkan validasi backend:
   * **Keamanan**: Jalankan `await verifyPermission('feature.action')` di bagian paling atas fungsi.
   * **Keunikan Data (Uniqueness)**: Cek duplikasi record (nama/judul) di database secara case-insensitive menggunakan Prisma `.findFirst()` sebelum melakukan `create` atau `update`.
   * **Integritas Relasi**: Untuk field relasi opsional (nullable), konversi string kosong `""` menjadi `null` sebelum disubmit ke database.
3. Jalankan `revalidatePath` untuk membersihkan cache halaman Next.js.

### Langkah 4: Registrasi Menu & Breadcrumbs
1. Daftarkan rute baru Anda di file konfigurasi sidebar `sideLinks.ts` dengan menyertakan ikon Lucide dan hak akses `permission` yang dibutuhkan.
2. Tambahkan resolver label untuk segmen rute dinamis (UUID/slug) Anda di `src/services/labels.ts` agar breadcrumb di `CMSHeader.tsx` dapat menampilkan judul data asli secara human-readable.

### Langkah 5: Pembuatan UI Form & List Table
1. Buat folder halaman di `src/app/(cms)/admin/[module]/[feature]/` sesuai pedoman struktur folder di `AGENTS.md`.
2. Buat file `page.tsx` utama untuk merender komponen `DataTable` (menggunakan data fetching TanStack Query).
3. Buat file `Columns.tsx` dan `CellAction.tsx` di folder `_components/` untuk mengatur tata letak kolom tabel dan dropdown aksi.
4. Buat subfolder `[name]/` untuk detail page (untuk create mode dengan param `new` dan edit mode dengan param ID). Hubungkan data awal dengan form utama `[Feature]Form.tsx`.
5. Gunakan custom hooks untuk memisahkan logika submission form, query mutations, toast notifications (Sonner), dan routing redirects.

---

## 4. Kebijakan Manajemen Media & File

CMS ini menggunakan library Sharp di server untuk mengompresi asset gambar secara otomatis menjadi format WebP demi efisiensi bandwidth:

1. **Upload Target**: File diupload ke folder `public/uploads/[feature]`.
2. **Automatic Cleanup (Sampah & Trash)**:
   * Saat file dihapus dari database, file fisik dipindahkan ke folder `.trash` tersembunyi (bukan langsung dihapus permanen).
   * Panggil layanan `cleanupMediaReferences` untuk membersihkan kolom referensi gambar di tabel terkait di database menjadi `null`.

---

## 5. Indeks Dokumentasi Fitur (`docs/features/`)

Untuk memahami logika fungsional internal dari setiap modul yang sudah ada, silakan baca dokumentasi detail berikut:

1. **[Autentikasi & Otorisasi](docs/features/authentication.md)** - Logika Better Auth, Proxy middleware, dan Permission-Based Access Control (PBAC).
2. **[Manajemen Portofolio](docs/features/portfolio.md)** - Pengelolaan kategori portofolio, portofolio wisuda, pengelompokan kota (*City Grouping*), video embed, dan media gallery.
3. **[Manajemen Klien](docs/features/clients.md)** - Pengelolaan instansi partner, kategori klien, logo upload, dan logo marquee.
4. **[Manajemen Testimoni](docs/features/testimonials.md)** - Hubungan dinamis testimoni klien dengan hasil karya portofolio.
5. **[Manajemen Pengguna, Jabatan, & Hak Akses](docs/features/user-role-permission.md)** - Operasi manajemen users, roles, permissions, hierarki guard, role escalation guard, reset password (superadmin only), modal pengaturan profil diri sendiri (`UserSettingsModal`), dan guard `canEdit` yang mencegah admin mengubah data superadmin.
6. **Skalabilitas UI & Navigasi Publik** - Penggunaan komponen *carousel* pintar dengan indikator fraksional dinamis (misal: 1 / 15) untuk menangani jumlah data besar (kota & testimoni) tanpa merusak *layout*.
7. **[Optimasi Lighthouse, SEO, & Aksesibilitas](docs/features/lighthouse-performance-seo.md)** - Strategi preloading LCP, Image optimization, static-to-video transitions (ghosting fix), proxy analitik Cloudflare, sitemap filters, heading hierarchy, dan accessibility touch targets.
8. **[Dashboard CMS Panel](docs/features/dashboard.md)** - Pusat pemantauan statistik, aktivitas teranyar, distribusi portofolio, dan pintasan administrasi.