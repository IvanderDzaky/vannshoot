# AI Agents Guidelines - Vannshoot CMS

Dokumen ini menjelaskan pola arsitektur yang wajib diikuti oleh AI Agent saat menambahkan fitur baru ke dalam CMS ini.

## 1. Struktur Folder Fitur
Setiap fitur manajemen wajib mengikuti struktur berikut:
```text
src/app/(cms)/admin/[module]/[feature]/
├── _components/            # Komponen tabel utama
│   ├── Columns.tsx         # Definisi kolom TanStack Table
│   └── CellAction.tsx      # Dropdown aksi (Edit/Delete)
├── [name]/                 # Halaman Detail (Create & Edit)
│   ├── _components/
│   │   └── [Feature]Form.tsx # Formulir utama (Zod + React Hook Form)
│   └── page.tsx            # Pengecekan parameter 'new' vs ID
└── page.tsx                # Halaman list utama (DataTable)
```

## 2. Lapisan Data (Data Layer)
- **Interfaces:** Simpan di `src/interfaces/features/[feature].ts`.
- **Schemas:** Simpan di `src/schemas/[feature].ts` (Zod).
- **Services:** Simpan di `src/services/[feature].ts` (Server Actions). Gunakan `verifyPermission` dari `src/services/security.ts` untuk proteksi level server.
- **Data Retrieval:** Selalu gunakan Prisma dengan `include` yang tepat untuk relasi (terutama `roles` dan `permissions`).

## 3. Aturan Estetika & UX (Wajib)
### Warna Badge Jabatan (Role)
- **Superadmin:** Red (`bg-rose-500/10 text-rose-600 border-rose-200`) - Hierarki Tertinggi.
- **Admin:** Blue (`bg-blue-500/10 text-blue-600 border-blue-200`).
- **User:** Green (`bg-emerald-500/10 text-emerald-600 border-emerald-200`).

### Warna Badge Hak Akses (Permission)
- **read:** Blue
- **create:** Green
- **update:** Orange/Amber
- **delete:** Red/Rose
- **access:** Purple

### Navigasi & Keamanan
- Navigasi Sidebar dikontrol oleh `sideLinks.ts` berdasarkan array `permissions`.
- Semua logic proteksi rute admin ada di `src/proxy.ts` (Next.js 16 Proxy). Catatan: `middleware.ts` sudah deprecated di versi ini.
- Semua pengecekan autentikasi di `proxy.ts` wajib memvalidasi `session.expiresAt` secara manual terhadap waktu sekarang untuk mencegah sesi "hantu" dari cookie lama.
- Sidebar menggunakan Server-Side data fetching di `CMSLayout` untuk menghindari flicker dan di-hydrate ke `PermissionProvider`.

## 4. Pola Form Detail (`[name]/page.tsx`)
Gunakan satu file `page.tsx` di dalam folder `[name]` untuk menangani mode Tambah dan Ubah:
- Jika `params.name === 'new'`, kirim `initialData={null}` ke Form.
- Jika selain itu, ambil data berdasarkan ID/Name dan kirim sebagai `initialData`.

## 5. Sistem Izin & Role (PBAC)
- **Client-Side Hook:** Gunakan `usePermission()` dari `src/providers/PermissionProvider.tsx`.
- **Fungsi Tersedia:**
  - `hasPermission('feature.action')`: Cek hak akses spesifik.
  - `hasRole('role_name')`: Cek apakah user memiliki role tertentu (Case-Insensitive).
- **Sinkronisasi Data:** Data permission dan roles di-fetch di server (`CMSLayout`) dan di-hydrate ke `PermissionProvider` melalui `initialPermissions` dan `initialRoles`.

## 6. Pembatasan Aksi & Hierarki (UI Guards)
- **Self-Deletion:** Pengguna tidak boleh menghapus akun mereka sendiri. Cek `currentUser.id === targetUser.id`.
- **SuperAdmin Protection:** 
  - Hanya `superadmin` yang bisa menghapus data `superadmin` lainnya.
  - Non-superadmin **DILARANG** menghapus user dengan role `superadmin`.
- **Role Escalation Guard:**
  - Non-superadmin **DILARANG** memberikan atau mengubah role user menjadi `superadmin`.
  - Di `UserForm`, opsi "Superadmin" pada dropdown jabatan wajib di-`disabled` jika user yang sedang login bukan superadmin.
- **Case Sensitivity:** Selalu gunakan `.toLowerCase() === 'superadmin'` saat membandingkan nama role.

