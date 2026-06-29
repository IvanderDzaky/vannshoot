# Dokumentasi Fitur: Dashboard Panel Admin (CMS)

Halaman Dashboard berfungsi sebagai pusat informasi utama bagi staff admin untuk memantau aktivitas publikasi, statistik konten portofolio, review klien, dan data master sistem.

---

## 1. Integrasi Data & Kueri (Dashboard Services)

Pemuatan data diatur secara efisien di sisi server melalui [src/services/dashboard.ts](../../src/services/dashboard.ts):
* **Parallel Counts**: Menghitung secara paralel total artikel, kategori artikel, portofolio, kategori portofolio, testimoni klien, logo klien, tautan YouTube, staff/user, dan roles menggunakan `Promise.all` untuk optimasi response time database.
* **Recents Lists**: Mengambil data teranyar untuk artikel (termasuk relasi penulis dan kategori) serta portofolio untuk konsumsi visual panel.
* **Distribution Matrix**: Menghitung proporsi penyebaran karya portofolio berdasarkan masing-masing kategori secara dinamis.

---

## 2. Struktur Tampilan (UI Layout)

Tampilan dashboard dibagi menjadi beberapa segmen penting:
1. **GreetingCard**: Komponen interaktif yang mendeteksi waktu di sisi client untuk menampilkan salam dinamis (Selamat Pagi/Siang/Sore/Malam) dengan representasi warna tema dan icon cuaca/waktu yang sesuai.
2. **Stats Grid Cards**: 4 buah kartu metrik utama (Portofolio, Artikel, Testimoni, Klien) yang dilengkapi dengan Lucide Icons dan link direct navigasi ke modul terkait.
3. **Artikel & Portofolio Terbaru**: Bagian list dengan layout grid yang menampilkan thumbnail, author, categories, dan tanggal rilis karya teranyar.
4. **Distribusi Kategori Portofolio**: Bar persentase indikator kemajuan (Progress Bar) yang menunjukkan persentase jumlah item per kategori tanpa dependensi library chart berat untuk performa loading instan.
5. **Quick System Info**: Metrik tautan YouTube, staff aktif, dan tombol pintasan (shortcuts) registrasi staff baru atau hak akses.
