# Dokumentasi Fitur: Manajemen Klien & Kategori Klien

Fitur Klien berfungsi untuk mendokumentasikan logo, profil singkat, dan klasifikasi klien/mitra usaha yang telah bekerja sama dengan studio foto.

---

## 1. Skema Database & Relasi

Di dalam [prisma/schema.prisma](../../prisma/schema.prisma), fitur ini didukung oleh:
* **Client**: Menyimpan nama klien (`name`), deskripsi opsional (`description`), dan file logo klien (`image`).
* **ClientCategory**: Menyimpan kategori pengelompokan klien (contoh: *Corporate*, *Educational*, *Personal*).
* **Relasi**: Hubungan *many-to-many* (`clients <-> client_categories`) yang memungkinkan satu klien memiliki lebih dari satu kategori.

---

## 2. Pengelolaan Logo Klien

* **Lokasi Penyimpanan**: Logo klien diunggah ke folder `public/uploads/clients`.
* **Proses Kompresi**: File gambar logo diproses oleh Sharp menjadi format WebP dengan pembersihan metadata gambar (EXIF) otomatis.
* **Pembersihan Referensi Rusak (Broken Reference Cleanup)**: 
  * Saat menghapus record klien, file logo fisik dipindahkan ke `.trash`.
  * Sistem menjalankan fungsi `cleanupMediaReferences` untuk memastikan tidak ada pointer file gambar lama yang tertinggal di database yang dapat memicu error UI.

---

## 3. Integrasi Halaman Publik (Client Marquee)

Logo klien ditampilkan di halaman depan publik menggunakan dua bentuk visualisasi:
1. **ClientCarousel**: Menampilkan daftar logo mitra terpilih di halaman beranda secara horizontal slider.
2. **UniversityMarquee & CompanyGrid**: Elemen marquee bergerak di halaman `/clients` khusus untuk institusi pendidikan/universitas dan grid interaktif untuk logo perusahaan komersial.
3. **Penyaringan Kategori**: Klien dipisahkan berdasarkan kategori secara dinamis sehingga mempermudah calon klien melihat kredibilitas berdasarkan sektor industri.
