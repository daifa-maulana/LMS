# Roadmap & Task Checklist (TODO.md)
## SIAK UFD Dashboard Project

---

### Fase 1: Perancangan Arsitektur & Basis Data (Selesai ✅)
- [x] Analisis diagram relasional PDM & ERD (`BAK`, `PRODI`, `DOSEN`, `MAHASISWA`, `MATA_KULIAH`, `FRS`).
- [x] Pemetaan aliran data sistem DFD Level 0 (Context Diagram) & DFD Level 1 (Proses 1.0 s/d 8.0).
- [x] Pembuatan script DDL & DML terstandar (`schema.sql`) dengan integritas referensial dan formula nilai otomatis.
- [x] Pembuatan dokumen PRD komprehensif (`docs/PRD.md`).
- [x] Pembuatan kamus data lengkap (`docs/DATABASE.md`).

---

### Fase 2: Implementasi Antarmuka UI/UX (Selesai ✅)
- [x] Pembuatan struktur HTML terpisah (`index.html`).
- [x] Styling CSS modern terpisah (`css/styles.css`) dengan tema *Soft-Curved Violet* mengacu pada referensi:
  - [x] Left Curved Sidebar dengan indikator aktif & avatar.
  - [x] Top Navigation Bar dengan pencarian dinamis, theme toggle, dan role switcher.
  - [x] Hero Header dengan greeting personal dan kartu ilustrasi outline (*Stay organized, Sync notes, Collaborate*).
  - [x] 3-Column Grid Modular Widget (Notifikasi, Mata Kuliah Aktif, Kalender Timeline, Circular Gauges IPK & SKS, Promo Card Otorisasi BAK, dan Rapat Yudisium).
  - [x] Dukungan tema Gelap & Terang (*Dark Mode* / *Light Mode*) yang persisten.
- [x] Desain sistem responsif untuk berbagai resolusi layar.

---

### Fase 3: Logika Bisnis & Mesin Basis Data JavaScript (Selesai ✅)
- [x] Implementasi mesin database simulasi (`js/db.js`):
  - [x] Penyimpanan persisten via browser `localStorage`.
  - [x] Logika pembobotan nilai otomatis (Absen 10%, Attitude 10%, Quiz 15%, Tugas 20%, UTS 20%, UAS 25%).
  - [x] Konversi huruf mutu (A s/d E) dan konversi bobot (4.0 s/d 0.0).
  - [x] Otomasi kalkulasi IPS dan IPK berbobot SKS.
  - [x] Logika CRUD untuk FRS, nilai, mata kuliah, dan mahasiswa.
  - [x] Sistem pencatatan Audit Log (DFD 8.0).
- [x] Implementasi pengontrol aplikasi (`js/app.js`):
  - [x] Pengalih peran multi-aktor (Mahasiswa, Dosen, Operator BAK, Admin IT).
  - [x] Modal interaktif input nilai dengan *live score preview*.
  - [x] Modal pendaftaran FRS baru.
  - [x] Fitur validasi dan publikasi masal nilai oleh BAK.
  - [x] Ekspor basis data ke format JSON (`.json`).
  - [x] Pencarian langsung (*real-time filter*).
  - [x] Tampilan cetak KHS (*print-friendly view*).

---

### Fase 4: Pengembangan Lanjutan / Backlog Masa Depan (Rencana Mendatang 🚀)
- [ ] Integrasi backend RESTful API menggunakan Express.js / FastAPI / Laravel.
- [ ] Koneksi basis data live ke PostgreSQL / MySQL menggunakan script `schema.sql`.
- [ ] Otentikasi multi-user dengan JWT (JSON Web Tokens) dan proteksi rute berbasis peran (*Role-Based Access Control*).
- [ ] Fitur ekspor laporan KHS dan Transkrip ke format file PDF resmi dengan barcode tanda tangan digital BAK.
- [ ] Fitur impor nilai massal dari file spreadsheet Excel (`.xlsx`).
- [ ] Notifikasi email atau WhatsApp Gateway untuk pengumuman publikasi nilai ke mahasiswa.

