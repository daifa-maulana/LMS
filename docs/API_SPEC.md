# SIAK UFD Enterprise SaaS - RESTful API Specification
**Spesifikasi Antarmuka Pemrograman Aplikasi (REST API Specification)**  
*Universitas Fatmawati Digital (SIAK UFD) — Multi-Tenant Academic ERP SaaS*

---

## 1. Konvensi Global API (Global API Conventions)

### 1.1 Base URL & Versi
Seluruh endpoint API berada di bawah prefix versi dan scoped tenant:
```
https://api.siak.ufd.ac.id/api/v1/tenants/{tenant_id}
```

### 1.2 Format Header Permintaan (Request Headers)
| Header | Tipe | Keterangan | Wajib? |
|---|---|---|:---:|
| `Authorization` | String | Format: `Bearer <JWT_ACCESS_TOKEN>` | Ya (Kecuali login) |
| `Content-Type` | String | `application/json` | Ya |
| `X-Tenant-ID` | UUID | Identifier tenant universitas (`ten-ufd-prod`) | Ya |
| `X-Client-Version` | String | Versi frontend klien (misal: `1.0.0`) | Opsional |
| `X-Idempotency-Key` | UUID | Kunci idempoten untuk mutasi penting | Ya (KRS & Nilai) |

### 1.3 Struktur Format Respon Standar (Standard Response Envelopes)
#### A. Respon Sukses (200 OK, 201 Created)
```json
{
  "success": true,
  "code": 200,
  "message": "Operasi berhasil dieksekusi",
  "data": { ... },
  "meta": {
    "page": 1,
    "per_page": 25,
    "total_records": 128,
    "total_pages": 6,
    "timestamp": "2026-11-18T08:00:00Z"
  }
}
```

#### B. Respon Kesalahan (RFC 7807 Problem Details)
```json
{
  "success": false,
  "code": 422,
  "error_type": "BUSINESS_RULE_VIOLATION",
  "title": "Batas SKS Terlampaui",
  "detail": "Mahasiswa hanya diizinkan mengambil maksimal 20 SKS berdasarkan IPS semester lalu (2.85).",
  "instance": "/api/v1/tenants/ten-ufd-prod/krs/submissions",
  "invalid_params": [
    { "field": "total_sks", "reason": "Total SKS diajukan (22) melebihi batas (20)" }
  ]
}
```

---

## 2. Katalog Endpoint Utama (Core Endpoints)

### 2.1 Modul Autentikasi & Sesi
- `POST /auth/login`: Otentikasi identitas, resolusi tenant, dan penerbitan token JWT.
- `POST /auth/refresh`: Memperbarui token akses menggunakan Refresh Token.
- `POST /auth/logout`: Menghapus sesi dari Redis dan membatalkan token.
- `POST /auth/switch-role`: Berganti peran aktif (misal dari Dosen Pengampu ke DPA atau Kaprodi).

### 2.2 Modul Rencana Studi (KRS)
- `GET /students/{nim}/krs-eligibility`: Mengambil data batas SKS dan status prasyarat mahasiswa.
- `GET /classes/available`: Mengambil katalog kelas yang dibuka beserta sisa kuota kursi.
- `POST /krs/submissions`: Mengajukan rancangan KRS mahasiswa ke Dosen PA.
- `GET /dpa/krs-approvals`: Mengambil daftar antrean pengajuan KRS mahasiswa bimbingan.
- `PATCH /dpa/krs-approvals/{submission_id}`: Menyetujui atau meminta revisi pengajuan KRS.

### 2.3 Modul Perkuliahan & Presensi
- `POST /lectures/sessions`: Dosen membuka sesi perkuliahan (ke-1 s/d ke-16) dan membangkitkan QR dinamis.
- `GET /lectures/sessions/{session_id}/qr-token`: Mendapatkan token QR dinamis (berganti tiap 30 detik).
- `POST /lectures/attendance/check-in`: Mahasiswa melakukan presensi mandiri (scan QR / koordinat GPS).
- `POST /lectures/attendance/manual-batch`: Dosen melakukan pengisian presensi secara massal.
- `GET /students/{nim}/attendance-summary`: Mengambil ringkasan persentase kehadiran per mata kuliah.

### 2.4 Modul Penilaian (Dosen Pengampu)
- `GET /classes/{class_id}/grade-sheet`: Mengambil lembar daftar nilai seluruh mahasiswa di kelas.
- `PUT /classes/{class_id}/grade-sheet/draft`: Menyimpan draft nilai komponen (Tugas, Kuis, UTS, UAS).
- `POST /classes/{class_id}/grade-sheet/submit`: Mengunci nilai kelas dan mengirimkannya ke validasi BAK.

### 2.5 Modul Validasi & Publikasi Nilai (Operator BAK)
- `GET /bak/grade-validations/queue`: Mengambil antrean kelas yang menunggu verifikasi nilai.
- `POST /bak/grade-validations/{class_id}/approve`: Menyetujui nilai kelas (status berubah ke `VALIDATED`).
- `POST /bak/grade-validations/{class_id}/reject`: Menolak nilai kelas disertai alasan berita acara revisi.
- `POST /bak/grade-publications/batch`: Mempublikasikan seluruh kelas yang telah divalidasi ke KHS mahasiswa.

### 2.6 Modul Perbaikan Nilai & Audit Trail
- `POST /grade-revisions/petitions`: Mengajukan permohonan banding perbaikan nilai pasca publikasi.
- `PATCH /grade-revisions/petitions/{petition_id}/approve`: Persetujuan berjenjang Kaprodi dan Dekan.
- `POST /grade-revisions/petitions/{petition_id}/execute`: Operator BAK mengeksekusi override nilai (otomatis tercatat di `grade_audit_logs`).
- `GET /grade-revisions/audit-logs`: Menampilkan jejak riwayat perubahan nilai untuk keperluan audit BAN-PT.

### 2.7 Modul Dokumen Akademik & Verifikasi QR
- `GET /documents/khs/{nim}/{semester_id}/pdf`: Mengunduh berkas PDF resmi KHS bertanda tangan digital.
- `GET /documents/transcript/{nim}/pdf`: Mengunduh berkas PDF Transkrip Akademik Kumulatif.
- `GET /public/verify/{document_hash}`: Endpoint publik tanpa otentikasi untuk memverifikasi keabsahan dokumen via pemindaian kode QR.

### 2.8 Modul Sinkronisasi PDDIKTI NeoFeeder
- `POST /pddikti/sync/curriculum`: Memicu sinkronisasi data kurikulum dan mata kuliah.
- `POST /pddikti/sync/krs`: Memicu sinkronisasi KRS kelas mahasiswa.
- `POST /pddikti/sync/grades`: Memicu sinkronisasi nilai akhir semester.
- `POST /pddikti/sync/akm`: Memicu sinkronisasi Aktivitas Kuliah Mahasiswa (IPS, IPK, SKS).
- `GET /pddikti/sync/logs`: Mengambil riwayat pengiriman data dan daftar error dari NeoFeeder API.

---
*Dokumen ini merupakan acuan formal integrasi antarmuka backend dan frontend SIAK UFD Enterprise SaaS.*
