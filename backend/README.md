# SIAK UFD Backend API Service
**Enterprise Academic ERP & Multi-Tenant SaaS REST API**  
*Universitas Fatmawati Digital (SIAK UFD)*

---

## 🏛️ Arsitektur & Teknologi

Backend dibangun menggunakan **Node.js & Express** mengadopsi prinsip **Clean Architecture**:
- **Layer Controller**: Menangani parsing request dan formatting respon HTTP envelope (`success`, `code`, `message`, `data`, `meta`).
- **Layer Service**: Logika bisnis murni (kalkulasi bobot formula $\text{Tugas } 20\% + \text{Kuis } 20\% + \text{UTS } 25\% + \text{UAS } 35\%$, validasi batas SKS berbasis IPS, aturan presensi $75\%$ kelayakan UAS, tanda tangan SHA-256 verifikasi QR).
- **Layer Repository**: Abstraksi akses basis data dengan persistensi otomatis ke `src/data/db.json` (mendukung integrasi PostgreSQL).
- **Middlewares**: Isolasi multi-tenant (`X-Tenant-ID`), RBAC role check, dan format error standar **RFC 7807 Problem Details**.

---

## 🚀 Cara Menjalankan Backend

1. Buka terminal di folder backend:
   ```bash
   cd backend
   ```
2. Jalankan server:
   ```bash
   npm start
   ```
   Server aktif di `http://localhost:5000`.
3. Endpoint Health Check:
   ```bash
   curl http://localhost:5000/api/v1/health
   ```

---

## 📡 Daftar Modul Endpoint (Sesuai `docs/API_SPEC.md`)

| Modul | Endpoint Utama | Deskripsi |
|---|---|---|
| **Autentikasi** | `POST /api/v1/auth/login` | Penerbitan token sesi dan verifikasi role |
| **Mahasiswa** | `GET /api/v1/students/:nim` | Profil lengkap dan status akademik |
| **Kelayakan SKS** | `GET /api/v1/students/:nim/eligibility` | Kalkulasi batas SKS semester baru |
| **Katalog Kelas** | `GET /api/v1/classes/available` | Daftar kelas, sisa kuota, dan jadwal |
| **Pengajuan KRS** | `POST /api/v1/krs/submissions` | Pengajuan rencana studi ke Dosen PA |
| **Presensi Sesi** | `POST /api/v1/lectures/attendance/check-in` | Presensi mahasiswa & rekapitulasi 16 sesi |
| **Token QR Sesi** | `GET /api/v1/lectures/sessions/:id/qr-token` | Token QR dinamis 30 detik |
| **Penilaian Dosen**| `PUT /api/v1/classes/:id/grades/draft` | Simpan draft dan komputasi otomatis NA |
| **Validasi Nilai** | `GET /api/v1/bak/validation-queue` | Antrean kelas menunggu verifikasi BAK |
| **Publikasi KHS** | `POST /api/v1/bak/publications/batch` | Rilis resmi nilai semester ke mahasiswa |
| **Audit Koreksi** | `POST /api/v1/bak/grade-revisions/execute` | Eksekusi revisi nilai dengan audit trail |
| **Dokumen KHS** | `GET /api/v1/documents/khs/:nim` | Rekapitulasi KHS dan tanda tangan hash QR |
