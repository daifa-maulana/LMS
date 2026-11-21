/**
 * SIAK-STORAGE.JS — Unified LocalStorage Engine & Single Source of Truth
 * Mengelola seluruh data dinamis perkuliahan, nilai, presensi, FRS, dan publikasi KHS
 * SIAK UFD Enterprise SaaS
 */

const SIAK_STORAGE_KEY = 'SIAK_UFD_LOCAL_STATE_V1';

// Initial Test Data (Hanya data uji fungsional)
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
    }
  ],
  frs: [
    { nim: '2023010042', class_id: 'cls-bd-3a', status: 'Disetujui Pembimbing' },
    { nim: '2023010042', class_id: 'cls-algo-1a', status: 'Disetujui Pembimbing' },
    { nim: '2023010042', class_id: 'cls-oop-3b', status: 'Disetujui Pembimbing' }
  ],
  revisions: []
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
      // Hanya sertakan kelas yang sudah resmi dipublikasikan
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

  // 2. Data Kelas & Input Nilai Dosen
  getClassById(classId) {
    const data = this.get();
    return data.classes.find(c => c.id === classId) || data.classes[0];
  }

  saveClassGrades(classId, studentRows, newStatus = null) {
    const data = this.get();
    const target = data.classes.find(c => c.id === classId);
    if (!target) return false;

    // Update students scores
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

  // 3. Validasi & Publikasi Nilai BAK
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
