# Kamus Data & Spesifikasi Arsitektur Basis Data
## SIAK UFD (Sistem Informasi Akademik)

---

### 1. Hubungan Relasional Antar Entitas (Kardinalitas)

Berdasarkan gambar **Physical Data Model (PDM)** dan **Entity Relationship Diagram (ERD)**:

```
[ BAK ] 1 -------- N [ PRODI ] 1 -------- N [ DOSEN ]
                        |
                        +------ 1 -------- N [ MAHASISWA ]
                        |                          |
                        |                          1
                        |                          |
                        +------ 1 -------- N [ MATA_KULIAH ] 1
                                                   |         |
                                                   | Mengampu| Mengambil
                                                   |         |
                                                   +--- N ---+ [ FRS ]
```

1. **BAK - PRODI (1 to N, Mengelola)**:
   - Satu Biro Administrasi Akademik (`BAK`) mengelola banyak Program Studi (`PRODI`).
   - Kunci Relasi: `PRODI.ID_Bak` $\rightarrow$ `BAK.ID_Bak`.

2. **PRODI - DOSEN (1 to N, Menaungi)**:
   - Satu Program Studi menaungi banyak Dosen.
   - Kunci Relasi: `DOSEN.Kode_Prodi` $\rightarrow$ `PRODI.Kode_Prodi`.

3. **PRODI - MAHASISWA (1 to N, Memiliki)**:
   - Satu Program Studi memiliki banyak Mahasiswa terdaftar.
   - Kunci Relasi: `MAHASISWA.Kode_Prodi` $\rightarrow$ `PRODI.Kode_Prodi`.

4. **PRODI - MATA_KULIAH (1 to N, Memiliki Kurikulum)**:
   - Satu Program Studi menyelenggarakan banyak Mata Kuliah.
   - Kunci Relasi: `MATA_KULIAH.Kode_Prodi` $\rightarrow$ `PRODI.Kode_Prodi`.

5. **DOSEN - MATA_KULIAH (1 to N / N to N, Mengampu)**:
   - Dosen ditugaskan untuk mengampu mata kuliah terkait.
   - Kunci Relasi: `MATA_KULIAH.Kode_dosen` $\rightarrow$ `DOSEN.Kode_dosen`.

6. **MAHASISWA - MATA_KULIAH (N to N melalui Entitas Asosiatif `FRS`)**:
   - Mahasiswa mengambil rencana studi mata kuliah melalui formulir FRS.
   - Kunci Relasi:
     - `FRS.NIM` $\rightarrow$ `MAHASISWA.NIM`
     - `FRS.Kode_MTK` $\rightarrow$ `MATA_KULIAH.Kode_MTK`

---

### 2. Kamus Data Lengkap (Data Dictionary)

#### 2.1 Tabel `BAK` (Biro Administrasi Akademik)
| Nama Kolom | Tipe Data | Keterangan / Constraint | Deskripsi |
| :--- | :--- | :--- | :--- |
| `ID_Bak` | VARCHAR(20) | **PRIMARY KEY** | Kode unik identitas unit BAK |
| `Nama` | VARCHAR(150) | NOT NULL | Nama resmi unit biro akademik |
| `No_Telepon` | VARCHAR(30) | NOT NULL | Nomor kontak layanan akademik |
| `Pegawai` | VARCHAR(120) | NOT NULL | Nama penanggung jawab / kepala biro |
| `Alamat` | TEXT | NOT NULL | Lokasi kantor fisik BAK |

#### 2.2 Tabel `PRODI` (Program Studi)
| Nama Kolom | Tipe Data | Keterangan / Constraint | Deskripsi |
| :--- | :--- | :--- | :--- |
| `Kode_Prodi` | VARCHAR(20) | **PRIMARY KEY** | Kode singkatan prodi (contoh: `IF`, `SI`, `TI`) |
| `Nama_Prodi` | VARCHAR(150) | NOT NULL | Nama lengkap program studi |
| `Sk_terbentuknya_Prodi` | VARCHAR(100) | NOT NULL | Nomor SK pendirian dari Kemendikbud/Dikti |
| `ID_Bak` | VARCHAR(20) | **FOREIGN KEY** $\rightarrow$ `BAK(ID_Bak)` | Relasi ke biro pengelola |

#### 2.3 Tabel `DOSEN`
| Nama Kolom | Tipe Data | Keterangan / Constraint | Deskripsi |
| :--- | :--- | :--- | :--- |
| `Kode_dosen` | VARCHAR(20) | **PRIMARY KEY** | Kode pengenal dosen (contoh: `DSN-010`) |
| `NIP` | VARCHAR(50) | NOT NULL, UNIQUE | Nomor Induk Pegawai / NIDN |
| `Nama` | VARCHAR(150) | NOT NULL | Nama dosen beserta gelar akademik |
| `Alamat` | TEXT | NOT NULL | Alamat tempat tinggal |
| `No_Telepon` | VARCHAR(30) | NOT NULL | Kontak nomor telepon dosen |
| `Kode_Prodi` | VARCHAR(20) | **FOREIGN KEY** $\rightarrow$ `PRODI(Kode_Prodi)` | Homebase program studi dosen |
| `Email` | VARCHAR(120) | NULL | Email resmi institusi dosen |

