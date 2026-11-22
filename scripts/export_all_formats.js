/**
 * EXPORT_ALL_FORMATS.JS
 * Menghasilkan dokumen akademik nyata dalam format:
 * 1. PDF (.pdf) — Beresolusi tinggi, siap cetak / arsip resmi
 * 2. Word (.doc) — Dokumen Microsoft Word resmi terformat
 * 3. HTML (.html) — Dokumen web standalone siap buka di browser
 * 
 * SIAK UFD Enterprise Academic ERP
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outputDir = path.join(__dirname, '../output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Jalankan generator HTML terlebih dahulu
require('./generate_academic_outputs.js');

// -------------------------------------------------------------
// 1. GENERATE WORD .DOC FORMAT
// -------------------------------------------------------------
function createWordDoc(title, bodyContent) {
  return `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${title}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: 595.3pt 841.9pt; /* A4 */
      margin: 1.0in 1.0in 1.0in 1.0in;
      mso-header-margin: 35.4pt;
      mso-footer-margin: 35.4pt;
      mso-paper-source: 0;
    }
    div.Section1 { page: Section1; }
    body { font-family: 'Times New Roman', Times, serif; font-size: 11pt; color: #000000; }
    table { width: 100%; border-collapse: collapse; margin-top: 10pt; margin-bottom: 10pt; }
    table, th, td { border: 1pt solid #000000; }
    th { background-color: #E2E8F0; padding: 6pt; font-weight: bold; text-align: center; }
    td { padding: 5pt; }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .kop { text-align: center; margin-bottom: 12pt; }
    .univ { font-size: 14pt; font-weight: bold; }
    .fakultas { font-size: 12pt; font-weight: bold; color: #237757; }
    .sub { font-size: 9pt; color: #555555; }
    .garis-kop { border-top: 2pt solid #000000; border-bottom: 1pt solid #000000; height: 3pt; margin-top: 6pt; margin-bottom: 14pt; }
    .doc-title { text-align: center; font-size: 12pt; font-weight: bold; text-transform: uppercase; margin-bottom: 12pt; }
    .meta-table { border: none !important; margin-bottom: 12pt; }
    .meta-table td { border: none !important; padding: 2pt 4pt; font-size: 10pt; }
    .summary-box { border: 1pt solid #000000; padding: 6pt; margin-top: 10pt; font-weight: bold; }
  </style>
</head>
<body>
<div class="Section1">
  <div class="kop">
    <div class="univ">UNIVERSITAS FATMAWATI DIGITAL</div>
    <div class="fakultas">FAKULTAS TEKNOLOGI INFORMASI & DESAIN</div>
    <div class="sub">BIRO ADMINISTRASI AKADEMIK & KEMAHASISWAAN (BAK)</div>
    <div class="sub">Jl. Margonda Raya No. 100, Depok, Jawa Barat · Telp: (021) 786-3421 · Email: info@ufd.ac.id</div>
    <div class="garis-kop"></div>
  </div>
  ${bodyContent}
</div>
</body>
</html>`;
}

// KHS DOC CONTENT
const khsDocBody = `
  <div class="doc-title">
    KARTU HASIL STUDI (KHS)<br>
    <span style="font-size: 10pt; font-weight: normal;">Semester Genap · Tahun Akademik 2024/2025</span><br>
    <span style="font-size: 9pt; font-family: monospace;">Nomor: KHS/20242/TI/010042</span>
  </div>

  <table class="meta-table">
    <tr>
      <td width="20%">Nama Mahasiswa</td><td width="2%">:</td><td width="38%"><strong>Alya Rahma Putri</strong></td>
      <td width="20%">Tahun Masuk / Smtr</td><td width="2%">:</td><td width="18%">2023 / 4 (Empat)</td>
    </tr>
    <tr>
      <td>NIM</td><td>:</td><td><strong>2023010042</strong></td>
      <td>Dosen Pembimbing PA</td><td>:</td><td>Dr. Maya Lestari</td>
    </tr>
    <tr>
      <td>Program Studi</td><td>:</td><td>S1 Teknik Informatika</td>
      <td>Status Mahasiswa</td><td>:</td><td>Aktif Kuliah</td>
    </tr>
  </table>

  <table>
    <thead>
      <tr>
        <th width="5%">NO</th>
        <th width="15%">KODE MK</th>
        <th>NAMA MATA KULIAH</th>
        <th width="8%">KELAS</th>
        <th width="6%">SKS</th>
        <th width="8%">NILAI</th>
        <th width="8%">BOBOT</th>
        <th width="10%">MUTU</th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="text-center">1</td><td class="text-center">TI2401</td><td>Analisis & Perancangan Sistem</td><td class="text-center">TI-4A</td><td class="text-center">3</td><td class="text-center"><strong>A</strong></td><td class="text-center">4.00</td><td class="text-right">12.00</td></tr>
      <tr><td class="text-center">2</td><td class="text-center">TI2402</td><td>Pemrograman Berorientasi Objek</td><td class="text-center">TI-4A</td><td class="text-center">3</td><td class="text-center"><strong>A</strong></td><td class="text-center">4.00</td><td class="text-right">12.00</td></tr>
      <tr><td class="text-center">3</td><td class="text-center">TI2403</td><td>Struktur Data & Algoritma Lanjut</td><td class="text-center">TI-4A</td><td class="text-center">3</td><td class="text-center"><strong>A</strong></td><td class="text-center">4.00</td><td class="text-right">12.00</td></tr>
      <tr><td class="text-center">4</td><td class="text-center">TI2404</td><td>Matematika Diskrit Lanjut</td><td class="text-center">TI-4A</td><td class="text-center">3</td><td class="text-center"><strong>A</strong></td><td class="text-center">4.00</td><td class="text-right">12.00</td></tr>
      <tr><td class="text-center">5</td><td class="text-center">TI2405</td><td>Arsitektur Komputer Lanjut</td><td class="text-center">TI-4A</td><td class="text-center">3</td><td class="text-center"><strong>A</strong></td><td class="text-center">4.00</td><td class="text-right">12.00</td></tr>
      <tr><td class="text-center">6</td><td class="text-center">TI2406</td><td>Metode Penelitian Informatika</td><td class="text-center">TI-4A</td><td class="text-center">3</td><td class="text-center"><strong>A</strong></td><td class="text-center">4.00</td><td class="text-right">12.00</td></tr>
      <tr><td class="text-center">7</td><td class="text-center">TI2407</td><td>Kewirausahaan & Startup Teknologi</td><td class="text-center">TI-4A</td><td class="text-center">3</td><td class="text-center"><strong>B</strong></td><td class="text-center">3.00</td><td class="text-right">9.00</td></tr>
    </tbody>
    <tfoot>
      <tr style="background-color: #F8FAFC; font-weight: bold;">
        <td colspan="4" class="text-right">TOTAL:</td>
        <td class="text-center">21</td>
        <td colspan="2"></td>
        <td class="text-right">81.00</td>
      </tr>
    </tfoot>
  </table>

  <div class="summary-box">
    Indeks Prestasi Semester (IPS): 3.86 &nbsp;|&nbsp; Total SKS Semester: 21 SKS &nbsp;|&nbsp; Maks. SKS Semester Berikutnya: 24 SKS
  </div>

  <br><br>
  <table style="border: none !important;">
    <tr>
      <td width="50%" class="text-center" style="border: none !important;">
        Mengetahui,<br>Ketua Program Studi Teknik Informatika<br><br><br><br>
        <strong><u>Prof. Dr. Ir. Hendra Gunawan, M.T.</u></strong><br>NIP 197805142003121002
      </td>
      <td width="50%" class="text-center" style="border: none !important;">
        Bandung, 18 Juli 2025<br>Dosen Pembimbing Akademik,<br><br><br><br>
        <strong><u>Dr. Maya Lestari</u></strong><br>NIDN 0408098201
      </td>
    </tr>
  </table>
`;

// KRS DOC CONTENT
const krsDocBody = `
  <div class="doc-title">
    KARTU RENCANA STUDI (KRS)<br>
    <span style="font-size: 10pt; font-weight: normal;">Semester Ganjil · Tahun Akademik 2025/2026</span><br>
    <span style="font-size: 9pt; font-family: monospace;">Nomor: KRS/20251/TI/010042</span>
  </div>

  <table class="meta-table">
    <tr>
      <td width="20%">Nama Mahasiswa</td><td width="2%">:</td><td width="38%"><strong>Alya Rahma Putri</strong></td>
      <td width="20%">Semester Tempuh</td><td width="2%">:</td><td width="18%">5 (Lima)</td>
    </tr>
    <tr>
      <td>NIM</td><td>:</td><td><strong>2023010042</strong></td>
      <td>Batas SKS / IPS Lalu</td><td>:</td><td>24 SKS / 3.86</td>
    </tr>
    <tr>
      <td>Program Studi</td><td>:</td><td>S1 Teknik Informatika</td>
      <td>Status Pengesahan</td><td>:</td><td><strong>Disetujui DPA</strong></td>
    </tr>
  </table>

  <table>
    <thead>
      <tr>
        <th width="5%">NO</th>
        <th width="12%">KODE</th>
        <th>MATA KULIAH</th>
        <th width="8%">KELAS</th>
        <th width="6%">SKS</th>
        <th width="22%">HARI & JADWAL</th>
        <th>DOSEN PENGAMPU</th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="text-center">1</td><td class="text-center">TI3501</td><td>Sistem Basis Data Terdistribusi</td><td class="text-center">TI-5A</td><td class="text-center">3</td><td>Senin, 08.00–09.40 (Lab 02)</td><td>Dr. Aditya Pratama</td></tr>
      <tr><td class="text-center">2</td><td class="text-center">TI3502</td><td>Jaringan Komputer & Cloud Infrastructure</td><td class="text-center">TI-5A</td><td class="text-center">3</td><td>Selasa, 10.00–11.40 (Lab RPL)</td><td>Rina Anggraini, M.Kom.</td></tr>
      <tr><td class="text-center">3</td><td class="text-center">TI3503</td><td>Kecerdasan Buatan & Machine Learning</td><td class="text-center">TI-5A</td><td class="text-center">3</td><td>Rabu, 08.00–09.40 (R. 401)</td><td>Dr. Hendra Gunawan, M.Kom.</td></tr>
      <tr><td class="text-center">4</td><td class="text-center">TI3504</td><td>Sistem Operasi Terdistribusi</td><td class="text-center">TI-5A</td><td class="text-center">3</td><td>Kamis, 08.00–09.40 (R. 402)</td><td>Dr. Maya Lestari</td></tr>
      <tr><td class="text-center">5</td><td class="text-center">TI3505</td><td>Rekayasa Perangkat Lunak Berbasis Agile</td><td class="text-center">TI-5A</td><td class="text-center">3</td><td>Kamis, 13.00–14.40 (Lab RPL)</td><td>Fajar Hidayat, M.Kom.</td></tr>
      <tr><td class="text-center">6</td><td class="text-center">TI3506</td><td>Interaksi Manusia & Komputer</td><td class="text-center">TI-5A</td><td class="text-center">3</td><td>Jumat, 08.00–09.40 (R. 305)</td><td>Dr. Indah Puspita</td></tr>
      <tr><td class="text-center">7</td><td class="text-center">TI3507</td><td>Keamanan Informasi & Etika Siber</td><td class="text-center">TI-5A</td><td class="text-center">3</td><td>Jumat, 13.30–15.10 (Lab Siber)</td><td>Dr. Hendra Gunawan, M.Kom.</td></tr>
    </tbody>
    <tfoot>
      <tr style="background-color: #F8FAFC; font-weight: bold;">
        <td colspan="4" class="text-right">TOTAL SKS DIAMBIL:</td>
        <td class="text-center">21 SKS</td>
        <td colspan="2">Sisa Kuota: 3 SKS dari batas maksimal 24 SKS</td>
      </tr>
    </tfoot>
  </table>

  <br><br>
  <table style="border: none !important;">
    <tr>
      <td width="50%" class="text-center" style="border: none !important;">
        Mahasiswa Yang Bersangkutan,<br><br><br><br>
        <strong><u>Alya Rahma Putri</u></strong><br>NIM 2023010042
      </td>
      <td width="50%" class="text-center" style="border: none !important;">
        Bandung, 18 Agustus 2025<br>Dosen Pembimbing Akademik (DPA),<br><br><br><br>
        <strong><u>Dr. Maya Lestari</u></strong><br>NIDN 0408098201
      </td>
    </tr>
  </table>
`;

// TRANSKRIP DOC CONTENT
const transkripDocBody = `
  <div class="doc-title">
    TRANSKRIP AKADEMIK SEMENTARA<br>
    <span style="font-size: 10pt; font-weight: normal;">Rekam Hasil Studi Kumulatif Program Sarjana (S1)</span><br>
    <span style="font-size: 9pt; font-family: monospace;">Nomor: 042/TA/BAK/UFD/VIII/2025</span>
  </div>

  <table class="meta-table">
    <tr>
      <td width="20%">Nama Mahasiswa</td><td width="2%">:</td><td width="38%"><strong>Alya Rahma Putri</strong></td>
      <td width="20%">Program Studi</td><td width="2%">:</td><td width="18%">S1 Teknik Informatika</td>
    </tr>
    <tr>
      <td>NIM</td><td>:</td><td><strong>2023010042</strong></td>
      <td>Tahun Masuk</td><td>:</td><td>2023 (Angkatan 2023)</td>
    </tr>
    <tr>
      <td>Tempat, Tgl Lahir</td><td>:</td><td>Jakarta, 14 Mei 2005</td>
      <td>Status Kelulusan</td><td>:</td><td>Aktif Kuliah</td>
    </tr>
  </table>

  <table>
    <thead>
      <tr>
        <th width="5%">NO</th>
        <th width="12%">KODE</th>
        <th>MATA KULIAH</th>
        <th width="6%">SKS</th>
        <th width="8%">NILAI</th>
        <th width="8%">BOBOT</th>
        <th width="10%">MUTU</th>
      </tr>
    </thead>
    <tbody>
      <tr style="background:#E2E8F0; font-weight:bold;"><td colspan="7">SEMESTER 1 (GANJIL 2023/2024)</td></tr>
      <tr><td class="text-center">1</td><td class="text-center">TI1101</td><td>Pendidikan Agama</td><td class="text-center">3</td><td class="text-center">A</td><td class="text-center">4.00</td><td class="text-right">12.00</td></tr>
      <tr><td class="text-center">2</td><td class="text-center">TI1102</td><td>Pancasila & Kewarganegaraan</td><td class="text-center">2</td><td class="text-center">A</td><td class="text-center">4.00</td><td class="text-right">8.00</td></tr>
      <tr><td class="text-center">3</td><td class="text-center">TI1103</td><td>Bahasa Indonesia</td><td class="text-center">2</td><td class="text-center">A</td><td class="text-center">4.00</td><td class="text-right">8.00</td></tr>
      <tr><td class="text-center">4</td><td class="text-center">TI1104</td><td>Kalkulus I</td><td class="text-center">3</td><td class="text-center">AB</td><td class="text-center">3.50</td><td class="text-right">10.50</td></tr>
      <tr><td class="text-center">5</td><td class="text-center">TI1105</td><td>Fisika Dasar</td><td class="text-center">3</td><td class="text-center">AB</td><td class="text-center">3.50</td><td class="text-right">10.50</td></tr>
      <tr><td class="text-center">6</td><td class="text-center">TI1106</td><td>Dasar Pemrograman</td><td class="text-center">4</td><td class="text-center">A</td><td class="text-center">4.00</td><td class="text-right">16.00</td></tr>
      <tr><td class="text-center">7</td><td class="text-center">TI1107</td><td>Pengantar Teknologi Informasi</td><td class="text-center">3</td><td class="text-center">A</td><td class="text-center">4.00</td><td class="text-right">12.00</td></tr>

      <tr style="background:#E2E8F0; font-weight:bold;"><td colspan="7">SEMESTER 2 (GENAP 2023/2024)</td></tr>
      <tr><td class="text-center">8</td><td class="text-center">TI1201</td><td>Kalkulus II</td><td class="text-center">3</td><td class="text-center">B</td><td class="text-center">3.00</td><td class="text-right">9.00</td></tr>
      <tr><td class="text-center">9</td><td class="text-center">TI1202</td><td>Matematika Diskrit</td><td class="text-center">3</td><td class="text-center">A</td><td class="text-center">4.00</td><td class="text-right">12.00</td></tr>
      <tr><td class="text-center">10</td><td class="text-center">TI1203</td><td>Algoritma & Struktur Data</td><td class="text-center">4</td><td class="text-center">A</td><td class="text-center">4.00</td><td class="text-right">16.00</td></tr>
      <tr><td class="text-center">11</td><td class="text-center">TI1204</td><td>Sistem Digital</td><td class="text-center">3</td><td class="text-center">A</td><td class="text-center">4.00</td><td class="text-right">12.00</td></tr>
      <tr><td class="text-center">12</td><td class="text-center">TI1205</td><td>Bahasa Inggris</td><td class="text-center">2</td><td class="text-center">A</td><td class="text-center">4.00</td><td class="text-right">8.00</td></tr>
      <tr><td class="text-center">13</td><td class="text-center">TI1206</td><td>Organisasi Komputer</td><td class="text-center">3</td><td class="text-center">AB</td><td class="text-center">3.50</td><td class="text-right">10.50</td></tr>
      <tr><td class="text-center">14</td><td class="text-center">TI1207</td><td>Komunikasi Interpersonal</td><td class="text-center">2</td><td class="text-center">A</td><td class="text-center">4.00</td><td class="text-right">8.00</td></tr>

      <tr style="background:#E2E8F0; font-weight:bold;"><td colspan="7">SEMESTER 3 (GANJIL 2024/2025)</td></tr>
      <tr><td class="text-center">15</td><td class="text-center">TI2301</td><td>Basis Data</td><td class="text-center">3</td><td class="text-center">A</td><td class="text-center">4.00</td><td class="text-right">12.00</td></tr>
      <tr><td class="text-center">16</td><td class="text-center">TI2302</td><td>Jaringan Komputer</td><td class="text-center">3</td><td class="text-center">A</td><td class="text-center">4.00</td><td class="text-right">12.00</td></tr>
      <tr><td class="text-center">17</td><td class="text-center">TI2303</td><td>Statistika & Probabilitas</td><td class="text-center">3</td><td class="text-center">AB</td><td class="text-center">3.50</td><td class="text-right">10.50</td></tr>
      <tr><td class="text-center">18</td><td class="text-center">TI2304</td><td>Sistem Operasi</td><td class="text-center">3</td><td class="text-center">A</td><td class="text-center">4.00</td><td class="text-right">12.00</td></tr>
      <tr><td class="text-center">19</td><td class="text-center">TI2305</td><td>Pemrograman Web</td><td class="text-center">3</td><td class="text-center">A</td><td class="text-center">4.00</td><td class="text-right">12.00</td></tr>
      <tr><td class="text-center">20</td><td class="text-center">TI2306</td><td>Interaksi Manusia Komputer</td><td class="text-center">3</td><td class="text-center">A</td><td class="text-center">4.00</td><td class="text-right">12.00</td></tr>
      <tr><td class="text-center">21</td><td class="text-center">TI2307</td><td>Bahasa Inggris Akademik</td><td class="text-center">3</td><td class="text-center">A</td><td class="text-center">4.00</td><td class="text-right">12.00</td></tr>

      <tr style="background:#E2E8F0; font-weight:bold;"><td colspan="7">SEMESTER 4 (GENAP 2024/2025)</td></tr>
      <tr><td class="text-center">22</td><td class="text-center">TI2401</td><td>Analisis & Perancangan Sistem</td><td class="text-center">3</td><td class="text-center">A</td><td class="text-center">4.00</td><td class="text-right">12.00</td></tr>
      <tr><td class="text-center">23</td><td class="text-center">TI2402</td><td>Pemrograman Berorientasi Objek</td><td class="text-center">3</td><td class="text-center">A</td><td class="text-center">4.00</td><td class="text-right">12.00</td></tr>
      <tr><td class="text-center">24</td><td class="text-center">TI2403</td><td>Struktur Data Lanjut</td><td class="text-center">3</td><td class="text-center">A</td><td class="text-center">4.00</td><td class="text-right">12.00</td></tr>
      <tr><td class="text-center">25</td><td class="text-center">TI2404</td><td>Matematika Diskrit Lanjut</td><td class="text-center">3</td><td class="text-center">A</td><td class="text-center">4.00</td><td class="text-right">12.00</td></tr>
      <tr><td class="text-center">26</td><td class="text-center">TI2405</td><td>Arsitektur Komputer Lanjut</td><td class="text-center">3</td><td class="text-center">A</td><td class="text-center">4.00</td><td class="text-right">12.00</td></tr>
      <tr><td class="text-center">27</td><td class="text-center">TI2406</td><td>Metode Penelitian</td><td class="text-center">3</td><td class="text-center">A</td><td class="text-center">4.00</td><td class="text-right">12.00</td></tr>
      <tr><td class="text-center">28</td><td class="text-center">TI2407</td><td>Kewirausahaan</td><td class="text-center">3</td><td class="text-center">B</td><td class="text-center">3.00</td><td class="text-right">9.00</td></tr>
    </tbody>
    <tfoot>
      <tr style="background:#F8FAFC; font-weight:bold;">
        <td colspan="3" class="text-right">TOTAL KUMULATIF:</td>
        <td class="text-center">84 SKS</td>
        <td colspan="2"></td>
        <td class="text-right">317.40</td>
      </tr>
    </tfoot>
  </table>

  <div class="summary-box">
    Indeks Prestasi Kumulatif (IPK): 3.78 &nbsp;|&nbsp; Total SKS Lulus: 84 SKS &nbsp;|&nbsp; Predikat: Dengan Pujian (Cum Laude)
  </div>

  <br><br>
  <table style="border: none !important;">
    <tr>
      <td width="50%" class="text-center" style="border: none !important;">
        Mengetahui,<br>Wakil Rektor Bidang Akademik<br><br><br><br>
        <strong><u>Prof. Dr. Ir. Hendra Gunawan, M.T.</u></strong><br>NIP 197805142003121002
      </td>
      <td width="50%" class="text-center" style="border: none !important;">
        Bandung, 18 Juli 2025<br>Dosen Pembimbing Akademik,<br><br><br><br>
        <strong><u>Dr. Maya Lestari</u></strong><br>NIDN 0408098201
      </td>
    </tr>
  </table>
`;

// Save .DOC files
fs.writeFileSync(path.join(outputDir, 'KHS_2023010042_Alya_Rahma_Putri.doc'), createWordDoc('KHS - Alya Rahma Putri', khsDocBody), 'utf8');
fs.writeFileSync(path.join(outputDir, 'KRS_2023010042_Alya_Rahma_Putri.doc'), createWordDoc('KRS - Alya Rahma Putri', krsDocBody), 'utf8');
fs.writeFileSync(path.join(outputDir, 'Transkrip_2023010042_Alya_Rahma_Putri.doc'), createWordDoc('Transkrip - Alya Rahma Putri', transkripDocBody), 'utf8');

console.log('✅ Word (.doc) files generated successfully in output/');

// -------------------------------------------------------------
// 2. GENERATE PDF (.pdf) VIA EDGE / CHROME HEADLESS
// -------------------------------------------------------------
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browserExe = fs.existsSync(edgePath) ? edgePath : (fs.existsSync(chromePath) ? chromePath : null);

if (browserExe) {
  const filesToPdf = [
    { html: 'KHS_2023010042_Alya_Rahma_Putri.html', pdf: 'KHS_2023010042_Alya_Rahma_Putri.pdf' },
    { html: 'KRS_2023010042_Alya_Rahma_Putri.html', pdf: 'KRS_2023010042_Alya_Rahma_Putri.pdf' },
    { html: 'Transkrip_2023010042_Alya_Rahma_Putri.html', pdf: 'Transkrip_2023010042_Alya_Rahma_Putri.pdf' }
  ];

  filesToPdf.forEach(item => {
    const htmlFile = path.join(outputDir, item.html);
    const pdfFile = path.join(outputDir, item.pdf);
    try {
      execSync(`"${browserExe}" --headless --no-sandbox --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfFile}" "${htmlFile}"`, { stdio: 'ignore' });
      if (fs.existsSync(pdfFile)) {
        console.log(`✅ PDF generated: ${item.pdf} (${fs.statSync(pdfFile).size} bytes)`);
      }
    } catch (e) {
      console.warn(`⚠️ PDF generation note for ${item.pdf}:`, e.message);
    }
  });
}

// Sync to frontend/output
const frontendOutputDir = path.join(__dirname, '../frontend/output');
if (!fs.existsSync(frontendOutputDir)) {
  fs.mkdirSync(frontendOutputDir, { recursive: true });
}
fs.cpSync(outputDir, frontendOutputDir, { recursive: true });

console.log('==================================================================');
console.log('🎉 ALL FORMATS (PDF, DOC, HTML) ARE READY IN output/ & frontend/output/');
console.log('==================================================================');
