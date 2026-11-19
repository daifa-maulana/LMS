# SIAK UFD Enterprise SaaS
**Sistem Informasi Akademik Universitas Fatmawati Digital**  
*Next-Generation Multi-Tenant Academic ERP & Education SaaS Platform*

---

## 🏛️ Profil Platform

**SIAK UFD** adalah platform *Vertical SaaS* (Software as a Service) dan Academic ERP terintegrasi untuk pengelolaan operasional perguruan tinggi modern. Mengadopsi standar arsitektur bersih (*Clean Architecture*), multi-tenansi aman (*PostgreSQL Row-Level Security*), serta desain antarmuka berbasis **FigCraft Design System** bertema emerald premium (`#237757`) dengan performa tinggi tanpa *layout shift* (Zero CLS) dan bebas hambatan gulir horizontal (*Zero Horizontal Scroll*).

---

## 📚 Dokumentasi Enterprise Lengkap

Seluruh aspek perancangan, arsitektur, basis data, dan tata kelola sistem telah didokumentasikan secara komprehensif pada folder [`docs/`](file:///C:/Users/Lenovo/Downloads/LMS/docs):

| Dokumen | Deskripsi Teknis & Manajerial | Tautan Berkas |
|---|---|:---:|
| **PRD (Product Requirements Document)** | Visi produk, persona pengguna, matriks RBAC, spesifikasi fungsional 28 modul, NFR, dan tingkatan paket SaaS (*Starter, Growth, Enterprise*). | [docs/PRD.md](file:///C:/Users/Lenovo/Downloads/LMS/docs/PRD.md) |
| **USECASE (Use Case Diagrams & Specs)** | Batas sistem (*System Boundary*), diagram use case per subsistem, relasi include/extend, serta kamus skenario spesifikasi use case lengkap. | [docs/USECASE.md](file:///C:/Users/Lenovo/Downloads/LMS/docs/USECASE.md) |
| **ACTIVITY (Activity Diagrams per Activity)** | Diagram aktivitas UML untuk setiap aktivitas utama (Login, KRS, Presensi 16 sesi, Input nilai, Validasi BAK, Publikasi KHS, Koreksi, Dokumen QR, PDDIKTI). | [docs/ACTIVITY.md](file:///C:/Users/Lenovo/Downloads/LMS/docs/ACTIVITY.md) |
| **WORKFLOW (Business Workflows & State Machines)** | Alur bisnis end-to-end, mesin status KRS, presensi 16 pertemuan, formula kalkulasi nilai multi-komponen, pipeline validasi BAK, dan audit perbaikan nilai. | [docs/WORKFLOW.md](file:///C:/Users/Lenovo/Downloads/LMS/docs/WORKFLOW.md) |
| **ERD (Entity Relationship Diagram)** | Skema basis data relasional multi-tenant lengkap dengan diagram Mermaid ERD, UUID primary key, `tenant_id` indexing, dan strategi partisi data. | [docs/ERD.md](file:///C:/Users/Lenovo/Downloads/LMS/docs/ERD.md) |
| **DFD (Data Flow Diagram)** | Diagram aliran data Level 0 (Context Diagram), Level 1 (Dekomposisi Fungsional 7 Subsistem), Level 2.3 (Siklus KRS), dan Level 2.6 (Pipeline Validasi Nilai). | [docs/DFD.md](file:///C:/Users/Lenovo/Downloads/LMS/docs/DFD.md) |
| **ARCHITECTURE (System Architecture & Clean Code)** | Arsitektur 4-lapis (*Domain, Application, Infrastructure, Presentation*), strategi multi-tenansi RLS, REST API standard, Zero CLS UI token, dan keamanan OWASP. | [docs/ARCHITECTURE.md](file:///C:/Users/Lenovo/Downloads/LMS/docs/ARCHITECTURE.md) |
| **API_SPEC (RESTful API Specification)** | Katalog spesifikasi endpoint REST API lengkap dengan format envelope, error RFC 7807, header multi-tenant, dan parameter operasi. | [docs/API_SPEC.md](file:///C:/Users/Lenovo/Downloads/LMS/docs/API_SPEC.md) |
| **TESTING (QA & Test Verification Matrix)** | Piramida pengujian, skenario uji komputasi formula nilai, verifikasi ambang batas presensi 75%, isolasi keamanan multi-tenant, dan audit UI. | [docs/TESTING.md](file:///C:/Users/Lenovo/Downloads/LMS/docs/TESTING.md) |
| **DESIGN (Design System & Design Tokens)** | Spesifikasi visual FigCraft: palet warna emerald, skala tipografi Inter, dimensi layout baku (224px sidebar, 72px topbar, 1136px canvas), dan komponen UI. | [docs/DESIGN.md](file:///C:/Users/Lenovo/Downloads/LMS/docs/DESIGN.md) |

---

## 🧭 Peta Modul Sistem (28 Halaman Terintegrasi)

SIAK UFD mencakup **28 halaman produksi** yang terbagi dalam 4 peran (*Role-Based Workspace*):

### 1. Autentikasi & Masuk Portal (1 Halaman)
- [Login SSO Portal Terpadu](file:///C:/Users/Lenovo/Downloads/LMS/pages/auth/login.html) — Autentikasi multi-tenant dengan pemilihan role dinamis.

### 2. Workspace Mahasiswa (9 Halaman)
- [Dashboard Mahasiswa](file:///C:/Users/Lenovo/Downloads/LMS/pages/mahasiswa/dashboard/index.html) — Ringkasan akademik, IPK berjalan, dan jadwal kuliah hari ini.
- [Jadwal Kuliah Mahasiswa](file:///C:/Users/Lenovo/Downloads/LMS/pages/mahasiswa/jadwal/index.html) — Kalender perkuliahan mingguan interaktif.
- [Rencana Studi (KRS/FRS)](file:///C:/Users/Lenovo/Downloads/LMS/pages/mahasiswa/krs/index.html) — Pengisian rencana studi semester baru dan pemilihan kelas.
- [Kartu Hasil Studi (KHS)](file:///C:/Users/Lenovo/Downloads/LMS/pages/mahasiswa/khs/index.html) — Rekapitulasi nilai semester dan kalkulasi IPS resmi.
- [Transkrip Nilai Akademik](file:///C:/Users/Lenovo/Downloads/LMS/pages/mahasiswa/transkrip/index.html) — Transkrip kumulatif lengkap dengan QR-code verifikasi digital.
- [Presensi Kuliah](file:///C:/Users/Lenovo/Downloads/LMS/pages/mahasiswa/presensi/index.html) — Pemantauan kehadiran 16 pertemuan dan status eligibilitas UAS.
- [Katalog Mata Kuliah](file:///C:/Users/Lenovo/Downloads/LMS/pages/mahasiswa/mata-kuliah/index.html) — Daftar kurikulum program studi dan prasyarat SKS.
- [Biodata Mahasiswa](file:///C:/Users/Lenovo/Downloads/LMS/pages/mahasiswa/biodata/index.html) — Profil pribadi, data akademik, dan informasi kontak darurat.
- [Pengaturan Akun](file:///C:/Users/Lenovo/Downloads/LMS/pages/mahasiswa/pengaturan/index.html) — Manajemen keamanan, ubah password, dan sesi login aktif.

### 3. Workspace Dosen Pengampu & Pembimbing (8 Halaman)
- [Dashboard Dosen](file:///C:/Users/Lenovo/Downloads/LMS/pages/dosen/dashboard/index.html) — Ringkasan beban mengajar, antrean bimbingan, dan agenda akademik.
- [Mata Kuliah Saya](file:///C:/Users/Lenovo/Downloads/LMS/pages/dosen/mata-kuliah/index.html) — Daftar kelas yang diampu pada semester berjalan.
- [Jadwal Mengajar](file:///C:/Users/Lenovo/Downloads/LMS/pages/dosen/jadwal/index.html) — Grid jadwal mengajar mingguan dan ruang laboratorium/teori.
- [Data Mahasiswa](file:///C:/Users/Lenovo/Downloads/LMS/pages/dosen/mahasiswa/index.html) — Direktori mahasiswa bimbingan akademik dan perwalian.
- [Input Nilai Mahasiswa](file:///C:/Users/Lenovo/Downloads/LMS/pages/dosen/input-nilai/index.html) — Lembar komputasi multi-komponen (Tugas 20%, Kuis 20%, UTS 25%, UAS 35%).
- [Input Presensi Perkuliahan](file:///C:/Users/Lenovo/Downloads/LMS/pages/dosen/presensi/index.html) — Manajemen absensi 16 pertemuan per sesi kuliah.
- [Validasi Nilai Kelas](file:///C:/Users/Lenovo/Downloads/LMS/pages/dosen/validasi-nilai/index.html) — Review final dan tanda tangan digital sebelum submit ke BAK.
- [Riwayat Penilaian Dosen](file:///C:/Users/Lenovo/Downloads/LMS/pages/dosen/riwayat-penilaian/index.html) — Arsip penilaian historis dari semester-semester sebelumnya.

### 4. Workspace Biro Administrasi Akademik & Kemahasiswaan / BAK (10 Halaman)
- [Dashboard Akademik BAK](file:///C:/Users/Lenovo/Downloads/LMS/pages/akademik/dashboard/index.html) — KPI kampus, total mahasiswa aktif, dosen, dan status semester.
- [Manajemen Mahasiswa](file:///C:/Users/Lenovo/Downloads/LMS/pages/akademik/mahasiswa/index.html) — Master data mahasiswa, filter angkatan, dan status registrasi.
- [Manajemen Dosen](file:///C:/Users/Lenovo/Downloads/LMS/pages/akademik/dosen/index.html) — Direktori tenaga pendidik, NIDN, jabatan fungsional, dan status aktif.
- [Manajemen Program Studi](file:///C:/Users/Lenovo/Downloads/LMS/pages/akademik/prodi/index.html) — Master data prodi, akreditasi BAN-PT/LAM, dan jenjang pendidikan.
- [Manajemen Mata Kuliah](file:///C:/Users/Lenovo/Downloads/LMS/pages/akademik/mata-kuliah/index.html) — Master kurikulum, bobot SKS teori/praktik, dan semester paket.
- [Manajemen FRS/KRS](file:///C:/Users/Lenovo/Downloads/LMS/pages/akademik/frs/index.html) — Monitoring pengisian kartu rencana studi dan pembukaan kuota kelas.
- [Antrean Validasi Nilai](file:///C:/Users/Lenovo/Downloads/LMS/pages/akademik/validasi-nilai/index.html) — Review kelengkapan nilai dari dosen pengampu sebelum publikasi.
- [Publikasi Nilai KHS](file:///C:/Users/Lenovo/Downloads/LMS/pages/akademik/publikasi-nilai/index.html) — Rilis resmi nilai semester ke mahasiswa secara massal/per prodi.
- [Perbaikan & Koreksi Nilai](file:///C:/Users/Lenovo/Downloads/LMS/pages/akademik/perbaikan-nilai/index.html) — Penanganan banding nilai pasca publikasi dengan audit trail lengkap.
- [Penerbitan KHS & Transkrip](file:///C:/Users/Lenovo/Downloads/LMS/pages/akademik/khs-transkrip/index.html) — Generator dokumen resmi, legalisir digital, dan cetak transkrip.

---

## 📐 Standar Kualitas Desain & Frontend (Zero Layout Shift)

Platform ini mengimplementasikan spesifikasi visual **FigCraft Design Tokens** secara ketat di seluruh 28 halaman:
- **Zero Horizontal Scrolling**: Diberlakukan `overflow-x: hidden !important` pada level `html` dan `body` untuk mengeliminasi glitch geser horizontal.
- **Fixed Sidebar**: Lebar `224px` presisi dengan status menu aktif (*emerald highlight* `#EBF5F0` & text `#237757`).
- **Fixed Topbar**: Tinggi `72px` dengan widget profil terstruktur, breadcrumb navigasi, dan indikator semester aktif.
- **Inner Canvas Width**: Maksimal `1136px` dengan padding deterministik `24px 32px 48px` untuk kenyamanan membaca di berbagai resolusi layar.
- **Ikon Murni SVG**: Menggunakan ikon SVG Feather/Heroicons tanpa dependensi emoji eksternal demi tampilan korporat yang profesional.

---

## ⚡ Petunjuk Menjalankan (Getting Started)

Proyek ini telah dikonfigurasi secara modular sehingga dapat dijalankan baik secara statis di browser maupun diintegrasikan ke dalam backend server:

1. **Jalankan Secara Statis (Client-Side)**:
   - Buka direktori proyek: `C:\Users\Lenovo\Downloads\LMS\`
   - Buka file [pages/auth/login.html](file:///C:/Users/Lenovo/Downloads/LMS/pages/auth/login.html) langsung di browser Chrome/Edge/Firefox.
   - Semua modul telah dihubungkan dengan navigasi antar-halaman yang saling terhubung.

2. **Jalankan Skrip Verifikasi Integritas**:
   Untuk memastikan seluruh 28 halaman bebas dari error broken links, layout shift, dan dependensi terlarang, jalankan:
   ```powershell
   python scratch/verify_entire_system.py
   ```

---
*© 2026 Universitas Fatmawati Digital (SIAK UFD) — Dikelola di bawah Lisensi SaaS Academic Enterprise.*
