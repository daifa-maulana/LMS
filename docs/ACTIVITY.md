# SIAK UFD Enterprise SaaS - Activity Diagrams per Activity
**Kumpulan Diagram Aktivitas Terperinci (UML Activity Diagrams)**  
*Universitas Fatmawati Digital (SIAK UFD) — Multi-Tenant Academic ERP SaaS*

---

## 1. Ikhtisar Diagram Aktivitas (Activity Diagrams Overview)

Dokumen ini memetakan seluruh aktivitas operasional utama di dalam platform **SIAK UFD Enterprise SaaS** menggunakan standar **UML Activity Diagram** dengan pemisahan peran (*Swimlane / Partition*) yang jelas antara:
- **Mahasiswa**
- **Dosen (Pengampu & PA)**
- **Operator BAK**
- **Pimpinan (Kaprodi & Dekan)**
- **Sistem Inti (Academic Engine, Database & Gateway)**

---

## 2. Activity 1: Autentikasi Pengguna & Resolusi Multi-Tenant

Memodelkan proses login terpadu, verifikasi keamanan bertingkat, penentuan tenant universitas, dan navigasi peran dinamis.

```mermaid
flowchart TD
    subgraph User_Lane ["Pengguna (Mahasiswa / Dosen / BAK)"]
        A1([Mulai: Buka Halaman Login]) --> A2[Masukkan Kredensial NIM/NIDN, Sandi & Role]
        A2 --> A3[Klik Tombol 'Masuk Portal']
        A8[Pilih Peran Aktif]
        A10[Akses Dashboard Sesuai Role]
        A_Fail[Tampilkan Pesan Kesalahan]
    end

    subgraph System_Lane ["Sistem Autentikasi & Security Engine"]
        A3 --> B1{Verifikasi Format & Sanitasi Input}
        B1 -->|Tidak Valid| A_Fail
        B1 -->|Valid| B2[Cari Data Pengguna Berdasarkan Tenant ID]
        B2 --> B3{Kredensial Cocok?}
        B3 -->|Tidak Cocok| B4[Catat Upaya Gagal di Audit Log]
        B4 --> B5{Gagal >= 5 Kali?}
        B5 -->|Ya| B6[Kunci Akun Sementara 15 Menit] --> A_Fail
        B5 -->|Tidak| A_Fail
        B3 -->|Cocok| B7[Periksa Status Keaktifan Akun]
        B7 -->|Non-Aktif / Suspended| A_Fail
        B7 -->|Aktif| B8{Pengguna Memiliki Banyak Role?}
        B8 -->|Ya| A8 --> B9[Set Konteks Role Terpilih]
        B8 -->|Tidak| B9
        B9 --> B10[Generate JWT Access Token & Refresh Token]
        B10 --> B11[Simpan Sesi ke Redis In-Memory Cache]
        B11 --> A10
    end
```

---

## 3. Activity 2: Pengisian & Validasi Kartu Rencana Studi (KRS)

Memodelkan pemilihan kelas mata kuliah oleh mahasiswa, pengecekan prasyarat & beban SKS secara otomatis, hingga persetujuan Dosen PA.

