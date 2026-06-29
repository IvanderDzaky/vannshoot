# Panduan Teknis Vannshoot CMS

## Perintah Pengembangan
- **Run Dev:** `pnpm dev`
- **Build:** `pnpm build`
- **Start Server:** `pnpm start`
- **Lint:** `pnpm lint`
- **Lint Fix:** `pnpm lint:fix`
- **Type Check:** `npx tsc --noEmit`

## Perintah Database (Prisma)
- **Generate:** `pnpm prisma generate` (Jalankan setiap kali ada perubahan pada `schema.prisma`)
- **Migrate:** `pnpm prisma migrate dev`
- **Seed:** `pnpm prisma db seed`
- **Studio:** `pnpm prisma studio`

## Perintah Versioning (SemVer)
- **Increment Patch:** `pnpm version:patch`
- **Increment Minor:** `pnpm version:minor`
- **Increment Major:** `pnpm version:major`


## Aturan Penulisan Kode
- **Bahasa:** Gunakan Bahasa Indonesia untuk label UI, deskripsi database (seed), pesan toast, dan error message yang terlihat user.
- **Komponen UI:** Gunakan komponen dari `@/components/ui` (Shadcn).
- **Icons:** Gunakan `lucide-react`.
- **Styling:** Gunakan Tailwind CSS. Ikuti aturan badge warna di `AGENTS.md`.
- **Data Fetching:** 
  - **Server:** Gunakan Server Actions di `src/services` untuk mutasi dan pengambilan data krusial. Selalu gunakan `verifyPermission(permissionName)` untuk otorisasi.
  - **Client:** Gunakan TanStack Query (`useQuery`, `useMutation`) untuk state management di sisi klien.
- **Autentikasi & Otorisasi:** 
  - Menggunakan **Better Auth**.
  - Otorisasi di sisi klien menggunakan `usePermission()` (PBAC).
  - Otorisasi di sisi server menggunakan **Next.js 16 `src/proxy.ts`** (internal session fetching). Wajib memverifikasi `expiresAt` secara manual untuk memastikan sesi kedaluwarsa tepat waktu.
  - Pengecekan di dalam Server Actions menggunakan `verifyPermission` dari `src/services/security.ts`.
- **Keamanan Hierarki:**
  - `superadmin` adalah role tertinggi.
  *   **UI Guards:** Hide/disable tombol aksi (Edit/Delete) berdasarkan hierarki role (lihat `AGENTS.md` Bagian 6).
- **Type Safety:** 
  - **Dilarang menggunakan `any`.**
  - Gunakan Module Augmentation di `src/types/auth-types.d.ts` untuk properti custom pada session.
  - Gunakan Zod untuk validasi schema di client dan server.
- **Media Library:** 
  - File disimpan di `public/uploads`.
  - Gunakan `MediaPicker` untuk input file di form.
  - Jalankan `cleanupMediaReferences` dari `src/services/cleanup.ts` saat menghapus file secara permanen atau memindahkan ke sampah.
- **Struktur Rute:** Memanfaatkan Route Groups (`(auth)`, `(cms)`, `(root)`) untuk pengorganisasian kode.

## Praktik Terbaik Tambahan
- **Breadcrumbs:** Gunakan `resolveLabel` di `CMSHeader.tsx` untuk menampilkan judul asli pada segmen URL dinamis (ID/Slug).
- **Route Casting:** Jika Next.js Typed Routes aktif, lakukan casting `as Route` dari `next` pada template literal `href` di komponen `Link` atau `router.push`.
- **Relational Integrity:** Selalu konversi string kosong menjadi `null` untuk field relasi opsional di Server Actions.
- **Name Validation:** Lakukan pengecekan duplikasi nama/judul secara manual di Server Actions dengan kueri `findFirst` (case-insensitive) sebelum mutasi data.
- **Path Revalidation:** Selalu jalankan `revalidatePath(BASE_PATH)` setelah melakukan mutasi (create/update/delete) di Server Actions.
- **Server-Side Hydration:** Layout CMS (`src/app/(cms)/layout.tsx`) melakukan fetching data awal untuk menghindari UI flicker pada komponen yang membutuhkan permissions/roles.
- **Internal Linking:** Gunakan pola picker (seperti `PortfolioPicker`) untuk membangun URL internal secara dinamis guna menghindari broken link.
- **Portfolio City:** Pastikan data `city` (Kota) terekam di database dan tervalidasi sebagai data wajib (required) di form portfolio.
