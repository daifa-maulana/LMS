/**
 * DATA.JS - Basis Data & State Akademik Mahasiswa
 * Menyimpan data profil, mata kuliah, FRS, KHS, jadwal, dan histori IPK
 */

const LMS_DATA = {
  // Profil Mahasiswa (Sesuai Screenshot Portal Digitech University)
  mahasiswa: {
    nim: "20230801045",
    nama: "Da'ffa Maulana",
    program_studi: "Teknik Informatika (S-1)",
    fakultas: "Fakultas Teknologi & Desain",
    dosen_pa: "Dr. Hendra Gunawan, M.Kom",
    semester_aktif: "2024/2025 Genap",
    semester_ke: 4,
    status_studi: "Aktif",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  },

  // Histori IPK per Semester untuk Grafik "Perkembangan IPK"
  ipk_history: [
    { semester: "Semester 1", ipk: 3.75 },
    { semester: "Semester 2", ipk: 3.80 },
    { semester: "Semester 3", ipk: 3.82 },
    { semester: "Semester 4", ipk: 3.86 }
  ],

  // Katalog Mata Kuliah yang Ditawarkan Semester Ini
  katalog_mk: [
    { kode: "IF201", nama: "Sistem Basis Data Lanjut", sks: 3, dosen: "Dr. Hendra Gunawan, M.Kom", hari: "Senin", jam: "08:00 - 10:30", ruang: "Lab Komputer 3" },
    { kode: "IF202", nama: "Pemrograman Web Fullstack", sks: 3, dosen: "Nurul Aini, S.Kom., M.T.", hari: "Rabu", jam: "10:30 - 13:00", ruang: "Lab RPL" },
    { kode: "IF203", nama: "Rekayasa Perangkat Lunak", sks: 3, dosen: "Bambang Sudarsono, M.T.I.", hari: "Selasa", jam: "13:00 - 15:30", ruang: "R. Teori 401" },
    { kode: "IF204", nama: "Jaringan Komputer & Keamanan", sks: 4, dosen: "Achmad Prasetyo, M.Kom", hari: "Kamis", jam: "08:00 - 11:20", ruang: "Lab Cisco" },
    { kode: "IF205", nama: "Kecerdasan Buatan & ML", sks: 3, dosen: "Dr. Hendra Gunawan, M.Kom", hari: "Jumat", jam: "08:30 - 11:00", ruang: "Smart Class 1" }
  ],

  // Rencana Studi yang Diambil (FRS / KRS Aktif)
  frs_aktif: [
    { id: 1, kode: "IF201", nama: "Sistem Basis Data Lanjut", sks: 3, hari: "Senin", jam: "08:00 - 10:30", ruang: "Lab 3", dosen: "Dr. Hendra Gunawan", status: "Disetujui Pembimbing" },
    { id: 2, kode: "IF202", nama: "Pemrograman Web Fullstack", sks: 3, hari: "Rabu", jam: "10:30 - 13:00", ruang: "Lab RPL", dosen: "Nurul Aini, M.T.", status: "Disetujui Pembimbing" },
    { id: 3, kode: "IF203", nama: "Rekayasa Perangkat Lunak", sks: 3, hari: "Selasa", jam: "13:00 - 15:30", ruang: "R. 401", dosen: "Bambang Sudarsono", status: "Disetujui Pembimbing" },
    { id: 4, kode: "IF204", nama: "Jaringan Komputer & Keamanan", sks: 4, hari: "Kamis", jam: "08:00 - 11:20", ruang: "Lab Cisco", dosen: "Achmad Prasetyo", status: "Disetujui Pembimbing" },
    { id: 5, kode: "IF205", nama: "Kecerdasan Buatan & ML", sks: 3, hari: "Jumat", jam: "08:30 - 11:00", ruang: "Smart 1", dosen: "Dr. Hendra Gunawan", status: "Disetujui Pembimbing" }
  ],

  // Hasil Studi Semester (KHS)
  khs_semester: [
    { kode: "IF201", nama: "Sistem Basis Data Lanjut", sks: 3, nilai_angka: 88.5, nilai_huruf: "A", bobot: 4.0 },
    { kode: "IF202", nama: "Pemrograman Web Fullstack", sks: 3, nilai_angka: 90.0, nilai_huruf: "A", bobot: 4.0 },
    { kode: "IF203", nama: "Rekayasa Perangkat Lunak", sks: 3, nilai_angka: 82.0, nilai_huruf: "A-", bobot: 3.7 },
    { kode: "IF204", nama: "Jaringan Komputer & Keamanan", sks: 4, nilai_angka: 85.0, nilai_huruf: "A", bobot: 4.0 },
    { kode: "IF205", nama: "Kecerdasan Buatan & ML", sks: 3, nilai_angka: 81.5, nilai_huruf: "A-", bobot: 3.7 }
  ],

  // Pengumuman Kampus
  pengumuman: [
    {
      id: "P01",
      tanggal: "10 Nov 2026",
      judul: "Batas Waktu Pengisian FRS Semester Genap 2024/2025",
      ringkasan: "Pengisian dan revisi kartu rencana studi paling lambat disetujui Dosen Pembimbing Akademik pada tanggal 20 November 2026."
    }
  ]
};

// LocalStorage Helper
const STORAGE_KEY = 'DIGITECH_LMS_STUDENT_DATA_V2';

function loadLMSData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Gagal memuat local data:", e);
  }
  return JSON.parse(JSON.stringify(LMS_DATA));
}

function saveLMSData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Gagal simpan local data:", e);
  }
}

// Global Store Instance
window.lmsStore = loadLMSData();

