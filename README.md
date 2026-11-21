# SIAK UFD Enterprise SaaS (Frontend & Backend)
**Sistem Informasi Akademik Universitas Fatmawati Digital**  
*Next-Generation Multi-Tenant Academic ERP & Education SaaS Monorepo*

---

## 🏛️ Arsitektur Monorepo: Frontend & Backend

Proyek ini telah direstrukturisasi secara profesional menjadi arsitektur terpisah **Frontend & Backend** dengan standar *Clean Architecture*, *Zero Layout Shift*, dan *Multi-Tenancy*:

```
LMS/
├── backend/                       # RESTful API Service (Node.js + Express)
│   ├── src/
│   │   ├── config/                # Konfigurasi server & tenant
│   │   ├── controllers/           # REST API Request/Response handlers
│   │   ├── data/                  # Basis data JSON terstruktur (db.json)
│   │   ├── middlewares/           # Tenant scoping, Auth RBAC, Error RFC 7807
│   │   ├── repositories/          # Abstraksi akses data & persistensi
│   │   ├── routes/                # Endpoint RESTful API (v1)
│   │   ├── services/              # Domain logic (SKS rules, formula nilai, presensi 75%)
│   │   └── server.js              # Entry point Express API (Port 5000)
│   ├── package.json
│   └── README.md
│
├── frontend/                      # Web Client (28 Modul Halaman Lengkap)
│   ├── css/                       # Design tokens, navbar, dan layout
│   ├── js/
│   │   ├── api-client.js          # Adaptor API ke http://localhost:5000/api/v1 (Auto Offline Fallback)
│   │   ├── data.js                # State store & persistensi lokal
│   │   └── app.js                 # Kontroler UI
│   ├── pages/                     # 28 Halaman produksi (Auth, Mahasiswa, Dosen, BAK)
│   ├── index.html                 # Smart Gateway & role router
│   ├── package.json
│   └── README.md
│
├── docs/                          # Dokumentasi Enterprise 11 Berkas
│   ├── PRD.md                     # Product Requirements Document
│   ├── USECASE.md                 # Use Case Diagrams & Specifications
│   ├── ACTIVITY.md                # 10 Activity Diagrams per aktivitas
│   ├── WORKFLOW.md                # Business Workflows & State Machines
│   ├── ERD.md                     # Entity Relationship Diagram Multi-Tenant
│   ├── DFD.md                     # Data Flow Diagram (Level 0, 1, 2)
│   ├── ARCHITECTURE.md            # Clean Architecture & System Design
│   ├── API_SPEC.md                # RESTful API Specification
│   ├── TESTING.md                 # QA Test Verification Matrix
│   ├── DESIGN.md                  # FigCraft UI Design System
│   └── SUPABASE_SETUP.md          # Panduan Setup PostgreSQL & Supabase Cloud
│
├── supabase/                      # Skrip Database & Migrasi Cloud
│   └── migrations/
│       └── 20261121_init_siak_schema.sql  # Skrip DDL 12 Tabel, RLS & Seed Data Otomatis
│
├── scripts/
│   └── dev.js                     # Script runner bersama Frontend (3000) & Backend (5000)
├── package.json                   # Root monorepo script runner
└── README.md                      # Dokumentasi utama proyek
```

---

## ⚡ Petunjuk Menjalankan (Quickstart)

### 1. Menjalankan Sekaligus (Frontend + Backend)
Cukup jalankan dari root direktori:
```bash
npm run dev
```
- **Backend API**: Berjalan di `http://localhost:5000` (Health: `http://localhost:5000/api/v1/health`).
- **Frontend Client**: Berjalan di `http://localhost:3000`.

---

### 2. Menjalankan Backend Saja
```bash
npm run backend
```
Akses API pada `http://localhost:5000/api/v1`.

---

