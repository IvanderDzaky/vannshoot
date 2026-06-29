# Dokumentasi Fitur: Pengguna, Jabatan, & Hak Akses (RBAC/PBAC)

Fitur ini mengelola hak akses seluruh staff operasional CMS melalui sistem Permission-Based Access Control (PBAC) yang terintegrasi erat dengan autentikasi.

---

## 1. Skema Database (PBAC Core)

Di dalam [prisma/schema.prisma](../../prisma/schema.prisma), sistem otorisasi dikelola oleh model-model berikut:
* **User**: Pengguna terdaftar dengan `roleId` opsional.
* **Role**: Jabatan (contoh: *Superadmin*, *Admin*, *User*).
* **Permission**: Hak akses detail (contoh: `portfolio.create`, `youtube.link.delete`).
* **RoleHasPermission**: Tabel pivot relasi many-to-many untuk mendaftarkan hak akses apa saja yang dimiliki suatu jabatan.
* **ModelHasPermissions**: Tabel pivot relasi dinamis untuk hak akses langsung di level individual pengguna.

---

## 2. Aturan Estetika Badge (Warna Representatif)

Untuk kenyamanan visual pengawasan di CMS, status jabatan dan permission diberi kode warna badge:
* **Jabatan (Role)**:
  * `superadmin`: Warna merah (`bg-rose-500/10 text-rose-600 border-rose-200`).
  * `admin`: Warna biru (`bg-blue-500/10 text-blue-600 border-blue-200`).
  * `user`: Warna hijau (`bg-emerald-500/10 text-emerald-600 border-emerald-200`).
* **Hak Akses (Permission Action)**:
  * `read`: Biru
  * `create`: Hijau
  * `update`: Orange / Amber
  * `delete`: Red / Rose
  * `access`: Purple

---

## 3. Aturan Keamanan & UI Guards (Sangat Krusial)

Sistem ini memiliki proteksi keamanan bertingkat yang wajib ditaati oleh kode client-side dan server-side:

### A. Proteksi Penghapusan Diri Sendiri (Self-Deletion Guard)
* Pengguna yang sedang masuk (logged-in user) **DILARANG KERAS** menghapus akunnya sendiri.
* Pengecekan dilakukan di UI (tombol Delete disembunyikan/dinonaktifkan jika `currentUser.id === targetUser.id`) dan divalidasi ulang di Server Action.

### B. Proteksi Jabatan Superadmin (Superadmin Protection)
* Role `superadmin` adalah hierarki tertinggi di sistem.
* Hanya pengguna dengan role `superadmin` yang diperbolehkan menghapus pengguna ber-role `superadmin` lainnya.
* Pengguna non-superadmin **DILARANG** menghapus pengguna dengan role `superadmin`.
* Semua perbandingan nama role superadmin wajib menggunakan fungsi `.toLowerCase() === 'superadmin'` untuk menghindari celah sensitivitas huruf (Case Sensitivity).

### C. Proteksi Eskalasi Jabatan (Role Escalation Guard)
* Pengguna non-superadmin **DILARANG** memberikan atau mengubah jabatan pengguna lain menjadi `superadmin` (mencegah eskalasi hak istimewa).
* Di dalam `UserForm.tsx`, opsi "Superadmin" pada dropdown pilihan jabatan wajib di-`disabled` secara dinamis jika pengguna yang mengedit bukan seorang `superadmin`.
