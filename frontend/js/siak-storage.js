/**
 * SIAK-STORAGE.JS — Unified LocalStorage Engine & Single Source of Truth
 * Mengelola seluruh data dinamis perkuliahan, nilai, presensi, FRS, transkrip, dan publikasi KHS
 * SIAK UFD Enterprise SaaS
 */

const SIAK_STORAGE_KEY = 'SIAK_UFD_LOCAL_STATE_V1';

// Initial Test Data (Hanya data uji fungsional — tanpa dummy berlebih)
const SIAK_INITIAL_TEST_DATA = {
  activeSemester: '2025/2026 Genap',
  students: [
    {
      nim: '2023010042',
      nama: 'Alya Rahma Putri',
      prodi: 'S1 Teknik Informatika',
      dosen_pa: 'Dr. Aditya Pratama',
      ips_lalu: 3.75,
      max_sks: 24,
      status: 'Aktif'
    },
    {
      nim: '20230801045',
      nama: "Da'ffa Maulana",
      prodi: 'S1 Teknik Informatika',
      dosen_pa: 'Dr. Hendra Gunawan, M.Kom',
      ips_lalu: 3.80,
      max_sks: 24,
      status: 'Aktif'
    }
  ],
  classes: [
    {
      id: 'cls-bd-3a',
      kode_mk: 'IF201',
      nama_mk: 'Sistem Basis Data Lanjut',
      kelas: 'TI-3A',
      sks: 3,
      dosen_nidn: '0412088501',
      dosen_nama: 'Dr. Aditya Pratama',
      hari: 'Senin',
      jam: '08.00 - 09.40',
      ruang: 'Lab 02 Komputer',
      kapasitas: 40,
      status_penilaian: 'DRAFT',
      students: [
        { nim: '2023010042', nama: 'Alya Rahma Putri', tugas: 88, kuis: 85, uts: 90, uas: 92 },
        { nim: '20230801045', nama: "Da'ffa Maulana", tugas: 90, kuis: 88, uts: 92, uas: 94 }
      ]
    },
    {
      id: 'cls-algo-1a',
      kode_mk: 'IF301',
      nama_mk: 'Algoritma & Pemrograman Lanjut',
      kelas: 'TI-1A',
      sks: 3,
      dosen_nidn: '0412088501',
      dosen_nama: 'Dr. Aditya Pratama',
      hari: 'Selasa',
      jam: '08.00 - 09.40',
      ruang: 'Lab 01 RPL',
      kapasitas: 40,
      status_penilaian: 'VALIDATED',
      students: [
        { nim: '2023010042', nama: 'Alya Rahma Putri', tugas: 82, kuis: 80, uts: 85, uas: 85 },
        { nim: '20230801045', nama: "Da'ffa Maulana", tugas: 85, kuis: 84, uts: 88, uas: 89 }
      ]
    },
    {
      id: 'cls-oop-3b',
      kode_mk: 'IF202',
      nama_mk: 'Pemrograman Web Fullstack',
      kelas: 'TI-3B',
      sks: 3,
      dosen_nidn: '0412088501',
      dosen_nama: 'Dr. Aditya Pratama',
      hari: 'Rabu',
      jam: '10.00 - 11.40',
      ruang: 'Lab 02 Komputer',
      kapasitas: 35,
      status_penilaian: 'PUBLISHED',
      students: [
        { nim: '2023010042', nama: 'Alya Rahma Putri', tugas: 90, kuis: 88, uts: 85, uas: 90 },
        { nim: '20230801045', nama: "Da'ffa Maulana", tugas: 92, kuis: 90, uts: 90, uas: 95 }
      ]
    },
    {
      id: 'cls-jarkom-5a',
      kode_mk: 'TI2302',
      nama_mk: 'Jaringan Komputer & Cloud',
      kelas: 'TI-5A',
      sks: 3,
      dosen_nidn: '0415068902',
      dosen_nama: 'Rina Anggraini, M.Kom.',
      hari: 'Kamis',
      jam: '13.00 - 15.30',
      ruang: 'Lab 03 Jaringan',
      kapasitas: 35,
      status_penilaian: 'DRAFT',
      students: [
        { nim: '2023010042', nama: 'Alya Rahma Putri', tugas: 85, kuis: 80, uts: 88, uas: 86 }
      ]
    },
    {
      id: 'cls-so-5a',
      kode_mk: 'TI2304',
      nama_mk: 'Sistem Operasi Terdistribusi',
      kelas: 'TI-5A',
      sks: 3,
      dosen_nidn: '0408098201',
      dosen_nama: 'Dr. Maya Lestari',
      hari: 'Jumat',
      jam: '08.00 - 10.30',
      ruang: 'R. 402 Teori',
      kapasitas: 40,
      status_penilaian: 'DRAFT',
      students: [
        { nim: '2023010042', nama: 'Alya Rahma Putri', tugas: 89, kuis: 86, uts: 87, uas: 90 }
      ]
    }
  ],
  frs: [
    {
      nim: '2023010042',
      status: 'draft', // 'draft' | 'submitted'
      courses: [
        { id: 'cls-bd-3a', kode: 'IF201', matkul: 'Sistem Basis Data Lanjut', dosen: 'Dr. Aditya Pratama', kelas: 'TI-3A', sks: 3 },
        { id: 'cls-algo-1a', kode: 'IF301', matkul: 'Algoritma & Pemrograman Lanjut', dosen: 'Dr. Aditya Pratama', kelas: 'TI-1A', sks: 3 },
        { id: 'cls-oop-3b', kode: 'IF202', matkul: 'Pemrograman Web Fullstack', dosen: 'Dr. Aditya Pratama', kelas: 'TI-3B', sks: 3 },
        { id: 'cls-jarkom-5a', kode: 'TI2302', matkul: 'Jaringan Komputer & Cloud', dosen: 'Rina Anggraini, M.Kom.', kelas: 'TI-5A', sks: 3 },
        { id: 'cls-so-5a', kode: 'TI2304', matkul: 'Sistem Operasi Terdistribusi', dosen: 'Dr. Maya Lestari', kelas: 'TI-5A', sks: 3 }
      ]
    }
  ],
  revisions: [
    {
      id: 'REV-2025-001',
      nim: '2023010042',
      nama: 'Alya Rahma Putri',
      prodi: 'Teknik Informatika',
      mata_kuliah: 'Sistem Basis Data Lanjut',
      nilai_awal: 'B',
      nilai_diajukan: 'A',
      tanggal: '16 Agu 2025',
      dosen: 'Dr. Aditya Pratama',
      alasan: 'Koreksi penilaian tugas besar dan evaluasi proyek akhir',
      status: 'Menunggu' // 'Menunggu' | 'Disetujui' | 'Ditolak'
    },
    {
      id: 'REV-2025-002',
      nim: '20230801045',
      nama: "Da'ffa Maulana",
      prodi: 'Teknik Informatika',
      mata_kuliah: 'Algoritma & Pemrograman Lanjut',
      nilai_awal: 'B',
      nilai_diajukan: 'AB',
      tanggal: '17 Agu 2025',
      dosen: 'Dr. Aditya Pratama',
      alasan: 'Koreksi komponen nilai kuis susulan terverifikasi',
      status: 'Menunggu'
    }
  ],
  transcript_history: [
    {
      semester: 1,
      nama_semester: 'SEMESTER 1 (GANJIL 2023/2024)',
      courses: [
        { kode: 'TI1101', nama: 'Pendidikan Agama', sks: 3, nilai: 'A', bobot: 4.0 },
        { kode: 'TI1102', nama: 'Pancasila & Kewarganegaraan', sks: 2, nilai: 'A', bobot: 4.0 },
        { kode: 'TI1103', nama: 'Bahasa Indonesia', sks: 2, nilai: 'A', bobot: 4.0 },
        { kode: 'TI1104', nama: 'Kalkulus I', sks: 3, nilai: 'AB', bobot: 3.5 },
        { kode: 'TI1105', nama: 'Fisika Dasar', sks: 3, nilai: 'AB', bobot: 3.5 },
        { kode: 'TI1106', nama: 'Dasar Pemrograman', sks: 4, nilai: 'A', bobot: 4.0 },
        { kode: 'TI1107', nama: 'Pengantar Teknologi Informasi', sks: 3, nilai: 'A', bobot: 4.0 }
      ]
    },
    {
      semester: 2,
      nama_semester: 'SEMESTER 2 (GENAP 2023/2024)',
      courses: [
        { kode: 'TI1201', nama: 'Kalkulus II', sks: 3, nilai: 'B', bobot: 3.0 },
        { kode: 'TI1202', nama: 'Matematika Diskrit', sks: 3, nilai: 'A', bobot: 4.0 },
        { kode: 'TI1203', nama: 'Algoritma & Struktur Data', sks: 4, nilai: 'A', bobot: 4.0 },
        { kode: 'TI1204', nama: 'Sistem Digital', sks: 3, nilai: 'A', bobot: 4.0 },
        { kode: 'TI1205', nama: 'Bahasa Inggris', sks: 2, nilai: 'A', bobot: 4.0 },
        { kode: 'TI1206', nama: 'Organisasi Komputer', sks: 3, nilai: 'AB', bobot: 3.5 },
        { kode: 'TI1207', nama: 'Komunikasi Interpersonal', sks: 2, nilai: 'A', bobot: 4.0 }
      ]
    },
    {
      semester: 3,
      nama_semester: 'SEMESTER 3 (GANJIL 2024/2025)',
      courses: [
        { kode: 'TI2301', nama: 'Basis Data', sks: 3, nilai: 'A', bobot: 4.0 },
        { kode: 'TI2302', nama: 'Jaringan Komputer', sks: 3, nilai: 'A', bobot: 4.0 },
        { kode: 'TI2303', nama: 'Statistika & Probabilitas', sks: 3, nilai: 'AB', bobot: 3.5 },
        { kode: 'TI2304', nama: 'Sistem Operasi', sks: 3, nilai: 'A', bobot: 4.0 },
        { kode: 'TI2305', nama: 'Pemrograman Web', sks: 3, nilai: 'A', bobot: 4.0 },
        { kode: 'TI2306', nama: 'Interaksi Manusia Komputer', sks: 3, nilai: 'A', bobot: 4.0 },
        { kode: 'TI2307', nama: 'Bahasa Inggris Akademik', sks: 3, nilai: 'A', bobot: 4.0 }
      ]
    },
    {
      semester: 4,
      nama_semester: 'SEMESTER 4 (GENAP 2024/2025)',
      courses: [
        { kode: 'TI2401', nama: 'Analisis & Perancangan Sistem', sks: 3, nilai: 'A', bobot: 4.0 },
        { kode: 'TI2402', nama: 'Pemrograman Berorientasi Objek', sks: 3, nilai: 'A', bobot: 4.0 },
        { kode: 'TI2403', nama: 'Struktur Data Lanjut', sks: 3, nilai: 'A', bobot: 4.0 },
        { kode: 'TI2404', nama: 'Matematika Diskrit Lanjut', sks: 3, nilai: 'A', bobot: 4.0 },
        { kode: 'TI2405', nama: 'Arsitektur Komputer Lanjut', sks: 3, nilai: 'A', bobot: 4.0 },
        { kode: 'TI2406', nama: 'Metode Penelitian', sks: 3, nilai: 'A', bobot: 4.0 },
        { kode: 'TI2407', nama: 'Kewirausahaan', sks: 3, nilai: 'B', bobot: 3.0 }
      ]
    }
  ]
};

