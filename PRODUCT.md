# PRODUCT.md — SIAK UFD Enterprise SaaS
*Captured via `pbakaus/impeccable` & `dietrichgebert/ponytail` (YAGNI & Domain Grounding)*

## 1. Product Vision
SIAK UFD (Sistem Informasi Akademik — Universitas Fatmawati Digital) adalah platform tata kelola akademik terintegrasi multi-peran (Mahasiswa, Dosen, dan Biro Administrasi Akademik / BAK) yang mengutamakan integritas data, siklus hidup perkuliahan yang presisi, dan penerbitan berkas resmi (KRS, KHS, Transkrip) dalam format nyata (.pdf, .doc, .html).

---

## 2. Core User Roles & Workflows

### A. Mahasiswa (Student Portal)
- **Dashboard & Biodata:** Informasi IPK, SKS tempuh, status akademik aktif.
- **FRS $\rightarrow$ KRS Lifecycle:**
  - Saat periode buka & belum di-ACC: Mode edit FRS (tambah/hapus mata kuliah hingga batas SKS berdasarkan IPS sebelumnya).
  - Saat di-ACC Dosen Wali / periode tutup: FRS terkunci definitif $\rightarrow$ Dokumen KRS resmi diterbitkan.
- **Hasil Studi & KHS:** Kartu Hasil Studi semester berjalan dengan nilai terpublikasi.
- **Transkrip Akademik:** Rekapitulasi kumulatif seluruh semester dengan predikat kelulusan.

### B. Dosen (Lecturer Portal)
- **Jadwal Mengajar & Kelas Binaan:** Daftar kelas perkuliahan aktif.
- **Input & Perhitungan Nilai Otomatis:**
  $$\text{Nilai Akhir (NA)} = (\text{Tugas} \times 20\%) + (\text{Kuis} \times 20\%) + (\text{UTS} \times 25\%) + (\text{UAS} \times 35\%)$$
- **Presensi Mahasiswa:** Gatekeeper kehadiran minimum 75% untuk kelayakan mengikuti UAS.
- **Approval FRS (Dosen Wali / PA):** Menyetujui rencana studi mahasiswa bimbingan untuk menerbitkan KRS.

### C. Biro Administrasi Akademik (BAK / Admin Portal)
- **Validasi Nilai Dosen:** Review draft nilai kelas dari dosen pengampu (`VALIDATED`).
- **Publikasi Massal:** Mengunci dan merilis nilai ke KHS mahasiswa (`PUBLISHED`).
- **Perbaikan Nilai Pasca-Publikasi:** Tata kelola audit trail perbaikan nilai resmi (Petisi $\rightarrow$ Review $\rightarrow$ Eksekusi).

---

## 3. Storage & Architecture Strategy (Ponytail / YAGNI Compliance)
- **Local-First & Single Source of Truth:** `siak-storage.js` mengelola state terpusat dengan fallback memori yang aman.
- **Hybrid Supabase Sync:** Berfungsi mandiri tanpa ketergantungan cloud, siap tersambung ke PostgreSQL Supabase saat kredensial ditambahkan.
- **Format Output Fisik Nyata:** Menghasilkan dokumen A4 PDF berbasis Chromium Engine dan dokumen Microsoft Word (.doc) terstruktur Office XML.
