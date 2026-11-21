# SIAK UFD Frontend Web Client
**Modern Academic Portal & Learning Management Client**  
*Universitas Fatmawati Digital (SIAK UFD)*

---

## 🎨 Gambaran Antarmuka

Frontend SIAK UFD mencakup **28 halaman produksi** lengkap berbasis **FigCraft Design System** bertema emerald premium (`#237757`) dengan jaminan **Zero Layout Shift (0 CLS)** dan **Zero Horizontal Scroll**:
- **Auth (1 Halaman)**: Portal login split-screen interaktif (`pages/auth/`).
- **Mahasiswa (9 Halaman)**: Dashboard, Jadwal, FRS/KRS, KHS, Transkrip, Presensi, Kurikulum, Biodata, Pengaturan (`pages/mahasiswa/`).
- **Dosen (8 Halaman)**: Dashboard, Jadwal Mengajar, Kelas Saya, Data Mahasiswa, Input Nilai Multi-Komponen, Presensi 16 Sesi, Validasi Kelas, Riwayat Penilaian (`pages/dosen/`).
- **Operator BAK (10 Halaman)**: Dashboard KPI, Mahasiswa, Dosen, Prodi, Mata Kuliah, FRS/KRS, Antrean Validasi Nilai, Publikasi KHS, Perbaikan Nilai (*Audit Trail*), KHS & Transkrip Resmi (`pages/akademik/`).

---

## 🌐 Koneksi API & Adaptor Client (`js/api-client.js`)

Frontend telah dilengkapi dengan **Universal API Client** (`js/api-client.js`) yang:
1. Terkoneksi secara otomatis ke backend REST API di `http://localhost:5000/api/v1`.
2. Menyertakan header multi-tenant `X-Tenant-ID: ten-ufd-prod` dan Authorization Bearer token secara transparan.
3. Memiliki fitur **Automatic Offline Fallback**: Jika backend sedang tidak dijalankan, halaman tetap berjalan 100% mulus menggunakan mock store lokal (`js/data.js`).

---

## 🚀 Cara Menjalankan Frontend

1. **Jalankan via Dev Server Port 3000**:
   ```bash
   cd frontend
   npm start
   ```
   Buka browser di `http://localhost:3000`.

2. **Atau Buka Langsung (Tanpa Server)**:
   Buka file `frontend/index.html` langsung dengan klik dua kali di Windows Explorer.