```mermaid
flowchart TD
    subgraph Mhs_Lane ["Mahasiswa"]
        M1([Mulai: Periode KRS Terbuka]) --> M2[Buka Halaman Rencana Studi]
        M4[Pilih Mata Kuliah & Jadwal Kelas]
        M6[Submit Pengajuan KRS ke DPA]
        M_Rev[Perbaiki Pemilihan Mata Kuliah]
        M_End([KRS Sah: Cetak Formulir QR])
    end

    subgraph Engine_Lane ["Academic Rule Engine"]
        M2 --> E1[Hitung IPS Semester Lalu & Kuota SKS Maksimal]
        E1 --> M4
        M4 --> E2{Validasi Prasyarat Mata Kuliah}
        E2 -->|Belum Lulus Prasyarat| E_Err1[Tampilkan Peringatan Prasyarat] --> M4
        E2 -->|Lulus Prasyarat| E3{Bentrokan Jam / Hari?}
        E3 -->|Jadwal Bentrok| E_Err2[Tampilkan Notifikasi Bentrok] --> M4
        E3 -->|Jadwal Aman| E4{Total SKS <= Kuota Maksimal?}
        E4 -->|Melebihi Kuota| E_Err3[Blokir Submit: SKS Berlebih] --> M4
        E4 -->|Memenuhi Kuota| M6
        M6 --> E5[Kunci Data KRS Mahasiswa: Status SUBMITTED]
    end

    subgraph DPA_Lane ["Dosen Pembimbing Akademik (DPA)"]
        E5 --> D1[Terima Notifikasi Pengajuan KRS]
        D1 --> D2[Review Beban SKS & Roadmap Kelulusan]
        D2 --> D3{Persetujuan DPA}
        D3 -->|Minta Revisi| D4[Beri Catatan Alasan Revisi]
        D4 --> M_Rev --> M4
        D3 -->|Disetujui| D5[Setujui KRS Mahasiswa]
        D5 --> D6[Status Diperbarui: APPROVED_PA]
        D6 --> M_End
    end
```

---

## 4. Activity 3: Pelaksanaan Perkuliahan & Presensi 16 Pertemuan

Memodelkan pembukaan ruang kelas oleh dosen, presensi mandiri (QR dinamis) / manual, dan kalkulasi gerbang kelayakan UAS (kehadiran $\ge 75\%$).

```mermaid
flowchart TD
    subgraph Dosen_Lane ["Dosen Pengampu"]
        P1([Jadwal Kuliah Dimulai]) --> P2[Buka Halaman Presensi Kelas]
        P2 --> P3[Pilih Pertemuan Ke-1 s/d Ke-16]
        P3 --> P4{Pilih Metode Presensi}
        P4 -->|QR Code Dinamis| P5[Generate QR Token per 30 Detik]
        P4 -->|Manual Checklist| P6[Ceklis Kehadiran: Hadir/Izin/Sakit/Alpa]
        P7[Tutup Sesi Perkuliahan & Konfirmasi Berita Acara]
    end

    subgraph Mhs_Lane ["Mahasiswa di Kelas"]
        P5 --> M_Scan[Pindai QR Code via Ponsel]
        M_Scan --> M_Val{Validasi Token & Waktu Sesi}
        M_Val -->|Valid| M_Hadir[Status Tercatat: HADIR]
        M_Val -->|Kedaluwarsa| M_Fail[Presensi Ditolak / Hubungi Dosen]
    end

    subgraph System_Lane ["Academic Attendance Engine"]
        M_Hadir --> S1[Akumulasi Kehadiran Mahasiswa]
        P6 --> S1
        P7 --> S2[Kunci Riwayat Pertemuan Sesi Ini]
        S2 --> S3[Hitung Persentase Kehadiran Kumulatif]
        S3 --> S4{Kehadiran >= 75% Total Sesi?}
        S4 -->|Ya| S5[Eligible Mengikuti Ujian Akhir Semester / UAS]
        S4 -->|Tidak| S6[Disqualified: Kunci Nilai UAS = 0 & Terbitkan Surat Peringatan]
        S5 --> P_Done([Selesai])
        S6 --> P_Done
    end
```

---

## 5. Activity 4: Penilaian Multi-Komponen oleh Dosen Pengampu

Memodelkan kalkulasi bobot angka numerik, penentuan huruf mutu otomatis, dan penyimpanan draft nilai kelas.

