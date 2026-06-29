# Dokumentasi Fitur: Optimasi Lighthouse, Kinerja, SEO, & Aksesibilitas

Dokumen ini menjelaskan strategi teknis dan arsitektur pengoptimalan yang diimplementasikan pada halaman publik untuk mencapai skor Lighthouse 100 di seluruh kategori (Kinerja, Aksesibilitas, Praktik Terbaik, dan SEO).

---

## 1. Kinerja (Performance)

Kinerja dioptimalkan melalui beberapa teknik rendering dan optimasi aset:

* **Incremental Static Regeneration (ISR)**:
  - Mengubah metode rendering halaman depan publik (`src/app/(root)/page.tsx`) dari `force-dynamic` menjadi ISR dengan interval `revalidate = 300` (5 menit).
  - Mengurangi metrik TTFB (Time to First Byte) dari ~940ms menjadi ~50ms karena halaman dimuat dari cache HTML server alih-alih mengeksekusi Prisma Query langsung di setiap request.

* **Image-First Hero & LCP Preloading**:
  - Halaman beranda menggunakan poster WebP terkompresi (`public/assets/videos/mm_poster_1080.webp`, berukuran hanya ~75 KB) sebagai elemen LCP (Largest Contentful Paint) utama.
  - Elemen poster `<img>` dimuat secara eager (`loading="eager"` dan `fetchPriority="high"`) dan di-preload langsung di layout global ([src/app/(root)/layout.tsx](../../src/app/(root)/layout.tsx)) menggunakan `<link rel="preload">`.
  - Hal ini memangkas waktu LCP secara drastis dibandingkan memuat video besar secara langsung.

* **Autoplay & Fade Transition (Anti-Ghosting)**:
  - Video hero (`Micromoment-Header-Video.mp4`) dimuat secara lazy menggunakan `preload="metadata"` dan diputar programatis di client-side (`useEffect`).
  - Setelah video berhasil diputar (`onPlaying`), opacity gambar poster statis dipudarkan (*fade-out*) menjadi `0` dan video dipudarkan masuk (*fade-in*) menjadi `0.6` dengan transisi `0.8s ease` untuk mencegah efek bayangan tumpang tindih (*ghosting*).

* **Optimasi Gambar Otomatis (Next.js Image)**:
  - Mengaktifkan kembali optimasi gambar Next.js di `next.config.ts` (menghapus `unoptimized: true`) untuk mengompresi gambar dinamis (seperti foto portofolio) secara otomatis di server Next.js.
  - Menyediakan format modern AVIF dan WebP di Next.js config.
  - Menambahkan atribut `sizes` yang responsif pada semua tag `<Image>` di carousel dan grid untuk mencegah download resolusi gambar berlebih pada perangkat mobile.

---

## 2. Aksesibilitas (Accessibility)

Memperbaiki kualitas aksesibilitas untuk pengguna berkebutuhan khusus & pembaca layar:

* **Hierarki Heading**:
  - Mengubah tingkat heading section utama di halaman beranda dari `<h3>` menjadi `<h2>` agar berurutan secara logis setelah tag `<h1>` pada hero banner utama.
* **Touch Target Size**:
  - Tombol indikator dot carousel pada `RecentWorkCarousel`, `TestimonialCarousel`, dan `CityCarousel` diperbesar area sentuhnya menjadi minimal `24x24px` untuk memudahkan interaksi sentuh pada perangkat seluler.
* **Aria Attributes**:
  - Menambahkan `aria-label="Scroll to top"`, `aria-hidden="true"`, dan `tabIndex={-1}` pada tombol melayang kembali ke atas (`ScrollToTop.tsx`) saat disembunyikan.
  - Menambahkan `aria-hidden="true"` pada elemen dekoratif di `PhotographyHero.tsx`.

---

## 3. Praktik Terbaik (Best Practices) & Keamanan

* **Proxy Beacon Cloudflare Web Analytics**:
  - Untuk mencegah script Cloudflare Analytics (`/cdn-cgi/rum`) diblokir oleh pemblokir iklan (adblocker) klien yang memicu error `ERR_BLOCKED_BY_CLIENT` di konsol browser, dibuat proxy API internal di [src/app/api/beacon/route.ts](../../src/app/api/beacon/route.ts).
  - Proxy ini menerima data beacon analitik dari client-side dan mengirimkannya kembali ke server Cloudflare secara internal (*same-origin request*).
  - Penulisan rewrite rule ditambahkan pada `next.config.ts` untuk memetakan traffic `/cdn-cgi/rum` ke proxy `/api/beacon`.
* **Security Headers**:
  - Menambahkan konfigurasi security headers standar industri di `next.config.ts` untuk memitigasi celah kerentanan keamanan XSS, clickjacking, dan mime-sniffing:
    - `X-Content-Type-Options: nosniff`
    - `X-Frame-Options: DENY`
    - `Referrer-Policy: strict-origin-when-cross-origin`
    - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## 4. Search Engine Optimization (SEO)

* **robots.txt & Absolute Sitemap Domain**:
  - Memperbarui generator `robots.tsx` untuk memastikan URL sitemap ditulis secara absolut (`https://micromoment.id/sitemap.xml`) menggunakan domain dinamis dari environment variable dengan fallback yang aman.
* **Sitemap Route Filtering**:
  - Memodifikasi [sitemap.tsx](../../src/app/sitemap.tsx) untuk memfilter dan mengecualikan rute administratif `/admin/*` serta rute otentikasi (`/login`, `/register`) agar tidak diindeks oleh mesin pencari publik demi keamanan dan privasi.