### 3. Menjalankan Frontend Saja
```bash
npm run frontend
```
Atau buka file [frontend/index.html](file:///C:/Users/Lenovo/Downloads/LMS/frontend/index.html) atau [index.html](file:///C:/Users/Lenovo/Downloads/LMS/index.html) langsung di browser Chrome/Edge (berfungsi 100% tanpa perlu server berkat fitur *Automatic Offline Fallback*).

---

### 4. Menjalankan Pengujian Backend
```bash
npm run test:backend
```
Memverifikasi endpoint Health, Katalog Kelas, Profil Mahasiswa, dan Penerbitan Dokumen KHS ber-QR Code dengan hasil **100% PASS**.

---

## 🧭 Peta Modul Antarmuka (28 Halaman)

1. **Autentikasi (1 Halaman)**:
   - [Portal Masuk SSO Terpadu](file:///C:/Users/Lenovo/Downloads/LMS/frontend/pages/auth/login/index.html)
2. **Workspace Mahasiswa (9 Halaman)**:
   - [Dashboard](file:///C:/Users/Lenovo/Downloads/LMS/frontend/pages/mahasiswa/dashboard/index.html), [Jadwal Kuliah](file:///C:/Users/Lenovo/Downloads/LMS/frontend/pages/mahasiswa/jadwal/index.html), [Rencana Studi (KRS)](file:///C:/Users/Lenovo/Downloads/LMS/frontend/pages/mahasiswa/frs/index.html), [Kartu Hasil Studi (KHS)](file:///C:/Users/Lenovo/Downloads/LMS/frontend/pages/mahasiswa/khs/index.html), [Transkrip Akademik](file:///C:/Users/Lenovo/Downloads/LMS/frontend/pages/mahasiswa/transkrip/index.html), [Presensi](file:///C:/Users/Lenovo/Downloads/LMS/frontend/pages/mahasiswa/matakuliah/index.html), [Kurikulum](file:///C:/Users/Lenovo/Downloads/LMS/frontend/pages/mahasiswa/matakuliah/index.html), [Biodata](file:///C:/Users/Lenovo/Downloads/LMS/frontend/pages/mahasiswa/biodata/index.html), [Pengumuman](file:///C:/Users/Lenovo/Downloads/LMS/frontend/pages/mahasiswa/pengumuman/index.html).
3. **Workspace Dosen (8 Halaman)**:
   - [Dashboard](file:///C:/Users/Lenovo/Downloads/LMS/frontend/pages/dosen/dashboard/index.html), [Mata Kuliah](file:///C:/Users/Lenovo/Downloads/LMS/frontend/pages/dosen/matakuliah/index.html), [Jadwal Mengajar](file:///C:/Users/Lenovo/Downloads/LMS/frontend/pages/dosen/jadwal/index.html), [Data Mahasiswa](file:///C:/Users/Lenovo/Downloads/LMS/frontend/pages/dosen/mahasiswa/index.html), [Input Nilai](file:///C:/Users/Lenovo/Downloads/LMS/frontend/pages/dosen/input-nilai/index.html), [Input Presensi](file:///C:/Users/Lenovo/Downloads/LMS/frontend/pages/dosen/presensi/index.html), [Validasi Nilai](file:///C:/Users/Lenovo/Downloads/LMS/frontend/pages/dosen/validasi-nilai/index.html), [Riwayat Penilaian](file:///C:/Users/Lenovo/Downloads/LMS/frontend/pages/dosen/riwayat-penilaian/index.html).
4. **Workspace Operator BAK (10 Halaman)**:
   - [Dashboard](file:///C:/Users/Lenovo/Downloads/LMS/frontend/pages/akademik/dashboard/index.html), [Mahasiswa](file:///C:/Users/Lenovo/Downloads/LMS/frontend/pages/akademik/mahasiswa/index.html), [Dosen](file:///C:/Users/Lenovo/Downloads/LMS/frontend/pages/akademik/dosen/index.html), [Program Studi](file:///C:/Users/Lenovo/Downloads/LMS/frontend/pages/akademik/program-studi/index.html), [Mata Kuliah](file:///C:/Users/Lenovo/Downloads/LMS/frontend/pages/akademik/matakuliah/index.html), [FRS/KRS](file:///C:/Users/Lenovo/Downloads/LMS/frontend/pages/akademik/frs-krs/index.html), [Validasi Nilai](file:///C:/Users/Lenovo/Downloads/LMS/frontend/pages/akademik/validasi-nilai/index.html), [Publikasi Nilai](file:///C:/Users/Lenovo/Downloads/LMS/frontend/pages/akademik/publikasi-nilai/index.html), [Perbaikan Nilai](file:///C:/Users/Lenovo/Downloads/LMS/frontend/pages/akademik/perbaikan-nilai/index.html), [KHS & Transkrip](file:///C:/Users/Lenovo/Downloads/LMS/frontend/pages/akademik/khs-transkrip/index.html).

---
*© 2026 Universitas Fatmawati Digital (SIAK UFD) — Multi-Tenant Academic ERP & SaaS Platform.*
