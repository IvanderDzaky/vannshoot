# Arsitektur Komponen

Terdapat beberapa poin penting terkait bagaimana menjalankan proyek arsitektur yang benar. Untuk studi kasus kali ini, Saya telah membuatkan sebuah templat proyek kosong yang sudah Saya kustomisasi yang sekiranya sudah mengimplementasi bagaimana cara mengatur proyek arsitektur yang baik agar terlihat rapi.

### Common

Folder `Common` terletak pada `/src/components/Common/`. Folder ini berisi komponen-komponen atomik atau elemen UI dasar yang bersifat reusable dan independen.
Contoh: Tombol (`Button`), Input, Modal, Icon kustom, dll.

### Mixins

Folder `Mixins` terletak pada `/src/components/Mixins/`. Folder ini berisi komponen-komponen hasil gabungan atau komposisi dari beberapa komponen `Common` untuk membentuk fitur yang lebih kompleks.
Contoh: Navbar (gabungan dari Logo, Links, dan Theme Toggle), Footer, Sidebar, dll.

### UI

Folder `UI` terletak pada `/src/components/ui/`. Folder ini berisi komponen-komponen UI yang sudah jadi dan siap pakai.
Contoh: DataTable, Sidebar, dll.