```mermaid
flowchart TD
    subgraph Dosen_Lane ["Dosen Pengampu"]
        G1([Mulai: Masa Penilaian Semester]) --> G2[Buka Halaman Input Nilai]
        G2 --> G3[Pilih Kelas & Mata Kuliah yang Diampu]
        G3 --> G4[Input Nilai: Tugas 20%, Kuis 20%, UTS 25%, UAS 35%]
        G4 --> G5{Pilih Tindakan}
        G5 -->|Simpan Sementara| G6[Klik 'Simpan Draft']
        G5 -->|Finalisasi Kelas| G7[Klik 'Kirim Nilai ke Validasi']
        G_Done([Draft Tersimpan / Siap Diajukan])
    end

    subgraph Engine_Lane ["Calculation Engine"]
        G4 --> C1[Validasi Rentang Angka 0 - 100]
        C1 -->|Angka di Luar 0-100| C_Err[Tandai Input Merah & Nonaktifkan Simpan] --> G4
        C1 -->|Format Benar| C2[Hitung Nilai Akhir: Tugas*0.2 + Kuis*0.2 + UTS*0.25 + UAS*0.35]
        C2 --> C3[Konversi ke Huruf Mutu: A, AB, B, BC, C, D, E]
        C3 --> C4[Tampilkan Nilai Akhir & Huruf Mutu Real-Time di Tabel]
        G6 --> C5[Update Database: Status = DRAFT] --> G_Done
        G7 --> C6{Seluruh Mahasiswa Terisi Lengkap?}
        C6 -->|Ada Nilai Kosong| C_Err2[Peringatan: Lengkapi Seluruh Mahasiswa] --> G4
        C6 -->|Lengkap 100%| C7[Buka Modul Tanda Tangan Berita Acara]
    end
```

---

## 6. Activity 5: Pengajuan Nilai Kelas ke Validasi BAK

Memodelkan proses penguncian nilai oleh dosen, penerbitan berita acara nilai kelas, dan pengalihan hak edit ke antrean BAK.

```mermaid
flowchart TD
    subgraph Dosen_Lane ["Dosen Pengampu"]
        S1([Halaman Validasi Nilai Dosen]) --> S2[Periksa Statistik Ringkasan Kelas]
        S2 --> S3[Tinjau Sebaran Nilai A, B, C, D, E]
        S3 --> S4[Ceklis Pernyataan Keaslian & Integritas Penilaian]
        S4 --> S5[Bubuhkan Tanda Tangan Digital Dosen]
        S5 --> S6[Klik 'Kirim Berita Acara ke BAK']
        S_End([Nilai Terkunci: Status SUBMITTED])
    end

    subgraph System_Lane ["SIAK Core System"]
        S6 --> Y1[Kunci Hak Edit Nilai untuk Dosen]
        Y1 --> Y2[Generate Berita Acara Nilai PDF bertanda tangan hash]
        Y2 --> Y3[Pindahkan Kelas ke Antrean Validasi BAK]
        Y3 --> Y4[Kirim Notifikasi ke Operator BAK]
        Y4 --> S_End
    end
```

---

## 7. Activity 6: Verifikasi & Validasi Nilai oleh Operator BAK

Memodelkan audit kepatuhan akademik, analisis sebaran nilai, serta keputusan persetujuan (*approval*) atau penolakan (*rejection*) oleh Operator BAK.

```mermaid
flowchart TD
    subgraph BAK_Lane ["Operator BAK"]
        V1([Buka Modul Validasi Nilai BAK]) --> V2[Pilih Kelas dari Antrean 'Menunggu Validasi']
        V2 --> V3[Audit Kelengkapan Komponen Nilai Mahasiswa]
        V3 --> V4[Cek Kepatuhan Presensi vs Nilai UAS]
        V4 --> V5{Keputusan Validasi}
        V5 -->|Tolak / Minta Revisi| V6[Isi Catatan Berita Acara Penolakan]
        V6 --> V7[Klik 'Tolak Nilai Kelas']
        V5 -->|Setujui Nilai| V8[Klik 'Setujui & Validasi Kelas']
        V_End([Proses Validasi Selesai])
    end

    subgraph System_Lane ["System Validation Guard"]
        V7 --> R1[Ubah Status Menjadi REJECTED]
        R1 --> R2[Buka Kembali Akses Edit untuk Dosen Pengampu]
        R2 --> R3[Kirim Email / Notifikasi Revisi ke Dosen] --> V_End

        V8 --> A1[Ubah Status Menjadi VALIDATED]
        A1 --> A2[Kunci Permanen Berita Acara Kelas]
        A2 --> A3[Pindahkan Kelas ke Antrean Publikasi KHS]
        A3 --> A4[Kirim Konfirmasi Berhasil ke Dosen] --> V_End
    end
```

---

## 8. Activity 7: Publikasi Massal Nilai Semester ke KHS Mahasiswa

