# Dokumentasi Fitur: Autentikasi & Otorisasi (PBAC)

Fitur ini mengatur mekanisme masuk (login), keamanan rute panel admin, serta pembatasan akses fitur berdasarkan hak akses (Permission-Based Access Control) baik di sisi client maupun server.

---

## 1. Arsitektur Autentikasi

Otentikasi di dalam aplikasi menggunakan **Better Auth** yang menyimpan data sesi pengguna di dalam tabel database PostgreSQL:
* **Prisma Models**: `User`, `Session`, `Account`, dan `Verification`.
* **Client Instance**: `authClient` digunakan di sisi klien untuk memanggil fungsi otentikasi (seperti `signIn.email()`, `signOut()`).
* **Session Validation**: Pengecekan status login memvalidasi properti `session.expiresAt` secara manual terhadap waktu server/lokal saat ini untuk memastikan sesi yang sudah kedaluwarsa tidak dianggap aktif.
* **Pembatasan Registrasi Publik**: Akses pendaftaran akun mandiri melalui rute `/register` ditutup bagi publik. Halaman `/register` dimodifikasi menjadi halaman peringatan statis yang menerangkan bahwa registrasi hanya bisa dilakukan oleh Super Admin, lengkap dengan tombol kembali ke Beranda (`/`).

---

## 2. Mekanisme Proteksi Rute (Next.js 16 Proxy)

Proteksi rute diimplementasikan di [src/proxy.ts](../../src/proxy.ts):
1. **Pemicu Rute**: Setiap request ke `/admin/:path*` dan `/login` akan diproses oleh proxy.
2. **Pengambilan Sesi**: Mengambil sesi secara server-side melalui fetch internal `/api/auth/get-session` dengan meneruskan cookie pengguna.
3. **Pengecekan Masa Berlaku**: `new Date(session.expiresAt) > new Date()` memverifikasi sesi masih aktif.
4. **Validasi Hak Akses Admin (`admin.access`)**:
   * Jika sesi aktif dan mengakses halaman admin, proxy memanggil `/api/auth/permissions` untuk memeriksa apakah pengguna memiliki hak akses `admin.access`.
   * Jika tidak ada hak akses tersebut, pengguna dialihkan ke halaman depan (`/`).
5. **Redireksi Otomatis**:
   * Pengguna tanpa sesi aktif yang mengakses `/admin/*` akan ditendang ke `/login`.
   * Pengguna dengan sesi aktif yang mengakses `/login` akan dialihkan ke `/admin/dashboard`.
   * Pengguna yang mengakses segmen induk CMS (seperti `/admin/master`) dialihkan secara otomatis ke halaman sub-fitur pertama yang relevan (seperti `/admin/master/portfolio-categories`).

---

## 3. Sistem Otorisasi Client-Side (UI Guards)

Untuk membatasi elemen visual seperti tombol tambah, edit, atau hapus:
* **PermissionProvider**: Data hak akses (`permissions`) dan jabatan (`roles`) di-fetch di server (`src/app/(cms)/layout.tsx`) dan diteruskan sebagai initial state ke `PermissionProvider` agar tidak terjadi screen flickering.
* **usePermission Hook**: Komponen di sisi client menggunakan hook `usePermission()` untuk mengecek hak akses secara real-time:
  * `hasPermission('portfolio.create')` -> mengecek kecocokan hak akses spesifik.
  * `hasRole('superadmin')` -> mengecek apakah pengguna memiliki jabatan superadmin (case-insensitive).

---

## 4. Sistem Otorisasi Server-Side (Action Security)

Setiap operasi mutasi (tambah, ubah, hapus) di file `src/services/` wajib diproteksi di tingkat paling atas:
```typescript
import { verifyPermission } from "@/services/security";

export async function createPortfolio(data: PortfolioInput) {
  // Otorisasi di tingkat server
  await verifyPermission("portfolio.create");
  
  // Logika bisnis...
}
```
Jika pengguna tidak memiliki permission tersebut, fungsi `verifyPermission` akan melemparkan exception error keamanan, mencegah eksekusi queries Prisma.