## 7. Standar Kode & Type Safety
- **Anti-Any:** Dilarang keras menggunakan tipe `any`. Gunakan interface atau casting yang tepat.
- **Better Auth Augmentation:** Objek `session.user` di client seringkali minimal. Jika butuh data database lengkap (seperti roles), gunakan data dari `PermissionProvider`.
- **Casting:** Gunakan interface `ExtendedUser` lokal jika perlu melakukan casting pada `session.user` untuk mengakses properti custom seperti `roleId` atau `role`.

## 8. State Management
- Gunakan `queryClient.invalidateQueries` setelah mutasi berhasil (create/update/delete).
- Lakukan `router.refresh()` dan `router.push()` untuk memastikan UI sinkron dengan data terbaru di server.

## 9. Kebijakan Identifikasi & URL
Setiap modul dapat memiliki kebijakan identifikasi yang berbeda di URL:
- **Client, Role, Portfolio Category, Portfolio, Testimonial, User** Menggunakan `id` (UUID) sebagai pengidentifikasi utama di panel admin (edit page).
- **Service Layer:** Fungsi get/update/delete wajib menyesuaikan parameter tersebut dan menggunakan kueri Prisma yang tepat (`findUnique` jika unik di DB, `findFirst` jika tidak).

## 10. Validasi Backend (Uniqueness)
Sebelum melakukan `create` atau `update`, Server Action **WAJIB** mengecek apakah nama/judul sudah ada di database untuk mencegah duplikasi:
- Gunakan mode `insensitive` pada kueri Prisma.
- Pada operasi `update`, pastikan pengecekan mengecualikan ID data yang sedang diubah (`id: { not: currentId }`).

## 11. Breadcrumb & Resolusi Label
CMS menggunakan sistem resolusi label dinamis di `CMSHeader.tsx` untuk memastikan breadcrumb menampilkan judul yang human-readable:
- **Server Action:** Gunakan `src/services/labels.ts` (`resolveLabel`) untuk mengambil judul asli berdasarkan ID/Slug.
- **Pola Segmen:** Jika segmen URL adalah ID dinamis, `CMSHeader` akan mendeteksinya berdasarkan segmen induknya (parent segment) dan melakukan resolve secara otomatis.

## 12. Penanganan Relasi Opsional
Untuk kolom relasi yang bersifat opsional (nullable) di database:
- Pastikan mengubah nilai string kosong (`""`) dari form menjadi `null` sebelum dikirim ke Prisma untuk menghindari error `ForeignKeyConstraintViolation`.
- Contoh: `portfolioId: values.portfolioId || null`.

## 13. Kebijakan Manajemen Media & File
CMS ini menggunakan **Media Library** berbasis filesystem murni untuk performa maksimal:
- **Root Directory:** Semua file berada di `public/uploads`.
- **Automatic Compression:** 
  - Gambar secara otomatis dikonversi ke format **WebP** menggunakan `sharp`.
  - Video dikompresi menggunakan **FFmpeg** (`libx264`).
- **Trash System:** File yang dihapus dipindahkan ke folder `.trash` tersembunyi, bukan langsung dihapus dari disk.
- **Broken Reference Cleanup:** Saat file dipindahkan ke sampah atau dihapus permanen, layanan `cleanupMediaReferences` dari `src/services/cleanup.ts` wajib dijalankan untuk membersihkan kolom `image` atau `cover` di database (set ke `null`).
- **UI Integration:** Gunakan komponen `MediaPicker` yang terintegrasi dengan `useMediaLibrary` untuk manajemen file di sisi client.

## 14. Pola Kueri & Optimasi UI
- **Pencarian:** Gunakan kueri `contains` dengan mode `insensitive` pada Prisma.
- **Pagination:** Gunakan `skip` dan `take` di Prisma, kembalikan objek `meta` (total, page, lastPage).
- **Loading State:** Selalu tampilkan skeleton atau loader (seperti `DataTable` isFetching) saat data sedang dimuat di client-side.
- **Optimistic Updates:** Walaupun jarang digunakan, prioritaskan `invalidateQueries` untuk menjaga sinkronisasi data yang paling akurat.
- **Route Grouping:** Proyek menggunakan Route Groups (`(auth)`, `(cms)`, `(root)`) untuk memisahkan layout dan middleware logic secara bersih.

## 15. Skalabilitas Komponen & UI UX
- **Carousel Scalability:** Saat merancang komponen *carousel* yang datanya bersifat dinamis dan berpotensi sangat banyak (seperti data kota atau testimoni), dilarang menggunakan *dot seeker* (titik navigasi) tanpa adanya batasan. 
- Jika *page count* melebihi 8 *item*, secara otomatis sembunyikan *dot seeker* dan ubah menjadi **indikator fraksional** (misal `1 / 15`) agar UI tidak *overflow* dan tetap rapi.