Memodelkan rilis nilai secara serentak per program studi/fakultas, re-kalkulasi Indeks Prestasi Semester (IPS), dan pembaruan KHS mahasiswa.

```mermaid
flowchart TD
    subgraph BAK_Lane ["Operator BAK"]
        P1([Buka Halaman Publikasi Nilai]) --> P2[Filter Fakultas, Prodi & Semester Aktif]
        P2 --> P3[Pilih Kelas-Kelas Berstatus VALIDATED]
        P3 --> P4[Klik 'Publikasikan Nilai ke Mahasiswa']
        P4 --> P5[Konfirmasi Risiko Penguncian Permanen]
        P_End([Publikasi Berhasil Dirilis])
    end

    subgraph Engine_Lane ["Academic Calculation & Publishing Engine"]
        P5 --> K1[Kunci Nilai Menjadi Status: PUBLISHED]
        K1 --> K2[Kalkulasi Mutu: SKS * Angka Mutu per Mahasiswa]
        K2 --> K3[Hitung Indeks Prestasi Semester: IPS = Total Mutu / Total SKS]
        K3 --> K4[Hitung Indeks Prestasi Kumulatif: IPK Kumulatif]
        K4 --> K5[Tentukan Beban Maksimal SKS Semester Depan]
        K5 --> K6[Terbitkan Lembar KHS ke Modul Mahasiswa]
        K6 --> K7[Kirim Notifikasi Siaran ke Portal Mahasiswa]
        K7 --> P_End
    end

    subgraph Mhs_Lane ["Mahasiswa"]
        K6 --> M1[Buka Modul KHS di Portal Mahasiswa]
        M1 --> M2[Lihat Nilai Huruf, IPS, dan Unduh PDF Resmi]
    end
```

---

## 9. Activity 8: Permohonan & Audit Trail Perbaikan Nilai Pasca Publikasi

Memodelkan alur banding revisi nilai resmi yang diawasi secara hierarkis oleh Kaprodi dan Dekan Fakultas guna mencegah kecurangan akademik.

```mermaid
flowchart TD
    subgraph Pemohon_Lane ["Mahasiswa / Dosen Pengampu"]
        R1([Permohonan Koreksi Nilai]) --> R2[Buka Halaman Perbaikan Nilai]
        R2 --> R3[Pilih Mahasiswa, Mata Kuliah & Komponen Nilai]
        R3 --> R4[Isi Alasan Perbaikan & Unggah Berkas Bukti]
        R4 --> R5[Kirim Pengajuan Banding]
    end

    subgraph Pimpinan_Lane ["Kaprodi & Dekan Fakultas"]
        R5 --> J1[Kaprodi Review Berkas Ujian Fisik & Alasan]
        J1 --> J2{Rekomendasi Kaprodi}
        J2 -->|Ditolak| J_Rej[Tolak Permohonan & Beri Alasan] --> R_End([Selesai])
        J2 -->|Direkomendasikan| J3[Teruskan ke Dekan Fakultas]
        J3 --> J4{Persetujuan Dekan}
        J4 -->|Ditolak Dekan| J_Rej
        J4 -->|Disetujui Dekan| J5[Otorisasi Tanda Tangan Digital Dekan]
    end

    subgraph BAK_Lane ["Operator BAK & Sistem Audit"]
        J5 --> B1[Operator BAK Terima Perintah Eksekusi Revisi]
        B1 --> B2[Masukkan Nilai Komponen Baru]
        B2 --> B3[Sistem Rekam Snapshot ke grade_audit_logs: Nilai Lama vs Baru, User, IP, Berkas]
        B3 --> B4[Update Data Nilai Resmi]
        B4 --> B5[Re-kalkulasi Otomatis IPS & IPK Mahasiswa]
        B5 --> B6[Cetak Ulang KHS dengan Watermark 'REVISI']
        B6 --> R_End
    end
```

---

## 10. Activity 9: Penerbitan Dokumen Resmi (KHS & Transkrip) dengan QR Verifier

Memodelkan penyusunan dokumen akademik legal, kalkulasi aturan pengulangan nilai terbaik (*Best Grade Policy*), dan penyematan QR code verifikasi publik.