#### 2.4 Tabel `MAHASISWA`
| Nama Kolom | Tipe Data | Keterangan / Constraint | Deskripsi |
| :--- | :--- | :--- | :--- |
| `NIM` | VARCHAR(30) | **PRIMARY KEY** | Nomor Induk Mahasiswa (contoh: `20230801045`) |
| `Nama` | VARCHAR(150) | NOT NULL | Nama lengkap mahasiswa |
| `Alamat` | TEXT | NOT NULL | Alamat domisili |
| `Kode_Prodi` | VARCHAR(20) | **FOREIGN KEY** $\rightarrow$ `PRODI(Kode_Prodi)` | Program studi tempat mahasiswa terdaftar |
| `Semester` | INT | DEFAULT 1 | Posisi semester aktif mahasiswa |
| `Status` | VARCHAR(20) | DEFAULT 'Aktif' | Status akademik (Aktif, Cuti, Lulus) |

#### 2.5 Tabel `MATA_KULIAH`
| Nama Kolom | Tipe Data | Keterangan / Constraint | Deskripsi |
| :--- | :--- | :--- | :--- |
| `Kode_MTK` | VARCHAR(20) | **PRIMARY KEY** | Kode mata kuliah kurikulum (contoh: `IF201`) |
| `Nama_MTK` | VARCHAR(150) | NOT NULL | Nama lengkap mata kuliah |
| `SKS` | INT | CHECK (SKS > 0 AND SKS <= 6) | Bobot Satuan Kredit Semester |
| `Semester` | INT | CHECK (Semester BETWEEN 1 AND 8) | Semester penawaran reguler |
| `Kode_Prodi` | VARCHAR(20) | **FOREIGN KEY** $\rightarrow$ `PRODI(Kode_Prodi)` | Prodi penyelenggara mata kuliah |
| `Kode_dosen` | VARCHAR(20) | **FOREIGN KEY** $\rightarrow$ `DOSEN(Kode_dosen)` | Dosen penanggung jawab mata kuliah |

#### 2.6 Tabel `FRS` (Form Rencana Studi & Komponen Nilai)
| Nama Kolom | Tipe Data | Keterangan / Constraint | Deskripsi |
| :--- | :--- | :--- | :--- |
| `ID_FRS` | INT / SERIAL | **PRIMARY KEY** | Nomor unik registrasi FRS |
| `NIM` | VARCHAR(30) | **FOREIGN KEY** $\rightarrow$ `MAHASISWA(NIM)` | Mahasiswa yang mengambil mata kuliah |
| `Kode_MTK` | VARCHAR(20) | **FOREIGN KEY** $\rightarrow$ `MATA_KULIAH(Kode_MTK)` | Mata kuliah yang diambil |
| `Tahun_Ajaran_Semester` | VARCHAR(50) | NOT NULL | Periode akademik (contoh: `2024/2025 Genap`) |
| `Absen` | NUMERIC(5,2) | 0.00 - 100.00 (Bobot 10%) | Nilai kehadiran perkuliahan |
| `Attitude` | NUMERIC(5,2) | 0.00 - 100.00 (Bobot 10%) | Nilai etika dan keaktifan kelas |
| `Quiz` | NUMERIC(5,2) | 0.00 - 100.00 (Bobot 15%) | Rata-rata nilai kuis |
| `Tugas` | NUMERIC(5,2) | 0.00 - 100.00 (Bobot 20%) | Rata-rata nilai tugas mandiri & kelompok |
| `UTS` | NUMERIC(5,2) | 0.00 - 100.00 (Bobot 20%) | Nilai Ujian Tengah Semester |
| `UAS` | NUMERIC(5,2) | 0.00 - 100.00 (Bobot 25%) | Nilai Ujian Akhir Semester |
| `Nilai_Akhir` | NUMERIC(5,2) | **Kalkulasi Otomatis** | Rata-rata tertimbang komponen nilai |
| `Nilai_Huruf` | VARCHAR(5) | A, A-, B+, B, B-, C+, C, D, E | Konversi huruf mutu akademik |
| `Bobot` | NUMERIC(3,2) | 0.00 s/d 4.00 | Nilai angka untuk perhitungan IPK/IPS |
| `Status_Validasi` | VARCHAR(30) | Draft, Validated, Published | Siklus persetujuan nilai oleh BAK |

---

### 3. Pemetaan Data Store DFD Level 1
- **D1. T. Pengguna / MHS**: Merujuk pada tabel `MAHASISWA`
- **D2. T. Mata Kuliah / MTK**: Merujuk pada tabel `MATA_KULIAH`
- **D3. T. FRS / KRS**: Merujuk pada pendaftaran studi pada tabel `FRS`
- **D4. T. Dosen**: Merujuk pada tabel `DOSEN`
- **D5. T. Prodi & BAK**: Merujuk pada tabel `PRODI` dan `BAK`
- **D6. T. Hasil Studi & Nilai**: Merujuk pada kolom kalkulasi nilai dan status publikasi di tabel `FRS`
- **D7. T. Log Sistem**: Merujuk pada tabel `LOG_SISTEM` untuk audit trail

