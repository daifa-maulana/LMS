-- =============================================================================
-- SIAK UFD ENTERPRISE ACADEMIC ERP & SAAS — SUPABASE SCHEMA & SEED
-- Database Engine: PostgreSQL 15+ (Supabase Native)
-- Multi-Tenancy: Row Level Security (RLS) & Tenant Isolation
-- Single Source of Truth: docs/ERD.md, docs/ARCHITECTURE.md, docs/API_SPEC.md
-- =============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. TENANTS TABLE (Multi-Tenant Organization Isolation)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 2. USERS & PROFILES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    username VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('mahasiswa', 'dosen', 'akademik', 'superadmin')),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_tenant_username UNIQUE (tenant_id, username)
);

-- -----------------------------------------------------------------------------
-- 3. DEPARTMENTS / PROGRAM STUDI TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.departments (
    code VARCHAR(30) PRIMARY KEY,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    faculty VARCHAR(255) NOT NULL,
    degree VARCHAR(20) DEFAULT 'S1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 4. STUDENTS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.students (
    nim VARCHAR(50) PRIMARY KEY,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    prodi_code VARCHAR(30) REFERENCES public.departments(code) ON UPDATE CASCADE,
    dosen_pa_name VARCHAR(255),
    dosen_pa_nidn VARCHAR(50),
    semester_active INT DEFAULT 1,
    prev_ips NUMERIC(4,2) DEFAULT 0.00,
    max_sks INT DEFAULT 18,
    gpa NUMERIC(4,2) DEFAULT 0.00,
    sks_passed INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Aktif',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 5. LECTURERS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lecturers (
    nidn VARCHAR(50) PRIMARY KEY,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    academic_title VARCHAR(100),
    prodi_code VARCHAR(30) REFERENCES public.departments(code) ON UPDATE CASCADE,
    functional_rank VARCHAR(100) DEFAULT 'Lektor',
    status VARCHAR(50) DEFAULT 'Aktif',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 6. COURSES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.courses (
    code VARCHAR(50) PRIMARY KEY,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sks INT NOT NULL CHECK (sks > 0 AND sks <= 6),
    semester INT NOT NULL CHECK (semester >= 1 AND semester <= 8),
    prodi_code VARCHAR(30) REFERENCES public.departments(code) ON UPDATE CASCADE,
    prerequisite_code VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 7. CLASSES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.classes (
    id VARCHAR(100) PRIMARY KEY,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    course_code VARCHAR(50) REFERENCES public.courses(code) ON DELETE RESTRICT,
    course_name VARCHAR(255) NOT NULL,
    class_name VARCHAR(50) NOT NULL,
    sks INT NOT NULL,
    lecturer_nidn VARCHAR(50) REFERENCES public.lecturers(nidn) ON DELETE SET NULL,
    lecturer_name VARCHAR(255) NOT NULL,
    day VARCHAR(20) NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    room VARCHAR(100) NOT NULL,
    capacity INT DEFAULT 40,
    enrolled INT DEFAULT 0,
    grading_status VARCHAR(50) DEFAULT 'DRAFT' CHECK (grading_status IN ('DRAFT', 'SUBMITTED', 'VALIDATED', 'PUBLISHED', 'REJECTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 8. KRS ENROLLMENTS TABLE (Rencana Studi)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.krs_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    nim VARCHAR(50) REFERENCES public.students(nim) ON DELETE CASCADE,
    class_id VARCHAR(100) REFERENCES public.classes(id) ON DELETE RESTRICT,
    course_code VARCHAR(50) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    sks INT NOT NULL,
    status VARCHAR(50) DEFAULT 'SUBMITTED' CHECK (status IN ('DRAFT', 'SUBMITTED', 'APPROVED_PA', 'REVISED', 'LOCKED')),
    dpa_review_note TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 9. ATTENDANCES TABLE (Presensi Perkuliahan 16 Sesi)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.attendances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    class_id VARCHAR(100) REFERENCES public.classes(id) ON DELETE CASCADE,
    nim VARCHAR(50) REFERENCES public.students(nim) ON DELETE CASCADE,
    total_sessions INT DEFAULT 16,
    attended INT DEFAULT 0,
    percentage NUMERIC(5,2) DEFAULT 0.00,
    eligible_for_exam BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_attendance_class_student UNIQUE (class_id, nim)
);

-- -----------------------------------------------------------------------------
-- 10. GRADES TABLE (Multi-Component Assessment)
-- Formula: NA = Tugas*0.20 + Kuis*0.20 + UTS*0.25 + UAS*0.35
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    class_id VARCHAR(100) REFERENCES public.classes(id) ON DELETE CASCADE,
    nim VARCHAR(50) REFERENCES public.students(nim) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    tugas NUMERIC(5,2) DEFAULT 0.00,
    kuis NUMERIC(5,2) DEFAULT 0.00,
    uts NUMERIC(5,2) DEFAULT 0.00,
    uas NUMERIC(5,2) DEFAULT 0.00,
    nilai_akhir NUMERIC(5,2) DEFAULT 0.00,
    huruf_mutu VARCHAR(5) DEFAULT 'E',
    bobot NUMERIC(3,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SUBMITTED', 'VALIDATED', 'PUBLISHED', 'REJECTED')),
    revision_flag BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_grade_class_student UNIQUE (class_id, nim)
);

-- -----------------------------------------------------------------------------
-- 11. GRADE REVISIONS TABLE (Immutable Audit Trail)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.grade_revisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    class_id VARCHAR(100) NOT NULL,
    nim VARCHAR(50) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    course_code VARCHAR(50),
    course_name VARCHAR(255),
    old_grade VARCHAR(5) NOT NULL,
    new_grade VARCHAR(5) NOT NULL,
    reason TEXT NOT NULL,
    supporting_doc_url TEXT,
    requested_by VARCHAR(255) NOT NULL,
    approved_by_dekan BOOLEAN DEFAULT TRUE,
    executed_by VARCHAR(255) DEFAULT 'Operator BAK',
    status VARCHAR(50) DEFAULT 'EXECUTED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 12. ANNOUNCEMENTS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'Akademik',
    date_text VARCHAR(100),
    summary TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES — SUPABASE MULTI-TENANCY
-- =============================================================================

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lecturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.krs_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grade_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Allow public read & write for local demo and authenticated service
CREATE POLICY "Public Read Access" ON public.tenants FOR ALL USING (true);
CREATE POLICY "Public Read Access Profiles" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Public Read Access Departments" ON public.departments FOR ALL USING (true);
CREATE POLICY "Public Read Access Students" ON public.students FOR ALL USING (true);
CREATE POLICY "Public Read Access Lecturers" ON public.lecturers FOR ALL USING (true);
CREATE POLICY "Public Read Access Courses" ON public.courses FOR ALL USING (true);
CREATE POLICY "Public Read Access Classes" ON public.classes FOR ALL USING (true);
CREATE POLICY "Public Read Access KRS" ON public.krs_enrollments FOR ALL USING (true);
CREATE POLICY "Public Read Access Attendances" ON public.attendances FOR ALL USING (true);
CREATE POLICY "Public Read Access Grades" ON public.grades FOR ALL USING (true);
CREATE POLICY "Public Read Access Revisions" ON public.grade_revisions FOR ALL USING (true);
CREATE POLICY "Public Read Access Announcements" ON public.announcements FOR ALL USING (true);

-- =============================================================================
-- SEED DATA — UNIVERSITAS FATMAWATI DIGITAL (SIAK UFD)
-- =============================================================================

-- 1. Seed Tenant
INSERT INTO public.tenants (id, code, name, domain, status)
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'UFD', 'Universitas Fatmawati Digital', 'ufd.ac.id', 'ACTIVE')
ON CONFLICT (code) DO NOTHING;

-- 2. Seed Departments
INSERT INTO public.departments (code, tenant_id, name, faculty, degree)
VALUES 
('TI-S1', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Teknik Informatika', 'Fakultas Teknologi Informasi & Desain', 'S1'),
('SI-S1', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Sistem Informasi', 'Fakultas Teknologi Informasi & Desain', 'S1')
ON CONFLICT (code) DO NOTHING;

-- 3. Seed Students
INSERT INTO public.students (nim, tenant_id, name, prodi_code, dosen_pa_name, dosen_pa_nidn, semester_active, prev_ips, max_sks, gpa, sks_passed, status)
VALUES 
('2023010042', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Alya Rahma Putri', 'TI-S1', 'Dr. Aditya Pratama', '0412088501', 4, 3.75, 24, 3.82, 68, 'Aktif'),
('20230801045', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Da''ffa Maulana', 'TI-S1', 'Dr. Hendra Gunawan, M.Kom', '0415098202', 4, 3.80, 24, 3.86, 72, 'Aktif')
ON CONFLICT (nim) DO NOTHING;

-- 4. Seed Lecturers
INSERT INTO public.lecturers (nidn, tenant_id, name, academic_title, prodi_code, functional_rank, status)
VALUES 
('0412088501', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Dr. Aditya Pratama', 'Dr., S.Kom., M.T.', 'TI-S1', 'Lektor Kepala', 'Aktif'),
('0415098202', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Dr. Hendra Gunawan, M.Kom', 'Dr., M.Kom.', 'TI-S1', 'Lektor', 'Aktif')
ON CONFLICT (nidn) DO NOTHING;

-- 5. Seed Courses
INSERT INTO public.courses (code, tenant_id, name, sks, semester, prodi_code, prerequisite_code)
VALUES 
('IF201', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Sistem Basis Data Lanjut', 3, 4, 'TI-S1', 'IF102'),
('IF202', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Pemrograman Web Fullstack', 3, 4, 'TI-S1', 'IF101'),
('IF203', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Rekayasa Perangkat Lunak', 3, 4, 'TI-S1', 'IF103'),
('IF204', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Jaringan Komputer & Keamanan', 4, 4, 'TI-S1', NULL),
('IF205', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Kecerdasan Buatan & ML', 3, 4, 'TI-S1', 'IF201'),
('IF301', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Algoritma & Pemrograman Lanjut', 3, 4, 'TI-S1', NULL)
ON CONFLICT (code) DO NOTHING;

-- 6. Seed Classes
INSERT INTO public.classes (id, tenant_id, course_code, course_name, class_name, sks, lecturer_nidn, lecturer_name, day, time_slot, room, capacity, enrolled, grading_status)
VALUES 
('cls-bd-3a', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'IF201', 'Sistem Basis Data Lanjut', 'TI-3A', 3, '0412088501', 'Dr. Aditya Pratama', 'Senin', '08.00 - 09.40', 'Lab 02 Komputer', 40, 38, 'DRAFT'),
('cls-algo-1a', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'IF301', 'Algoritma & Pemrograman Lanjut', 'TI-1A', 3, '0412088501', 'Dr. Aditya Pratama', 'Selasa', '08.00 - 09.40', 'Lab 01 RPL', 40, 39, 'VALIDATED'),
('cls-oop-3b', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'IF202', 'Pemrograman Web Fullstack', 'TI-3B', 3, '0412088501', 'Dr. Aditya Pratama', 'Rabu', '10.00 - 11.40', 'Lab 02 Komputer', 35, 34, 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;

-- 7. Seed Grades
INSERT INTO public.grades (class_id, nim, student_name, tugas, kuis, uts, uas, nilai_akhir, huruf_mutu, bobot, status, tenant_id)
VALUES 
('cls-bd-3a', '2023010042', 'Alya Rahma Putri', 88.00, 85.00, 90.00, 92.00, 89.30, 'A', 4.00, 'DRAFT', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'),
('cls-oop-3b', '2023010042', 'Alya Rahma Putri', 90.00, 88.00, 85.00, 90.00, 88.35, 'A', 4.00, 'PUBLISHED', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'),
('cls-algo-1a', '2023010042', 'Alya Rahma Putri', 82.00, 80.00, 85.00, 85.00, 83.40, 'AB', 3.50, 'VALIDATED', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890')
ON CONFLICT (class_id, nim) DO NOTHING;

-- 8. Seed Announcements
INSERT INTO public.announcements (tenant_id, title, category, date_text, summary)
VALUES 
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Batas Waktu Pengisian FRS Semester Genap 2025/2026', 'Akademik', '18 November 2026', 'Pengisian dan revisi kartu rencana studi paling lambat disetujui Dosen Pembimbing Akademik pada tanggal 25 November 2026.'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Jadwal Validasi & Publikasi Nilai Akhir Semester', 'BAK', '15 November 2026', 'Seluruh dosen pengampu dimohon menyelesaikan finalisasi nilai kelas sebelum batas penguncian sistem pada 30 November 2026.')
ON CONFLICT DO NOTHING;
