# Data Flow Diagram (DFD)
# SIAK UFD — Cloud Academic ERP & Higher Education SaaS Platform

* **Document Version:** 2.0.0
* **Scope:** Aliran Data Antarmuka & Proses Bisnis Akademik Terpadu
* **Status:** Standardized Architecture

---

## 1. DFD Level 0 — Context Diagram (Diagram Konteks)

Diagram Konteks menggambarkan batasan sistem SIAK UFD, entitas eksternal (*External Entities*), serta aliran data masuk dan keluar secara global:

```mermaid
graph TD
    MHS["Mahasiswa (Student)"]
    DSN["Dosen (Lecturer / PA)"]
    BAK["Operator BAK (Academic Bureau)"]
    DIKTI["PDDIKTI Neofeeder (External API)"]

    SYS(("0.0<br/>SIAK UFD<br/>Cloud Academic SaaS"))

    %% Mahasiswa In/Out
    MHS -->|Pengajuan KRS, Cek Biodata, Permohonan Dokumen| SYS
    SYS -->|Jadwal Kuliah, Presensi, KHS Semester, Transkrip Sah| MHS

    %% Dosen In/Out
    DSN -->|Presensi Pertemuan, Input Nilai Berbobot, Kirim Validasi Nilai| SYS
    SYS -->|Jadwal Mengajar, Daftar Kelas, Rekap Mahasiswa, Status Validasi| DSN

    %% Operator BAK In/Out
    BAK -->|Master Data Prodi/Dosen/Mhs, Persetujuan KRS, Validasi Nilai, Publikasi, Revisi Nilai| SYS
    SYS -->|Antrean Validasi, Berkas KHS, Transkrip Digital, Laporan Rekap Kampus| BAK

    %% PDDIKTI In/Out
    SYS -->|Sync Mahasiswa, Kurikulum, KRS, Nilai, Status Lulus| DIKTI
    DIKTI -->|Konfirmasi Validasi Data Feeder| SYS
```

---

## 2. DFD Level 1 — Dekomposisi Proses Fungsional

DFD Level 1 memecah sistem SIAK UFD ke dalam 7 subsistem utama yang saling berinteraksi melalui *Data Store*:

```mermaid
graph TD
    MHS[Mahasiswa]
    DSN[Dosen]
    BAK[Operator BAK]

    %% Data Stores
    D1[(D1: Master Akademik & Tenant)]
    D2[(D2: Kelas & Jadwal)]
    D3[(D3: KRS & Rencana Studi)]
    D4[(D4: Presensi Kelas)]
    D5[(D5: Nilai & Komponen Mutu)]
    D6[(D6: Audit Revisi Nilai)]
    D7[(D7: Dokumen Sah KHS/Transkrip)]

    %% Processes
    P1(("1.0<br/>Autentikasi &<br/>Multi-Tenant RBAC"))
    P2(("2.0<br/>Manajemen Master Data<br/>& Kurikulum"))
    P3(("3.0<br/>Siklus Pengajuan &<br/>Verifikasi KRS"))
    P4(("4.0<br/>Perkuliahan &<br/>Presensi Mahasiswa"))
    P5(("5.0<br/>Penginputan &<br/>Perhitungan Nilai"))
    P6(("6.0<br/>Validasi, Publikasi<br/>& Revisi Nilai"))
    P7(("7.0<br/>Legalisasi Dokumen<br/>KHS & Transkrip"))

    %% Connections P1
    MHS & DSN & BAK -->|Kredensial Login & Captcha| P1
    P1 -->|Session Token & Hak Akses Portal| MHS & DSN & BAK

    %% Connections P2
    BAK -->|Master Prodi, Dosen, Mahasiswa, MK| P2
    P2 <-->|CRUD Master Data| D1

    %% Connections P3
    MHS -->|Pilih Mata Kuliah & Jadwal| P3
    P3 <-->|Validasi SKS & Kapasitas| D2
    P3 -->|Simpan Pengajuan KRS| D3
    BAK -->|Tinjau & Setujui KRS| P3
    P3 -->|Status KRS Disetujui| MHS

    %% Connections P4
    DSN -->|Input Kehadiran Pertemuan 1-16| P4
    P4 <-->|Cek Peserta Kelas| D3
    P4 -->|Simpan Rekap Presensi| D4
    P4 -->|Rekap Kehadiran %| MHS

    %% Connections P5
    DSN -->|Input Tugas, Kuis, UTS, UAS| P5
    P5 -->|Hitung Formula & Huruf Mutu| D5

    %% Connections P6
    DSN -->|Kirim Berkas Nilai Draft| P6
    P6 <-->|Ambil Nilai Kelas| D5
    BAK -->|Validasi Kelayakan Nilai| P6
    BAK -->|Rilis Publikasi Nilai| P6
    P6 -->|Update Nilai Terpublikasi| D5
    BAK -->|Eksekusi Perbaikan Nilai| P6
    P6 -->|Catat Audit Trail| D6

    %% Connections P7
    BAK & MHS -->|Request Dokumen Sah| P7
    P7 <-->|Ambil Nilai Kumulatif & IPK| D5
    P7 -->|Generate PDF + QR Signature| D7
    P7 -->|Unduh KHS & Transkrip| MHS & BAK
```

