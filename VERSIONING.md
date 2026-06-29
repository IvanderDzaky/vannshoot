# Panduan Versioning & Changelog - Vannshoot CMS

Dokumen ini menjelaskan aturan penulisan versi dan pembuatan changelog otomatis yang wajib diikuti oleh programmer dan AI Agent di repositori ini.

---

## 1. Aturan Semantic Versioning (SemVer) & Fase Development

Versi aplikasi menggunakan format SemVer: `MAJOR.MINOR.PATCH` (contoh: `1.0.2`):
* **MAJOR**: Dinaikkan jika ada perubahan yang tidak kompatibel ke belakang (breaking changes).
* **MINOR**: Dinaikkan jika menambahkan fitur/fungsionalitas baru yang kompatibel ke belakang.
* **PATCH**: Dinaikkan jika ada perbaikan bug (bug fixes) yang kompatibel ke belakang.

### Indikator Fase Development (Pre-release)
Untuk membedakan proyek yang masih dalam pengembangan (belum dirilis resmi ke produksi), repositori ini mendukung penanda pre-release `-dev.X` (contoh: `1.1.0-dev.0`):
* **Memulai Fase Dev**: Jalankan `pnpm version:minor -- --dev` atau `pnpm version:major -- --dev` untuk memulai iterasi fitur baru.
* **Menaikkan Versi Dev**: Saat berada dalam fase dev (versi memiliki tag `-dev.X`), menjalankan perintah patch (`pnpm version:patch`) akan menaikkan counter dev tersebut (contoh: `1.1.0-dev.0` -> `1.1.0-dev.1`). Hal ini menghindari kenaikan versi produksi sebelum aplikasi benar-benar dirilis.
* **Merilis Versi Produksi**: Ketika fitur selesai dan siap dirilis ke produksi, jalankan perintah release untuk membersihkan tag dev:
  ```bash
  node scripts/increment-version.cjs release
  # Versi berubah dari 1.1.0-dev.1 menjadi 1.1.0
  ```

---

## 2. Pembuatan Changelog (AI Generated)

Changelog di-generate oleh AI saat proses code review berdasarkan diff kode. Hanya section yang relevan yang ditampilkan.

### Lokasi File Changelog
Setiap file changelog disimpan dengan pola path berikut:
```text
docs/changelog/[yyyy]/[mm]/[cms/client]/[nama-fitur].md
```
**Contoh:**
* `docs/changelog/2025/06/cms/user-auth.md`
* `docs/changelog/2025/06/client/project-detail.md`

### Kapan Dibuat & Diperbarui
| Kondisi                                     | Aksi                                                             |
| :------------------------------------------ | :--------------------------------------------------------------- |
| **Saat membuka PR**                         | Programmer/Agent **membuat** file changelog baru                 |
| **Ada revisi dari code review**             | Programmer/Agent **mengupdate** changelog sebelum merge          |

### Format Dokumen Changelog
```markdown
## [YYYY-MM-DD]

### Feature / Nama Fitur

#### Added
- Deskripsi fitur baru yang ditambahkan

#### Changed
- Deskripsi perubahan fungsionalitas yang sudah ada

#### Deprecated
- Deskripsi fitur lama yang akan segera dihapus

#### Removed
- Deskripsi fitur yang dihapus dari sistem

#### Fixed
- Deskripsi perbaikan bug/isu

#### Security
- Deskripsi penanganan kerentanan keamanan
```

### Aturan Tambahan:
* **Section yang tidak relevan tidak perlu ditulis**. Jika tidak ada yang dihapus, hilangkan bagian `#### Removed`.
* **Satu file changelog per fitur/branch**.
* Jika satu Pull Request mengandung beberapa task, seluruh perubahan tetap ditulis dalam **satu file changelog yang sama**.