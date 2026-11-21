# SIAK UFD Enterprise SaaS - Panduan Integrasi Supabase
**Panduan Setup Basis Data PostgreSQL, Row Level Security & SDK Supabase**  
*Universitas Fatmawati Digital (SIAK UFD) — Multi-Tenant Academic ERP SaaS*

---

## 1. Mengapa Supabase adalah Pilihan Tepat?

Menggunakan **Supabase** untuk proyek SIAK UFD adalah keputusan arsitektur yang sangat tepat karena:
1. **PostgreSQL Murni (Production-Grade)**: Menjalankan PostgreSQL 15+ dengan performa tinggi, indeks B-Tree, integritas referensial, dan transaksi ACID.
2. **Row Level Security (RLS) Multi-Tenant Bawaan**: Isolasi data antar-kampus (*tenant isolation*) ditegakkan langsung di level kernel basis data via klausa `tenant_id`.
3. **Realtime WebSockets**: Pembaruan data instan untuk pemindaian QR Presensi per 30 detik dan pengumuman nilai mahasiswa secara langsung tanpa reload halaman.
4. **Supabase Storage**: Bucket S3-compatible untuk menyimpan arsip PDF resmi KHS, lembar ujian, dan transkrip bertanda tangan digital.
5. **Autentikasi Enterprise**: Mendukung JWT, OAuth SSO, dan penguncian sesi aman.

---

## 2. Langkah-Langkah Pengaturan (Step-by-Step Setup)

### Langkah 1: Buat Proyek Baru di Supabase
1. Kunjungi [https://supabase.com](https://supabase.com) dan masuk menggunakan akun GitHub atau Email Anda.
2. Klik tombol **New Project**.
3. Isi informasi proyek:
   - **Name**: `siak-ufd-production` (atau sesuai nama kampus Anda).
   - **Database Password**: Buat password yang kuat dan simpan dengan aman.
   - **Region**: Pilih `Singapore (ap-southeast-1)` untuk latensi terendah dari Indonesia (< 25ms).
4. Klik **Create new project** dan tunggu sekitar 1-2 menit hingga server PostgreSQL aktif.

---

### Langkah 2: Jalankan Skrip Migrasi SQL (1-Click Schema & Seed)
1. Buka dashboard proyek Supabase Anda.
2. Di menu navigasi sebelah kiri, klik tab **SQL Editor**.
3. Klik tombol **+ New query**.
4. Buka berkas migrasi yang telah kita siapkan di repositori:  
   [`supabase/migrations/20261121_init_siak_schema.sql`](file:///C:/Users/Lenovo/Downloads/LMS/supabase/migrations/20261121_init_siak_schema.sql).
5. Salin (*copy*) seluruh isi berkas tersebut dan tempel (*paste*) ke dalam SQL Editor Supabase.
6. Klik tombol **Run** (atau tekan `Ctrl + Enter`).
7. Anda akan melihat pesan `Success. No rows returned`. Seluruh 12 tabel multi-tenant, aturan RLS, dan data awal (*seed data*) telah berhasil dibuat secara otomatis di Supabase!

---

### Langkah 3: Konfigurasi Kredensial di Backend
1. Di dashboard Supabase, buka menu **Project Settings** (ikon gerigi di kiri bawah) $\to$ klik tab **API**.
2. Anda akan menemukan:
   - **Project URL**: Format `https://[project-ref].supabase.co`
   - **Project API keys**:
     - `anon` `public` key
     - `service_role` `secret` key
3. Buka berkas [`backend/.env`](file:///C:/Users/Lenovo/Downloads/LMS/backend/.env) di repositori lokal Anda, lalu masukkan kredensial tersebut:
   ```env
   PORT=5000
   NODE_ENV=development

   # KREDENSIAL SUPABASE ANDA
   SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   JWT_SECRET=siak-ufd-super-secret-jwt-key-2026
   DEFAULT_TENANT_ID=a1b2c3d4-e5f6-7890-abcd-ef1234567890
   ```
4. Simpan berkas `.env`.

---

### Langkah 4: Uji Koneksi Backend ke Supabase
Jalankan server backend:
```bash
npm run backend
```
Jika kredensial valid, backend akan menampilkan log:
```
⚡ [Supabase] Connected to Supabase Cloud Database at: https://xxxxxxxxxxxx.supabase.co
🚀 SIAK UFD Backend API Server running at http://localhost:5000
```

*(Catatan: Jika berkas `.env` belum diisi, sistem secara otomatis berjalan dalam mode **Hybrid Local Fallback** menggunakan basis data lokal sehingga aplikasi Anda tidak akan pernah mogok saat proses pengembangan).*

---

## 3. Struktur Tabel yang Dibuat di Supabase

| Nama Tabel | Peran & Deskripsi Fungsional |
|---|---|
| `public.tenants` | Master institusi / penyewa SaaS (Universitas, Politeknik, Sekolah Tinggi) |
| `public.profiles` | Profil pengguna sistem (Mahasiswa, Dosen, Operator BAK, Superadmin) |
| `public.departments` | Master Program Studi dan Fakultas |
| `public.students` | Master data mahasiswa, IPS semester lalu, batas SKS, dan IPK |
| `public.lecturers` | Master data dosen pengampu dan penugasan Dosen PA |
| `public.courses` | Katalog kurikulum mata kuliah, prasyarat, dan bobot SKS |
| `public.classes` | Kelas perkuliahan yang dibuka, jadwal, ruang, kuota, dan status penilaian |
| `public.krs_enrollments` | Rencana studi mahasiswa dan status persetujuan DPA |
| `public.attendances` | Rekapitulasi presensi 16 sesi dan status gerbang kelayakan UAS |
| `public.grades` | Nilai multi-komponen (Tugas, Kuis, UTS, UAS, Nilai Akhir, Huruf Mutu) |
| `public.grade_revisions` | Jejak audit permanen (*immutable audit trail*) koreksi nilai resmi |
| `public.announcements` | Pengumuman akademik kampus |

---

## 4. Keamanan: Row Level Security (RLS) di Supabase

Seluruh tabel telah dilengkapi dengan fitur **Row Level Security (RLS)** yang diaktifkan secara otomatis. Di lingkungan produksi, data mahasiswa dari Universitas A **mustahil bocor** ke Universitas B karena seluruh query SQL secara implisit disaring menggunakan kebijakan:
```sql
CREATE POLICY tenant_isolation_policy ON public.students
    FOR ALL
    USING (tenant_id = auth.jwt() ->> 'tenant_id');
```

---
*Dokumen ini merupakan spesifikasi resmi setup Supabase untuk platform SIAK UFD Enterprise SaaS.*