```mermaid
flowchart TD
    subgraph User_Lane ["Mahasiswa / Operator BAK"]
        D1([Akses Halaman Transkrip / KHS]) --> D2[Pilih Format Dokumen: KHS Semester / Transkrip Lengkap]
        D2 --> D3[Klik 'Unduh Dokumen PDF Resmi']
        D7[Unduh Berkas PDF atau Cetak via Printer]
    end

    subgraph Engine_Lane ["Document Generation & Security Engine"]
        D3 --> G1[Query Riwayat Nilai Seluruh Semester]
        G1 --> G2{Terdapat Mata Kuliah Diulang?}
        G2 -->|Ya| G3[Terapkan Kebijakan: Ambil Nilai Mutu Terbaik]
        G2 -->|Tidak| G4[Ambil Seluruh Mata Kuliah Lulus]
        G3 --> G5[Kompilasi SKS Lulus & Hitung IPK Akhir]
        G4 --> G5
        G5 --> G6[Tentukan Predikat Yudisium: Cum Laude / Sangat Memuaskan / Memuaskan]
        G6 --> G7[Generate Cryptographic Hash SHA-256 dari Isi Transkrip]
        G7 --> G8[Generate Dynamic QR Code: https://verify.ufd.ac.id/doc/{hash}]
        G8 --> G9[Render Dokumen PDF Sesuai Standar Kop Surat Universitas]
        G9 --> D7
    end

    subgraph ThirdParty_Lane ["Pihak Ketiga (Perusahaan / Kementerian)"]
        D7 -.-> T1[Pindai QR Code Menggunakan Kamera Ponsel]
        T1 --> T2[Buka Halaman Verifikasi Publik Tanpa Login]
        T2 --> T3[Sistem Verifikasi: Validasi Kesesuaian Data Asli vs Berkas Fisik]
    end
```

---

## 11. Activity 10: Sinkronisasi Terjadwal PDDIKTI NeoFeeder

Memodelkan ekstraksi data dari basis data lokal SIAK UFD, transformasi ke skema Forlap Dikti, validasi anomali, hingga pengiriman data ke server nasional.

```mermaid
flowchart TD
    subgraph BAK_Lane ["Operator Pelaporan BAK"]
        F1([Mulai Periode Pelaporan PDDIKTI]) --> F2[Buka Modul Sinkronisasi NeoFeeder]
        F2 --> F3[Pilih Jenis Data: Kurikulum / KRS / Presensi / Nilai / AKM]
        F3 --> F4[Klik 'Mulai Proses Ekstraksi & Validasi']
        F_Report[Tinjau Hasil Laporan Sinkronisasi]
    end

    subgraph SyncWorker_Lane ["Background ETL Worker"]
        F4 --> W1[Ekstrak Data dari Database SIAK UFD per Tenant]
        W1 --> W2[Transformasi Format Sesuai Standar Kamus Data PDDIKTI]
        W2 --> W3[Lakukan Validasi Aturan Feeder: Cek Duplikat, NIDN Terdaftar, Format SKS]
        W3 --> W4{Ditemukan Anomali / Error?}
        W4 -->|Ya| W5[Kompilasi Daftar Error ke Log Anomali BAK] --> F_Report
        W4 -->|Lolos Validasi| W6[Bungkus Data dalam Format JSON REST Payload]
        W6 --> W7[Kirim Batch Data ke NeoFeeder REST API Client]
    end

    subgraph Feeder_Lane ["NeoFeeder Kemendikbudristek"]
        W7 --> N1[Autentikasi Token Webservice NeoFeeder]
        N1 --> N2[Eksekusi Insert / Update ke Basis Data Feeder Lokal]
        N2 --> N3[Kirim Status Keberhasilan / HTTP 200 OK ke SIAK UFD]
        N3 --> W8[Tandai Data Lokal: Status = SYNCED_PDDIKTI]
        W8 --> F_Report
    end
```

---
*Dokumen ini merupakan panduan alur aktivitas resmi SIAK UFD Enterprise SaaS. Seluruh diagram dapat dirender secara langsung menggunakan engine Mermaid.*