---

## 3. DFD Level 2 — Rincian Proses Kritis

### 3.1 DFD Level 2.3: Proses Siklus FRS / KRS Mahasiswa

```mermaid
graph LR
    MHS[Mahasiswa]
    BAK[Operator BAK]

    P31(("3.1<br/>Cek Batas SKS<br/>& Prasyarat MK"))
    P32(("3.2<br/>Pemilihan Kelas<br/>& Reservasi Kuota"))
    P33(("3.3<br/>Verifikasi Berkas<br/>oleh Operator BAK"))
    P34(("3.4<br/>Penguncian &<br/>Penerbitan Jadwal"))

    MHS -->|NIM & Rencana Semester| P31
    P31 -->|Kuota SKS Valid| P32
    P32 -->|Berkas KRS Menunggu| P33
    BAK -->|Setujui / Minta Revisi| P33
    P33 -->|KRS Terverifikasi| P34
    P34 -->|Jadwal Kuliah Aktif| MHS
```

### 3.2 DFD Level 2.6: Proses Validasi, Publikasi, & Perbaikan Nilai

```mermaid
graph TD
    DSN[Dosen Pengampu]
    BAK[Operator BAK]
    MHS[Mahasiswa]

    P61(("6.1<br/>Pemeriksaan Draft<br/>& Bobot Nilai 100%"))
    P62(("6.2<br/>Antrean Validasi<br/>Operator BAK"))
    P63(("6.3<br/>Publikasi Serentak<br/>ke Portal Mahasiswa"))
    P64(("6.4<br/>Audit Trail<br/>Perbaikan Nilai"))

    DSN -->|Kirim Nilai Kelas| P61
    P61 -->|Nilai Lengkap & Sesuai| P62
    BAK -->|Verifikasi Kelayakan| P62
    P62 -->|Status: Tervalidasi| P63
    BAK -->|Publikasikan Nilai| P63
    P63 -->|Nilai Muncul di KHS| MHS

    BAK -->|Pengajuan Perbaikan Nilai Resmi| P64
    P64 -->|Catat Nilai Awal vs Akhir + Alasan| P64
    P64 -->|Update Nilai Terkoreksi| P63
```

---

## 4. Aliran Data Masuk & Keluar (I/O Specification)

| Aliran Data (*Data Flow*) | Asal (*Source*) | Tujuan (*Destination*) | Deskripsi Data yang Dibawa |
|---|---|---|---|
| `df_krs_submission` | Mahasiswa | Database (`krs_submissions`) | NIM, Kode MK, ID Kelas, Semester, Total SKS, Timestamp pengajuan. |
| `df_attendance_record` | Dosen | Database (`attendances`) | ID Kelas, Nomor Pertemuan (1–16), NIM Mahasiswa, Status Kehadiran (Hadir/Izin/Sakit/Alpa), Catatan. |
| `df_grade_entry` | Dosen | Database (`grades`) | ID Kelas, NIM Mahasiswa, Nilai Tugas (20%), Kuis (20%), UTS (25%), UAS (35%), Nilai Akhir Angka, Nilai Huruf Mutu. |
| `df_validation_approval`| Operator BAK | Database (`grade_validations`) | ID Kelas, NIDN Dosen, Timestamp Validasi, Catatan Verifikasi Kelayakan. |
| `df_grade_publication` | Operator BAK | Database (`grade_publications`)| ID Kelas, Periode Akademik, Status Terpublikasi, Tanggal Rilis. |
| `df_grade_revision_log`| Operator BAK | Database (`grade_revisions`) | NIM, Mata Kuliah, Nilai Awal, Nilai Usulan, Alasan Perubahan, ID Validator BAK. |
| `df_digital_document` | Database | Mahasiswa / BAK | Lembar PDF KHS/Transkrip, Nomor Legalisasi Resmi (TR-2026), QR-Code Hash Verifikasi. |
