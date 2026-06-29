# Dokumentasi Fitur: Manajemen Portofolio & Kategori

Fitur Portofolio menangani penayangan galeri hasil foto/karya studio baik untuk konsumsi publik (klien) maupun pengelolaan internal di CMS.

---

## 1. Skema Database & Relasi

Di dalam [prisma/schema.prisma](../../prisma/schema.prisma), fitur ini didukung oleh dua model utama:
* **Portfolio**: Menyimpan data karya foto seperti judul (`title`), deskripsi (`description`), kota (`city`), gambar sampul (`cover`), array galeri foto (`images`), status video (`hasVideo`), dan tautan video (`videoUrl`).
* **PortfolioCategory**: Menyimpan nama kategori portofolio (contoh: *Graduation*, *Prewedding*, *Family*) dan gambar sampul kategori.
* **Relasi**: Hubungan *many-to-many* antara `Portfolio` dan `PortfolioCategory` yang diatur oleh Prisma secara otomatis.

---

## 2. Fitur Unggulan Manajemen Portofolio

### Single Image Cropper & Multi Image Upload
* **Sampul Portofolio (Cover)**: Diunggah menggunakan picker khusus dengan modal cropping gambar (`ImageCropperModal` berbasis `react-advanced-cropper`) agar rasio visual sampul seragam.
* **Galeri Karya (Images)**: Mendukung pengunggahan banyak gambar sekaligus (Multi Image Upload). Semua file disimpan di direktori `public/uploads/portfolios` setelah dikompresi menjadi format WebP beresolusi optimal.

### Penyematan Video YouTube
* Portofolio mendukung penyematan video melalui switch `hasVideo` dan input URL `videoUrl`.
* Di sisi publik, jika portofolio memiliki video, area detail portofolio akan merender pemutar video YouTube yang responsif.

---

## 3. Kondisi Khusus Halaman Wisuda (Graduation Page)

Halaman Kategori Portofolio Wisuda memiliki perlakuan khusus karena karakteristik layout yang unik:
* **Deteksi Kategori**: Jika kategori memiliki nama atau slug yang mengandung unsur `"graduation"` (diperbandingkan secara case-insensitive), sistem akan merender layout khusus wisuda (`PortfolioGraduationDetailView.tsx` dan `GraduationGrid.tsx`).
* **Kustomisasi Footer & Navbar**: Aset gambar footer diganti menjadi `footer-grad.jpg` dan Navbar disesuaikan secara visual saat mengakses halaman ini demi estetika yang menyatu dengan tema wisuda.
* **Skema Edit Kategori**: Melalui pembaruan skema `portfolio-categories`, admin diperbolehkan mengubah meta-data kategori graduation tanpa batasan rigid, namun tetap memvalidasi uniqueness nama kategori.

---

## 4. Validasi Layanan (Server-Side)

Di dalam Server Action `src/services/portfolio.ts` dan `src/services/portfolio-categories.ts`:
* **Validasi Uniqueness**: Sebelum membuat/mengubah kategori, sistem memvalidasi apakah nama kategori sudah ada di database secara case-insensitive.
* **Path Revalidation**: Setiap aksi berhasil akan menjalankan `revalidatePath('/portfolio')` dan rute terkait untuk menjamin data langsung terbarui tanpa reload browser manual.
* **Media Cleanup**: Jika cover portofolio diganti atau record dihapus, file fisik lama akan dipindahkan ke folder `.trash` dan referensi database diperbarui.