class SiakStorageEngine {
  constructor() {
    this.init();
  }

  init() {
    try {
      const raw = localStorage.getItem(SIAK_STORAGE_KEY);
      if (!raw) {
        this.save(SIAK_INITIAL_TEST_DATA);
      }
    } catch (e) {
      console.warn('[SiakStorage] LocalStorage unavailable:', e);
    }
  }

  get() {
    try {
      const raw = localStorage.getItem(SIAK_STORAGE_KEY);
      return raw ? JSON.parse(raw) : SIAK_INITIAL_TEST_DATA;
    } catch (e) {
      return SIAK_INITIAL_TEST_DATA;
    }
  }

  save(data) {
    try {
      localStorage.setItem(SIAK_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('[SiakStorage] Save error:', e);
    }
  }

  // Formula Perhitungan Nilai: Tugas 20%, Kuis 20%, UTS 25%, UAS 35%
  calculateGrade(tugas, kuis, uts, uas) {
    const na = (tugas * 0.20) + (kuis * 0.20) + (uts * 0.25) + (uas * 0.35);
    const finalNa = Number(na.toFixed(2));
    let letter = 'E';
    let bobot = 0.0;

    if (finalNa >= 85) { letter = 'A'; bobot = 4.0; }
    else if (finalNa >= 80) { letter = 'AB'; bobot = 3.5; }
    else if (finalNa >= 75) { letter = 'B'; bobot = 3.0; }
    else if (finalNa >= 70) { letter = 'BC'; bobot = 2.5; }
    else if (finalNa >= 65) { letter = 'C'; bobot = 2.0; }
    else if (finalNa >= 55) { letter = 'D'; bobot = 1.0; }
    else { letter = 'E'; bobot = 0.0; }

    return { na: finalNa, letter, bobot };
  }

  // 1. Data KHS Mahasiswa (Hanya menampilkan kelas yang statusnya PUBLISHED)
  getStudentKHS(nim) {
    const data = this.get();
    const student = data.students.find(s => s.nim === nim) || data.students[0];
    const results = [];

    data.classes.forEach(cls => {
      if (cls.status_penilaian === 'PUBLISHED') {
        const studentScore = cls.students.find(s => s.nim === student.nim);
        if (studentScore) {
          const calc = this.calculateGrade(studentScore.tugas, studentScore.kuis, studentScore.uts, studentScore.uas);
          results.push({
            kode_mk: cls.kode_mk,
            nama_mk: cls.nama_mk,
            kelas: cls.kelas,
            sks: cls.sks,
            tugas: studentScore.tugas,
            kuis: studentScore.kuis,
            uts: studentScore.uts,
            uas: studentScore.uas,
            na: calc.na,
            letter: calc.letter,
            bobot: calc.bobot,
            mutu: Number((cls.sks * calc.bobot).toFixed(2))
          });
        }
      }
    });

    const totalSks = results.reduce((sum, r) => sum + r.sks, 0);
    const totalMutu = results.reduce((sum, r) => sum + r.mutu, 0);
    const ips = totalSks > 0 ? Number((totalMutu / totalSks).toFixed(2)) : 0.0;

    let maxSksNext = 18;
    if (ips >= 3.50) maxSksNext = 24;
    else if (ips >= 3.00) maxSksNext = 22;
    else if (ips >= 2.50) maxSksNext = 20;
    else if (ips >= 2.00) maxSksNext = 18;
    else maxSksNext = 15;

    return {
      student,
      semester: data.activeSemester,
      courses: results,
      totalSks,
      totalMutu,
      ips,
      maxSksNext
    };
  }

  // 2. Data Transkrip Akademik Kumulatif (Semester 1–4 + Nilai Published Terkini)
  getStudentTranscript(nim) {
    const data = this.get();
    const student = data.students.find(s => s.nim === nim) || data.students[0];
    const semesters = JSON.parse(JSON.stringify(data.transcript_history || []));

    // Tambahkan mata kuliah published semester aktif jika ada
    const currentKHS = this.getStudentKHS(student.nim);
    if (currentKHS.courses.length > 0) {
      semesters.push({
        semester: 5,
        nama_semester: `SEMESTER 5 (${data.activeSemester})`,
        courses: currentKHS.courses.map(c => ({
          kode: c.kode_mk,
          nama: c.nama_mk,
          sks: c.sks,
          nilai: c.letter,
          bobot: c.bobot
        }))
      });
    }

    let grandTotalSks = 0;
    let grandTotalMutu = 0;
    let counter = 1;

    semesters.forEach(sem => {
      sem.courses.forEach(c => {
        c.no = counter++;
        c.mutu = Number((c.sks * c.bobot).toFixed(2));
        grandTotalSks += c.sks;
        grandTotalMutu += c.mutu;
      });
    });

    const ipk = grandTotalSks > 0 ? Number((grandTotalMutu / grandTotalSks).toFixed(2)) : 0.0;
    let predikat = 'Memuaskan';
    if (ipk >= 3.51) predikat = 'Dengan Pujian (Cum Laude)';
    else if (ipk >= 3.00) predikat = 'Sangat Memuaskan';
    else if (ipk >= 2.76) predikat = 'Memuaskan';
    else predikat = 'Cukup';

    return {
      student,
      semesters,
      totalCourses: counter - 1,
      totalSks: grandTotalSks,
      totalMutu: Number(grandTotalMutu.toFixed(2)),
      ipk,
      predikat
    };
  }

  // 3. FRS / KRS Online Engine
  getStudentFRS(nim) {
    const data = this.get();
    let userFrs = data.frs ? data.frs.find(f => f.nim === nim) : null;
    if (!userFrs) {
      userFrs = {
        nim,
        status: 'draft',
        courses: data.classes.slice(0, 5).map(c => ({
          id: c.id,
          kode: c.kode_mk,
          matkul: c.nama_mk,
          dosen: c.dosen_nama,
          kelas: c.kelas,
          sks: c.sks
        }))
      };
      if (!data.frs) data.frs = [];
      data.frs.push(userFrs);
      this.save(data);
    }
    return userFrs;
  }

  saveStudentFRS(nim, courses, status = null) {
    const data = this.get();
    if (!data.frs) data.frs = [];
    let userFrs = data.frs.find(f => f.nim === nim);
    if (!userFrs) {
      userFrs = { nim, status: 'draft', courses: [] };
      data.frs.push(userFrs);
    }
    userFrs.courses = courses;
    if (status) userFrs.status = status;
    this.save(data);
    return userFrs;
  }

  // 4. Perbaikan Nilai Engine
  getRevisions() {
    const data = this.get();
    return data.revisions || [];
  }

  reviewRevision(revisionId, action, reviewer = 'Operator BAK') {
    const data = this.get();
    const rev = (data.revisions || []).find(r => r.id === revisionId);
    if (!rev) return false;

    if (action === 'APPROVE') {
      rev.status = 'Disetujui';
      rev.reviewed_by = reviewer;
      rev.reviewed_at = new Date().toISOString();
    } else {
      rev.status = 'Ditolak';
      rev.reviewed_by = reviewer;
      rev.reviewed_at = new Date().toISOString();
    }

    this.save(data);
    return true;
  }

  // 5. Data Kelas & Input Nilai Dosen
  getClassById(classId) {
    const data = this.get();
    return data.classes.find(c => c.id === classId) || data.classes[0];
  }

  saveClassGrades(classId, studentRows, newStatus = null) {
    const data = this.get();
    const target = data.classes.find(c => c.id === classId);
    if (!target) return false;

    studentRows.forEach(row => {
      const match = target.students.find(s => s.nim === row.nim);
      if (match) {
        match.tugas = Number(row.tugas);
        match.kuis = Number(row.kuis);
        match.uts = Number(row.uts);
        match.uas = Number(row.uas);
      }
    });

    if (newStatus) {
      target.status_penilaian = newStatus;
    }

    this.save(data);
    return true;
  }

  // 6. Validasi & Publikasi Nilai BAK
  updateClassStatus(classId, status, rejectionNote = '') {
    const data = this.get();
    const target = data.classes.find(c => c.id === classId);
    if (target) {
      target.status_penilaian = status;
      if (rejectionNote) target.rejection_note = rejectionNote;
      this.save(data);
      return true;
    }
    return false;
  }

  publishBatchClasses(classIds) {
    const data = this.get();
    data.classes.forEach(c => {
      if (!classIds || classIds.length === 0 || classIds.includes(c.id)) {
        if (c.status_penilaian === 'VALIDATED') {
          c.status_penilaian = 'PUBLISHED';
        }
      }
    });
    this.save(data);
    return true;
  }

  // Reset helper
  resetToTestData() {
    this.save(SIAK_INITIAL_TEST_DATA);
    console.log('[SiakStorage] Reset to clean initial test state.');
  }
}

// Global Singleton
window.siakStorage = new SiakStorageEngine();
