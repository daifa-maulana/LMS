-- =============================================================================
-- SISTEM INFORMASI AKADEMIK (SIAK UFD) - BASIS DATA DDL & DML
-- Berdasarkan ERD, PDM, dan Diagram Aliran Data (DFD Level 0 & 1)
-- Kompatibel dengan PostgreSQL 12+ dan MySQL 8.0+
-- =============================================================================

DROP TABLE IF EXISTS FRS CASCADE;
DROP TABLE IF EXISTS MATA_KULIAH CASCADE;
DROP TABLE IF EXISTS MAHASISWA CASCADE;
DROP TABLE IF EXISTS DOSEN CASCADE;
DROP TABLE IF EXISTS PRODI CASCADE;
DROP TABLE IF EXISTS BAK CASCADE;
DROP TABLE IF EXISTS LOG_SISTEM CASCADE;

-- -----------------------------------------------------------------------------
-- 1. TABEL BAK (Biro Administrasi Akademik & Kemahasiswaan)
-- -----------------------------------------------------------------------------
CREATE TABLE BAK (
    ID_Bak VARCHAR(20) PRIMARY KEY,
    Nama VARCHAR(150) NOT NULL,
    No_Telepon VARCHAR(30) NOT NULL,
    Pegawai VARCHAR(120) NOT NULL,
    Alamat TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 2. TABEL PRODI (Program Studi)
-- Relasi: BAK mengelola PRODI (1 to N)
-- -----------------------------------------------------------------------------
CREATE TABLE PRODI (
    Kode_Prodi VARCHAR(20) PRIMARY KEY,
    Nama_Prodi VARCHAR(150) NOT NULL,
    Sk_terbentuknya_Prodi VARCHAR(100) NOT NULL,
    ID_Bak VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_prodi_bak FOREIGN KEY (ID_Bak) REFERENCES BAK(ID_Bak) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- -----------------------------------------------------------------------------
-- 3. TABEL DOSEN
-- Relasi: PRODI menaungi DOSEN (1 to N)
-- -----------------------------------------------------------------------------
CREATE TABLE DOSEN (
    Kode_dosen VARCHAR(20) PRIMARY KEY,
    NIP VARCHAR(50) NOT NULL UNIQUE,
    Nama VARCHAR(150) NOT NULL,
    Alamat TEXT NOT NULL,
    No_Telepon VARCHAR(30) NOT NULL,
    Kode_Prodi VARCHAR(20) NOT NULL,
    Email VARCHAR(120),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dosen_prodi FOREIGN KEY (Kode_Prodi) REFERENCES PRODI(Kode_Prodi) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- -----------------------------------------------------------------------------
-- 4. TABEL MAHASISWA
-- Relasi: PRODI memiliki MAHASISWA (1 to N)
-- -----------------------------------------------------------------------------
CREATE TABLE MAHASISWA (
    NIM VARCHAR(30) PRIMARY KEY,
    Nama VARCHAR(150) NOT NULL,
    Alamat TEXT NOT NULL,
    Kode_Prodi VARCHAR(20) NOT NULL,
    Semester INT DEFAULT 1,
    Status VARCHAR(20) DEFAULT 'Aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mahasiswa_prodi FOREIGN KEY (Kode_Prodi) REFERENCES PRODI(Kode_Prodi) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- -----------------------------------------------------------------------------
-- 5. TABEL MATA_KULIAH
-- Relasi: PRODI memiliki MATA_KULIAH (1 to N), DOSEN mengampu MATA_KULIAH (1 to N)
-- -----------------------------------------------------------------------------
CREATE TABLE MATA_KULIAH (
    Kode_MTK VARCHAR(20) PRIMARY KEY,
    Nama_MTK VARCHAR(150) NOT NULL,
    SKS INT NOT NULL CHECK (SKS > 0 AND SKS <= 6),
    Semester INT NOT NULL CHECK (Semester >= 1 AND Semester <= 8),
    Kode_Prodi VARCHAR(20) NOT NULL,
    Kode_dosen VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mtk_prodi FOREIGN KEY (Kode_Prodi) REFERENCES PRODI(Kode_Prodi) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_mtk_dosen FOREIGN KEY (Kode_dosen) REFERENCES DOSEN(Kode_dosen) ON UPDATE CASCADE ON DELETE SET NULL
);

-- -----------------------------------------------------------------------------
-- 6. TABEL FRS (Form Rencana Studi & Hasil Studi / Nilai)
-- Relasi: MAHASISWA mengambil FRS (1 to N), MATA_KULIAH terdaftar di FRS (1 to N)
-- Bobot Komponen: Absen 10%, Attitude 10%, Quiz 15%, Tugas 20%, UTS 20%, UAS 25%
-- -----------------------------------------------------------------------------
CREATE TABLE FRS (
    ID_FRS SERIAL PRIMARY KEY,
    NIM VARCHAR(30) NOT NULL,
    Kode_MTK VARCHAR(20) NOT NULL,
    Tahun_Ajaran_Semester VARCHAR(50) NOT NULL,
    Absen NUMERIC(5,2) DEFAULT 0 CHECK (Absen >= 0 AND Absen <= 100),
    Attitude NUMERIC(5,2) DEFAULT 0 CHECK (Attitude >= 0 AND Attitude <= 100),
    Quiz NUMERIC(5,2) DEFAULT 0 CHECK (Quiz >= 0 AND Quiz <= 100),
    Tugas NUMERIC(5,2) DEFAULT 0 CHECK (Tugas >= 0 AND Tugas <= 100),
    UTS NUMERIC(5,2) DEFAULT 0 CHECK (UTS >= 0 AND UTS <= 100),
    UAS NUMERIC(5,2) DEFAULT 0 CHECK (UAS >= 0 AND UAS <= 100),
    Nilai_Akhir NUMERIC(5,2) GENERATED ALWAYS AS (
        (Absen * 0.10) + (Attitude * 0.10) + (Quiz * 0.15) + 
        (Tugas * 0.20) + (UTS * 0.20) + (UAS * 0.25)
    ) STORED,
    Nilai_Huruf VARCHAR(5),
    Bobot NUMERIC(3,2),
    Status_Validasi VARCHAR(30) DEFAULT 'Draft', -- 'Draft', 'Validated', 'Published'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_frs_mahasiswa FOREIGN KEY (NIM) REFERENCES MAHASISWA(NIM) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_frs_mtk FOREIGN KEY (Kode_MTK) REFERENCES MATA_KULIAH(Kode_MTK) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT uq_mhs_mtk_smt UNIQUE (NIM, Kode_MTK, Tahun_Ajaran_Semester)
);

-- -----------------------------------------------------------------------------
-- 7. TABEL LOG_SISTEM (Audit Log - DFD 8.0)
-- -----------------------------------------------------------------------------
CREATE TABLE LOG_SISTEM (
    ID_Log VARCHAR(50) PRIMARY KEY,
    Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Aktor VARCHAR(100) NOT NULL,
    Modul VARCHAR(100) NOT NULL,
    Deskripsi TEXT NOT NULL,
    Tipe VARCHAR(30) DEFAULT 'info'
);

-- =============================================================================
-- SEED DATA (DML INSERTION)
-- =============================================================================

-- 1. Insert BAK
INSERT INTO BAK (ID_Bak, Nama, No_Telepon, Pegawai, Alamat) VALUES
('BAK-01', 'Biro Administrasi Akademik & Kemahasiswaan Pusat', '021-7890123', 'Dra. Hj. Sri Wahyuni, M.Si', 'Gedung Rektorat Lt. 2, Kampus Utama');

-- 2. Insert PRODI
INSERT INTO PRODI (Kode_Prodi, Nama_Prodi, Sk_terbentuknya_Prodi, ID_Bak) VALUES
('IF', 'Teknik Informatika', 'SK-DIKTI/2018/042', 'BAK-01'),
('SI', 'Sistem Informasi', 'SK-DIKTI/2019/077', 'BAK-01'),
('TI', 'Teknologi Informasi', 'SK-DIKTI/2021/115', 'BAK-01');

-- 3. Insert DOSEN
INSERT INTO DOSEN (Kode_dosen, NIP, Nama, Alamat, No_Telepon, Kode_Prodi, Email) VALUES
('DSN-010', '198507142010121003', 'Dr. Hendra Gunawan, M.Kom', 'Jl. Margonda Raya No. 45, Depok', '0812-3456-7890', 'IF', 'hendra.gunawan@ufd.ac.id'),
('DSN-011', '198802202014042001', 'Nurul Aini, S.Kom., M.T.', 'Jl. Cilandak Barat No. 12, Jakarta Selatan', '0813-9876-5432', 'SI', 'nurul.aini@ufd.ac.id'),
('DSN-012', '199011052019031008', 'Bambang Sudarsono, M.T.I.', 'Jl. BSD Boulevard No. 88, Tangerang', '0815-5544-3322', 'TI', 'bambang.s@ufd.ac.id');

-- 4. Insert MAHASISWA
INSERT INTO MAHASISWA (NIM, Nama, Alamat, Kode_Prodi, Semester, Status) VALUES
('20230801045', 'James Budi Santoso', 'Jl. Kemang Raya No. 18, Jakarta Selatan', 'IF', 4, 'Aktif'),
('20230801088', 'Rachel Sarah Lee', 'Jl. Tebet Timur Dalam No. 5, Jakarta Selatan', 'IF', 4, 'Aktif'),
('20230802012', 'Muhammad Kevin Ardiansyah', 'Jl. Boulevard Bintaro Sektor 7, Tangerang Selatan', 'SI', 4, 'Aktif'),
('20220803009', 'Amanda Putri Lestari', 'Jl. Sukajadi No. 90, Bandung', 'TI', 6, 'Aktif');

-- 5. Insert MATA_KULIAH
INSERT INTO MATA_KULIAH (Kode_MTK, Nama_MTK, SKS, Semester, Kode_Prodi, Kode_dosen) VALUES
('IF201', 'Sistem Basis Data Terdistribusi', 3, 4, 'IF', 'DSN-010'),
('IF202', 'Pemrograman Web Lanjut (Fullstack)', 3, 4, 'IF', 'DSN-010'),
('SI301', 'Analisis & Perancangan Sistem Informasi', 3, 4, 'SI', 'DSN-011'),
('TI204', 'Jaringan Komputer & Keamanan Siber', 4, 4, 'TI', 'DSN-012'),
('IF205', 'Kecerdasan Buatan & Machine Learning', 3, 4, 'IF', 'DSN-010');

-- 6. Insert FRS & Nilai Awal
INSERT INTO FRS (NIM, Kode_MTK, Tahun_Ajaran_Semester, Absen, Attitude, Quiz, Tugas, UTS, UAS, Nilai_Huruf, Bobot, Status_Validasi) VALUES
('20230801045', 'IF201', '2024/2025 Genap', 92.0, 88.0, 85.0, 90.0, 84.0, 88.0, 'A', 4.0, 'Published'),
('20230801045', 'IF202', '2024/2025 Genap', 95.0, 90.0, 92.0, 88.0, 86.0, 91.0, 'A', 4.0, 'Published'),
('20230801045', 'IF205', '2024/2025 Genap', 88.0, 85.0, 78.0, 82.0, 79.0, 84.0, 'A-', 3.7, 'Validated'),
('20230801088', 'IF201', '2024/2025 Genap', 90.0, 86.0, 80.0, 85.0, 82.0, 80.0, 'A-', 3.7, 'Published'),
('20230802012', 'SI301', '2024/2025 Genap', 85.0, 82.0, 75.0, 80.0, 78.0, 76.0, 'B+', 3.3, 'Draft');

-- 7. Insert Log
INSERT INTO LOG_SISTEM (ID_Log, Aktor, Modul, Deskripsi, Tipe) VALUES
('LOG-5001', 'Operator BAK', '4.0 Publikasi Nilai', 'Mempublikasikan hasil nilai FRS Semester Genap 2024/2025 untuk Mata Kuliah IF201 dan IF202.', 'info'),
('LOG-5002', 'Dosen (DSN-010)', '2.0 Input Nilai', 'Input nilai komponen UAS dan UTS mahasiswa IF201 (Sistem Basis Data).', 'success'),
('LOG-5003', 'Mahasiswa (20230801045)', '1.0 Pengelolaan FRS', 'Pengambilan rencana studi mata kuliah IF205 Kecerdasan Buatan (3 SKS).', 'info');

