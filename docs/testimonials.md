# Dokumentasi Fitur: Manajemen Testimoni Klien

Fitur Testimoni menangani pencatatan dan penayangan ulasan/ulasan kepuasan pelanggan secara publik, lengkap dengan integrasi rujukan portofolio hasil karya terkait.

---

## 1. Skema Database

Di dalam [prisma/schema.prisma](../../prisma/schema.prisma), testimoni dicatat pada model tunggal:
* **Testimonial**: 
  * `cover`: Foto profil klien atau foto representatif klien.
  * `client`: Nama lengkap klien.
  * `testimony`: Pesan review tertulis (testimoni).
  * `location`: Lokasi/venue pengambilan foto (contoh: *Studio 1*, *Outdoor IPB*).
  * `city`: Kota tempat asal klien atau lokasi pemotretan.
  * `redirect`: Link referensi eksternal/internal (biasanya menunjuk ke portofolio detail terkait).

---

## 2. Integrasi Portofolio Picker (PortfolioPicker)

Salah satu keunggulan manajemen testimoni di CMS ini adalah kemampuan untuk menghubungkan ulasan pelanggan dengan karya portofolio terkait:
* Di dalam form testimoni CMS (`TestimonialForm.tsx`), terdapat komponen input berupa **Portfolio Picker**.
* Komponen ini melakukan fetching asinkron terhadap daftar portofolio aktif yang ada di database.
* Admin dapat memilih satu portofolio, dan sistem akan menyimpan URL rute dinamis portofolio tersebut (misal: `/portfolio/[slug]`) ke kolom `redirect`.
* Di halaman depan publik (`/testimony`), ulasan yang ditampilkan akan menyertakan tombol aksi "Lihat Portofolio" yang mengarah langsung ke hasil karya tersebut untuk meningkatkan tingkat kepercayaan calon pelanggan.

---

## 3. Penyimpanan Aset Foto & Kebijakan Upload

* **Penyimpanan**: Foto profil ulasan disimpan di direktori `public/uploads/testimonials`.
* **Ukuran & Rasio**: Gambar dipotong (cropped) dengan rasio 1:1 (persegi) agar konsisten saat dirender dalam bentuk card testimoni berbentuk lingkaran atau avatar.
* **Auto-Cleanup**: Menghapus testimoni otomatis memindahkan foto profil ulasan terkait ke `.trash` dan menyetel field database terkait menjadi `null` melalui event handling di Server Action.
