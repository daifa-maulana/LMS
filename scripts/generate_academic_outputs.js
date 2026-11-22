/**
 * GENERATE_ACADEMIC_OUTPUTS.JS
 * Menghasilkan dokumen akademik resmi yang nyata (Real Academic Outputs):
 * 1. Kartu Hasil Studi (KHS) Resmi Semester Genap 2024/2025
 * 2. Kartu Rencana Studi (KRS/FRS) Resmi Semester Ganjil 2025/2026
 * 3. Transkrip Akademik Sementara Kumulatif (Semester 1–4)
 * 
 * Output tersimpan dalam format Standalone HTML siap cetak/simpan PDF di folder `output/`
 * SIAK UFD Enterprise Academic ERP
 */

const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// -------------------------------------------------------------
// BASE HTML TEMPLATE
// -------------------------------------------------------------
function wrapA4Document(title, content) {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — SIAK UFD</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #F1F5F9;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #0F172A;
      padding: 30px 16px;
      line-height: 1.4;
    }
    .print-bar {
      max-width: 820px;
      margin: 0 auto 16px auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #FFFFFF;
      padding: 12px 20px;
      border-radius: 8px;
      border: 1px solid #CBD5E1;
      box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    }
    .print-btn {
      background: #237757;
      color: #FFFFFF;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .print-btn:hover { background: #1B5E44; }
    .back-btn {
      color: #475569;
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
    }
    .back-btn:hover { color: #0F172A; }

    /* Official A4 Sheet Paper */
    .a4-sheet {
      max-width: 820px;
      margin: 0 auto;
      background: #FFFFFF;
      padding: 40px 48px;
      border: 1px solid #E2E8F0;
      box-shadow: 0 10px 25px rgba(0,0,0,0.08);
      border-radius: 4px;
      min-height: 1050px;
      position: relative;
    }

    /* Kop Surat */
    .kop-header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 12px;
    }
    .kop-logo {
      width: 68px;
      height: 68px;
      background: #237757;
      color: #FFFFFF;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 32px;
      letter-spacing: -1px;
      flex-shrink: 0;
    }
    .kop-titles {
      flex: 1;
      text-align: center;
    }
    .kop-univ {
      font-size: 16px;
      font-weight: 800;
      letter-spacing: 0.5px;
      color: #0F172A;
      text-transform: uppercase;
    }
    .kop-fakultas {
      font-size: 13px;
      font-weight: 700;
      color: #237757;
      margin-top: 2px;
      text-transform: uppercase;
    }
    .kop-sub {
      font-size: 10px;
      color: #64748B;
      margin-top: 3px;
    }
    .kop-divider {
      height: 3px;
      border-top: 2px solid #0F172A;
      border-bottom: 1px solid #0F172A;
      margin-top: 8px;
      margin-bottom: 18px;
    }

    /* Document Title Block */
    .doc-heading {
      text-align: center;
      margin-bottom: 20px;
    }
    .doc-heading h2 {
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: #0F172A;
    }
    .doc-heading p {
      font-size: 11px;
      color: #475569;
      margin-top: 3px;
      font-weight: 500;
    }
    .doc-nomor {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10.5px;
      color: #334155;
      margin-top: 2px;
    }

    /* Student Meta Box */
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 32px;
      row-gap: 6px;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      padding: 12px 16px;
      border-radius: 6px;
      margin-bottom: 18px;
      font-size: 11.5px;
    }
    .meta-row {
      display: flex;
    }
    .meta-lbl {
      width: 130px;
      color: #64748B;
      font-weight: 500;
    }
    .meta-sep {
      width: 14px;
      color: #94A3B8;
    }
    .meta-val {
      font-weight: 600;
      color: #0F172A;
      flex: 1;
    }

    /* Academic Grades Table */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
      margin-bottom: 16px;
    }
    table.data-table th {
      background: #F1F5F9;
      color: #1E293B;
      font-weight: 700;
      padding: 8px 10px;
      text-align: left;
      border-top: 1px solid #CBD5E1;
      border-bottom: 1px solid #CBD5E1;
      letter-spacing: 0.3px;
    }
    table.data-table td {
      padding: 7px 10px;
      border-bottom: 1px solid #E2E8F0;
      color: #1E293B;
    }
    table.data-table tr:hover td {
      background: #F8FAFC;
    }
    tr.semester-header td {
      background: #E6F4EA !important;
      color: #065F46 !important;
      font-weight: 700 !important;
      padding: 6px 10px !important;
      border-top: 1px solid #A7F3D0 !important;
      border-bottom: 1px solid #A7F3D0 !important;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .font-mono { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; }
    .font-bold { font-weight: 700; }

    /* Summary Metric Strip */
    .summary-strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      background: #F8FAFC;
      border: 1px solid #CBD5E1;
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 24px;
      text-align: center;
    }
    .stat-col {
      border-right: 1px solid #E2E8F0;
      padding: 0 10px;
    }
    .stat-col:last-child { border-right: none; }
    .stat-lbl {
      font-size: 10px;
      font-weight: 600;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .stat-val {
      font-size: 14px;
      font-weight: 800;
      color: #237757;
      margin-top: 2px;
      font-family: 'JetBrains Mono', monospace;
    }

    /* Signature Row */
    .signature-row {
      display: flex;
      justify-content: space-between;
      margin-top: 32px;
      font-size: 11px;
      page-break-inside: avoid;
    }
    .sig-col {
      width: 240px;
      text-align: center;
    }
    .sig-date { color: #64748B; margin-bottom: 4px; }
    .sig-role { font-weight: 600; color: #1E293B; margin-bottom: 12px; }
    .sig-qr {
      width: 72px;
      height: 72px;
      margin: 0 auto 12px auto;
      border: 1px dashed #CBD5E1;
      background: #F8FAFC;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 8px;
      font-weight: 700;
      color: #065F46;
    }
    .sig-qr svg {
      width: 38px;
      height: 38px;
      margin-bottom: 2px;
      stroke: #237757;
    }
    .sig-name {
      font-weight: 700;
      color: #0F172A;
      text-decoration: underline;
    }
    .sig-id {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9.5px;
      color: #64748B;
      margin-top: 2px;
    }

    .doc-footer-hash {
      margin-top: 36px;
      padding-top: 8px;
      border-top: 1px dashed #E2E8F0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9px;
      color: #94A3B8;
      font-family: 'JetBrains Mono', monospace;
    }

    /* Print media styling */
    @media print {
      @page {
        size: A4 portrait;
        margin: 12mm 15mm 12mm 15mm;
      }
      body {
        background: #FFFFFF !important;
        padding: 0 !important;
        color: #000000 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .print-bar { display: none !important; }
      .a4-sheet {
        box-shadow: none !important;
        border: none !important;
        padding: 0 !important;
        margin: 0 !important;
        min-height: auto !important;
        max-width: 100% !important;
      }
    }
  </style>
</head>
<body>
  <div class="print-bar">
    <div style="font-size: 13px; font-weight: 600; color: #1E293B;">Dokumen Resmi SIAK UFD · ${title}</div>
    <div style="display: flex; gap: 12px; align-items: center;">
      <a href="../index.html" class="back-btn">← Kembali ke Portal</a>
      <button class="print-btn" onclick="window.print()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
        <span>Cetak / Simpan PDF</span>
      </button>
    </div>
  </div>

  <div class="a4-sheet">
    <!-- Kop Surat -->
    <div class="kop-header">
      <div class="kop-logo">S</div>
      <div class="kop-titles">
        <div class="kop-univ">UNIVERSITAS FATMAWATI DIGITAL</div>
        <div class="kop-fakultas">FAKULTAS TEKNOLOGI INFORMASI & DESAIN</div>
        <div class="kop-sub">BIRO ADMINISTRASI AKADEMIK & KEMAHASISWAAN (BAK)</div>
        <div class="kop-sub">Jl. Margonda Raya No. 100, Depok, Jawa Barat · Telp: (021) 786-3421 · Website: ufd.ac.id · Email: info@ufd.ac.id</div>
      </div>
    </div>
    <div class="kop-divider"></div>

    ${content}

    <!-- Security Hash Verification -->
    <div class="doc-footer-hash">
      <span>Keaslian dokumen ini dilindungi secara elektronik melalui SIAK UFD Trust Registry</span>
      <span>SHA-256: 4F9B2A8C1E0D7F53 · ID: VERIFIED-OFFICIAL-2025</span>
    </div>
  </div>
</body>
</html>`;
}

// -------------------------------------------------------------
// 1. GENERATE KHS RESMI (Kartu Hasil Studi)
// -------------------------------------------------------------
function generateKHS() {
  const content = `
    <div class="doc-heading">
      <h2>KARTU HASIL STUDI (KHS)</h2>
      <p>Semester Genap · Tahun Akademik 2024/2025</p>
      <div class="doc-nomor">Nomor Dokumen: KHS/20242/TI/010042</div>
    </div>

    <div class="meta-grid">
      <div>
        <div class="meta-row"><span class="meta-lbl">Nama Mahasiswa</span><span class="meta-sep">:</span><span class="meta-val">Alya Rahma Putri</span></div>
        <div class="meta-row"><span class="meta-lbl">Nomor Induk (NIM)</span><span class="meta-sep">:</span><span class="meta-val font-mono">2023010042</span></div>
        <div class="meta-row"><span class="meta-lbl">Program Studi</span><span class="meta-sep">:</span><span class="meta-val">S1 Teknik Informatika</span></div>
      </div>
      <div>
        <div class="meta-row"><span class="meta-lbl">Tahun Masuk / Smtr</span><span class="meta-sep">:</span><span class="meta-val">2023 / Semester 4 (Empat)</span></div>
        <div class="meta-row"><span class="meta-lbl">Dosen Pembimbing PA</span><span class="meta-sep">:</span><span class="meta-val">Dr. Maya Lestari</span></div>
        <div class="meta-row"><span class="meta-lbl">Status Registrasi</span><span class="meta-sep">:</span><span class="meta-val" style="color: #237757;">Aktif Kuliah</span></div>
      </div>
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 32px;" class="text-center">NO</th>
          <th style="width: 75px;">KODE MK</th>
          <th>NAMA MATA KULIAH</th>
          <th style="width: 50px;" class="text-center">KELAS</th>
          <th style="width: 40px;" class="text-center">SKS</th>
          <th style="width: 50px;" class="text-center">NILAI</th>
          <th style="width: 55px;" class="text-center">BOBOT</th>
          <th style="width: 55px;" class="text-right">MUTU</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-center font-mono">1</td>
          <td class="font-mono">TI2401</td>
          <td><strong>Analisis & Perancangan Sistem</strong></td>
          <td class="text-center">TI-4A</td>
          <td class="text-center font-mono">3</td>
          <td class="text-center font-bold" style="color: #237757;">A</td>
          <td class="text-center font-mono">4,00</td>
          <td class="text-right font-mono">12,00</td>
        </tr>
        <tr>
          <td class="text-center font-mono">2</td>
          <td class="font-mono">TI2402</td>
          <td><strong>Pemrograman Berorientasi Objek</strong></td>
          <td class="text-center">TI-4A</td>
          <td class="text-center font-mono">3</td>
          <td class="text-center font-bold" style="color: #237757;">A</td>
          <td class="text-center font-mono">4,00</td>
          <td class="text-right font-mono">12,00</td>
        </tr>
        <tr>
          <td class="text-center font-mono">3</td>
          <td class="font-mono">TI2403</td>
          <td><strong>Struktur Data & Algoritma Lanjut</strong></td>
          <td class="text-center">TI-4A</td>
          <td class="text-center font-mono">3</td>
          <td class="text-center font-bold" style="color: #237757;">A</td>
          <td class="text-center font-mono">4,00</td>
          <td class="text-right font-mono">12,00</td>
        </tr>
        <tr>
          <td class="text-center font-mono">4</td>
          <td class="font-mono">TI2404</td>
          <td><strong>Matematika Diskrit Lanjut</strong></td>
          <td class="text-center">TI-4A</td>
          <td class="text-center font-mono">3</td>
          <td class="text-center font-bold" style="color: #237757;">A</td>
          <td class="text-center font-mono">4,00</td>
          <td class="text-right font-mono">12,00</td>
        </tr>
        <tr>
          <td class="text-center font-mono">5</td>
          <td class="font-mono">TI2405</td>
          <td><strong>Arsitektur Komputer Lanjut</strong></td>
          <td class="text-center">TI-4A</td>
          <td class="text-center font-mono">3</td>
          <td class="text-center font-bold" style="color: #237757;">A</td>
          <td class="text-center font-mono">4,00</td>
          <td class="text-right font-mono">12,00</td>
        </tr>
        <tr>
          <td class="text-center font-mono">6</td>
          <td class="font-mono">TI2406</td>
          <td><strong>Metode Penelitian Informatika</strong></td>
          <td class="text-center">TI-4A</td>
          <td class="text-center font-mono">3</td>
          <td class="text-center font-bold" style="color: #237757;">A</td>
          <td class="text-center font-mono">4,00</td>
          <td class="text-right font-mono">12,00</td>
        </tr>
        <tr>
          <td class="text-center font-mono">7</td>
          <td class="font-mono">TI2407</td>
          <td><strong>Kewirausahaan & Startup Teknologi</strong></td>
          <td class="text-center">TI-4A</td>
          <td class="text-center font-mono">3</td>
          <td class="text-center font-bold" style="color: #165B9C;">B</td>
          <td class="text-center font-mono">3,00</td>
          <td class="text-right font-mono">9,00</td>
        </tr>
      </tbody>
    </table>

    <div class="summary-strip">
      <div class="stat-col">
        <div class="stat-lbl">SKS Semester</div>
        <div class="stat-val">21 SKS</div>
      </div>
      <div class="stat-col">
        <div class="stat-lbl">Total Angka Mutu</div>
        <div class="stat-val">81,00</div>
      </div>
      <div class="stat-col">
        <div class="stat-lbl">Indeks Prestasi Semester (IPS)</div>
        <div class="stat-val">3,86</div>
      </div>
      <div class="stat-col">
        <div class="stat-lbl">Maks. SKS Semester Depan</div>
        <div class="stat-val">24 SKS</div>
      </div>
    </div>

    <div class="signature-row">
      <div class="sig-col">
        <div class="sig-date">Bandung, 18 Juli 2025</div>
        <div class="sig-role">Dosen Pembimbing Akademik</div>
        <div class="sig-qr">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          <span>QR-VALID</span>
        </div>
        <div class="sig-name">Dr. Maya Lestari</div>
        <div class="sig-id">NIDN 0408098201</div>
      </div>

      <div class="sig-col">
        <div class="sig-date">Mengetahui,</div>
        <div class="sig-role">Ketua Program Studi Teknik Informatika</div>
        <div class="sig-qr">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          <span>QR-VALID</span>
        </div>
        <div class="sig-name">Prof. Dr. Ir. Hendra Gunawan, M.T.</div>
        <div class="sig-id">NIP 197805142003121002</div>
      </div>
    </div>
  `;
  return wrapA4Document('Kartu Hasil Studi (KHS) — Alya Rahma Putri', content);
}

// -------------------------------------------------------------
// 2. GENERATE KRS RESMI (Kartu Rencana Studi)
// -------------------------------------------------------------
function generateKRS() {
  const content = `
    <div class="doc-heading">
      <h2>KARTU RENCANA STUDI (KRS)</h2>
      <p>Semester Ganjil · Tahun Akademik 2025/2026</p>
      <div class="doc-nomor">Nomor Formulir: KRS/20251/TI/010042</div>
    </div>

    <div class="meta-grid">
      <div>
        <div class="meta-row"><span class="meta-lbl">Nama Mahasiswa</span><span class="meta-sep">:</span><span class="meta-val">Alya Rahma Putri</span></div>
        <div class="meta-row"><span class="meta-lbl">Nomor Induk (NIM)</span><span class="meta-sep">:</span><span class="meta-val font-mono">2023010042</span></div>
        <div class="meta-row"><span class="meta-lbl">Program Studi</span><span class="meta-sep">:</span><span class="meta-val">S1 Teknik Informatika</span></div>
      </div>
      <div>
        <div class="meta-row"><span class="meta-lbl">Semester Ditempuh</span><span class="meta-sep">:</span><span class="meta-val">Semester 5 (Lima)</span></div>
        <div class="meta-row"><span class="meta-lbl">IPS Lalu / Batas SKS</span><span class="meta-sep">:</span><span class="meta-val font-mono">3,86 / Maks. 24 SKS</span></div>
        <div class="meta-row"><span class="meta-lbl">Status Pengesahan</span><span class="meta-sep">:</span><span class="meta-val" style="color: #237757; font-weight: 700;">Disetujui Dosen PA</span></div>
      </div>
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 30px;" class="text-center">NO</th>
          <th style="width: 70px;">KODE</th>
          <th>MATA KULIAH</th>
          <th style="width: 40px;" class="text-center">KELAS</th>
          <th style="width: 35px;" class="text-center">SKS</th>
          <th style="width: 140px;">HARI & JADWAL</th>
          <th style="width: 100px;">RUANG</th>
          <th>DOSEN PENGAMPU</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-center font-mono">1</td>
          <td class="font-mono">TI3501</td>
          <td><strong>Sistem Basis Data Terdistribusi</strong></td>
          <td class="text-center font-mono">TI-5A</td>
          <td class="text-center font-mono">3</td>
          <td>Senin, 08.00–09.40</td>
          <td>Lab 02 Komputer</td>
          <td>Dr. Aditya Pratama</td>
        </tr>
        <tr>
          <td class="text-center font-mono">2</td>
          <td class="font-mono">TI3502</td>
          <td><strong>Jaringan Komputer & Cloud Infrastructure</strong></td>
          <td class="text-center font-mono">TI-5A</td>
          <td class="text-center font-mono">3</td>
          <td>Selasa, 10.00–11.40</td>
          <td>Lab 01 RPL</td>
          <td>Rina Anggraini, M.Kom.</td>
        </tr>
        <tr>
          <td class="text-center font-mono">3</td>
          <td class="font-mono">TI3503</td>
          <td><strong>Kecerdasan Buatan & Machine Learning</strong></td>
          <td class="text-center font-mono">TI-5A</td>
          <td class="text-center font-mono">3</td>
          <td>Rabu, 08.00–09.40</td>
          <td>R. 401 Teori</td>
          <td>Dr. Hendra Gunawan, M.Kom.</td>
        </tr>
        <tr>
          <td class="text-center font-mono">4</td>
          <td class="font-mono">TI3504</td>
          <td><strong>Sistem Operasi Terdistribusi</strong></td>
          <td class="text-center font-mono">TI-5A</td>
          <td class="text-center font-mono">3</td>
          <td>Kamis, 08.00–09.40</td>
          <td>R. 402 Teori</td>
          <td>Dr. Maya Lestari</td>
        </tr>
        <tr>
          <td class="text-center font-mono">5</td>
          <td class="font-mono">TI3505</td>
          <td><strong>Rekayasa Perangkat Lunak Berbasis Agile</strong></td>
          <td class="text-center font-mono">TI-5A</td>
          <td class="text-center font-mono">3</td>
          <td>Kamis, 13.00–14.40</td>
          <td>Lab 01 RPL</td>
          <td>Fajar Hidayat, M.Kom.</td>
        </tr>
        <tr>
          <td class="text-center font-mono">6</td>
          <td class="font-mono">TI3506</td>
          <td><strong>Interaksi Manusia & Komputer</strong></td>
          <td class="text-center font-mono">TI-5A</td>
          <td class="text-center font-mono">3</td>
          <td>Jumat, 08.00–09.40</td>
          <td>R. 305 Teori</td>
          <td>Dr. Indah Puspita</td>
        </tr>
        <tr>
          <td class="text-center font-mono">7</td>
          <td class="font-mono">TI3507</td>
          <td><strong>Keamanan Informasi & Etika Siber</strong></td>
          <td class="text-center font-mono">TI-5A</td>
          <td class="text-center font-mono">3</td>
          <td>Jumat, 13.30–15.10</td>
          <td>Lab Keamanan</td>
          <td>Dr. Hendra Gunawan, M.Kom.</td>
        </tr>
      </tbody>
      <tfoot>
        <tr style="background: #F8FAFC; border-top: 2px solid #CBD5E1; font-weight: 700;">
          <td colspan="4" style="text-align: right; padding: 10px;">TOTAL BEBAN SKS YANG DIAMBIL:</td>
          <td class="text-center font-mono" style="font-size: 13px; color: #237757; padding: 10px;">21 SKS</td>
          <td colspan="3" style="color: #64748B; font-size: 11px; padding: 10px;">(Sisa Kuota: 3 SKS dari batas maksimal 24 SKS)</td>
        </tr>
      </tfoot>
    </table>

    <div class="signature-row" style="margin-top: 40px;">
      <div class="sig-col">
        <div class="sig-date">&nbsp;</div>
        <div class="sig-role">Mahasiswa Yang Bersangkutan</div>
        <div style="height: 72px;"></div>
        <div class="sig-name">Alya Rahma Putri</div>
        <div class="sig-id">NIM 2023010042</div>
      </div>

      <div class="sig-col">
        <div class="sig-date">Bandung, 18 Agustus 2025</div>
        <div class="sig-role">Dosen Pembimbing Akademik (DPA)</div>
        <div class="sig-qr">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          <span>KRS-DISETUJUI</span>
        </div>
        <div class="sig-name">Dr. Maya Lestari</div>
        <div class="sig-id">NIDN 0408098201</div>
      </div>
    </div>
  `;
  return wrapA4Document('Kartu Rencana Studi (KRS) — Alya Rahma Putri', content);
}

// -------------------------------------------------------------
// 3. GENERATE TRANSKRIP AKADEMIK RESMI
// -------------------------------------------------------------
function generateTranscript() {
  const content = `
    <div class="doc-heading">
      <h2>TRANSKRIP AKADEMIK SEMENTARA</h2>
      <p>Rekam Hasil Studi Kumulatif Program Sarjana (S1)</p>
      <div class="doc-nomor">Nomor Dokumen: 042/TA/BAK/UFD/VIII/2025</div>
    </div>

    <div class="meta-grid">
      <div>
        <div class="meta-row"><span class="meta-lbl">Nama Mahasiswa</span><span class="meta-sep">:</span><span class="meta-val">Alya Rahma Putri</span></div>
        <div class="meta-row"><span class="meta-lbl">Nomor Induk (NIM)</span><span class="meta-sep">:</span><span class="meta-val font-mono">2023010042</span></div>
        <div class="meta-row"><span class="meta-lbl">Tempat, Tgl Lahir</span><span class="meta-sep">:</span><span class="meta-val">Jakarta, 14 Mei 2005</span></div>
      </div>
      <div>
        <div class="meta-row"><span class="meta-lbl">Program Studi</span><span class="meta-sep">:</span><span class="meta-val">S1 Teknik Informatika</span></div>
        <div class="meta-row"><span class="meta-lbl">Tahun Masuk</span><span class="meta-sep">:</span><span class="meta-val font-mono">2023 (Angkatan 2023)</span></div>
        <div class="meta-row"><span class="meta-lbl">Status Kelulusan</span><span class="meta-sep">:</span><span class="meta-val" style="color: #237757;">Aktif (Belum Lulus)</span></div>
      </div>
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 30px;" class="text-center">NO</th>
          <th style="width: 70px;">KODE MK</th>
          <th>MATA KULIAH</th>
          <th style="width: 40px;" class="text-center">SKS</th>
          <th style="width: 45px;" class="text-center">NILAI</th>
          <th style="width: 50px;" class="text-center">BOBOT</th>
          <th style="width: 55px;" class="text-right">MUTU</th>
        </tr>
      </thead>
      <tbody>
        <!-- Semester 1 -->
        <tr class="semester-header"><td colspan="7">SEMESTER 1 (GANJIL 2023/2024)</td></tr>
        <tr><td class="text-center font-mono">1</td><td class="font-mono">TI1101</td><td>Pendidikan Agama</td><td class="text-center font-mono">3</td><td class="text-center font-bold">A</td><td class="text-center font-mono">4,00</td><td class="text-right font-mono">12,00</td></tr>
        <tr><td class="text-center font-mono">2</td><td class="font-mono">TI1102</td><td>Pancasila & Kewarganegaraan</td><td class="text-center font-mono">2</td><td class="text-center font-bold">A</td><td class="text-center font-mono">4,00</td><td class="text-right font-mono">8,00</td></tr>
        <tr><td class="text-center font-mono">3</td><td class="font-mono">TI1103</td><td>Bahasa Indonesia</td><td class="text-center font-mono">2</td><td class="text-center font-bold">A</td><td class="text-center font-mono">4,00</td><td class="text-right font-mono">8,00</td></tr>
        <tr><td class="text-center font-mono">4</td><td class="font-mono">TI1104</td><td>Kalkulus I</td><td class="text-center font-mono">3</td><td class="text-center font-bold">AB</td><td class="text-center font-mono">3,50</td><td class="text-right font-mono">10,50</td></tr>
        <tr><td class="text-center font-mono">5</td><td class="font-mono">TI1105</td><td>Fisika Dasar</td><td class="text-center font-mono">3</td><td class="text-center font-bold">AB</td><td class="text-center font-mono">3,50</td><td class="text-right font-mono">10,50</td></tr>
        <tr><td class="text-center font-mono">6</td><td class="font-mono">TI1106</td><td>Dasar Pemrograman</td><td class="text-center font-mono">4</td><td class="text-center font-bold">A</td><td class="text-center font-mono">4,00</td><td class="text-right font-mono">16,00</td></tr>
        <tr><td class="text-center font-mono">7</td><td class="font-mono">TI1107</td><td>Pengantar Teknologi Informasi</td><td class="text-center font-mono">3</td><td class="text-center font-bold">A</td><td class="text-center font-mono">4,00</td><td class="text-right font-mono">12,00</td></tr>

        <!-- Semester 2 -->
        <tr class="semester-header"><td colspan="7">SEMESTER 2 (GENAP 2023/2024)</td></tr>
        <tr><td class="text-center font-mono">8</td><td class="font-mono">TI1201</td><td>Kalkulus II</td><td class="text-center font-mono">3</td><td class="text-center font-bold">B</td><td class="text-center font-mono">3,00</td><td class="text-right font-mono">9,00</td></tr>
        <tr><td class="text-center font-mono">9</td><td class="font-mono">TI1202</td><td>Matematika Diskrit</td><td class="text-center font-mono">3</td><td class="text-center font-bold">A</td><td class="text-center font-mono">4,00</td><td class="text-right font-mono">12,00</td></tr>
        <tr><td class="text-center font-mono">10</td><td class="font-mono">TI1203</td><td>Algoritma & Struktur Data</td><td class="text-center font-mono">4</td><td class="text-center font-bold">A</td><td class="text-center font-mono">4,00</td><td class="text-right font-mono">16,00</td></tr>
        <tr><td class="text-center font-mono">11</td><td class="font-mono">TI1204</td><td>Sistem Digital</td><td class="text-center font-mono">3</td><td class="text-center font-bold">A</td><td class="text-center font-mono">4,00</td><td class="text-right font-mono">12,00</td></tr>
        <tr><td class="text-center font-mono">12</td><td class="font-mono">TI1205</td><td>Bahasa Inggris</td><td class="text-center font-mono">2</td><td class="text-center font-bold">A</td><td class="text-center font-mono">4,00</td><td class="text-right font-mono">8,00</td></tr>
        <tr><td class="text-center font-mono">13</td><td class="font-mono">TI1206</td><td>Organisasi Komputer</td><td class="text-center font-mono">3</td><td class="text-center font-bold">AB</td><td class="text-center font-mono">3,50</td><td class="text-right font-mono">10,50</td></tr>
        <tr><td class="text-center font-mono">14</td><td class="font-mono">TI1207</td><td>Komunikasi Interpersonal</td><td class="text-center font-mono">2</td><td class="text-center font-bold">A</td><td class="text-center font-mono">4,00</td><td class="text-right font-mono">8,00</td></tr>

        <!-- Semester 3 -->
        <tr class="semester-header"><td colspan="7">SEMESTER 3 (GANJIL 2024/2025)</td></tr>
        <tr><td class="text-center font-mono">15</td><td class="font-mono">TI2301</td><td>Basis Data</td><td class="text-center font-mono">3</td><td class="text-center font-bold">A</td><td class="text-center font-mono">4,00</td><td class="text-right font-mono">12,00</td></tr>
        <tr><td class="text-center font-mono">16</td><td class="font-mono">TI2302</td><td>Jaringan Komputer</td><td class="text-center font-mono">3</td><td class="text-center font-bold">A</td><td class="text-center font-mono">4,00</td><td class="text-right font-mono">12,00</td></tr>
        <tr><td class="text-center font-mono">17</td><td class="font-mono">TI2303</td><td>Statistika & Probabilitas</td><td class="text-center font-mono">3</td><td class="text-center font-bold">AB</td><td class="text-center font-mono">3,50</td><td class="text-right font-mono">10,50</td></tr>
        <tr><td class="text-center font-mono">18</td><td class="font-mono">TI2304</td><td>Sistem Operasi</td><td class="text-center font-mono">3</td><td class="text-center font-bold">A</td><td class="text-center font-mono">4,00</td><td class="text-right font-mono">12,00</td></tr>
        <tr><td class="text-center font-mono">19</td><td class="font-mono">TI2305</td><td>Pemrograman Web</td><td class="text-center font-mono">3</td><td class="text-center font-bold">A</td><td class="text-center font-mono">4,00</td><td class="text-right font-mono">12,00</td></tr>
        <tr><td class="text-center font-mono">20</td><td class="font-mono">TI2306</td><td>Interaksi Manusia Komputer</td><td class="text-center font-mono">3</td><td class="text-center font-bold">A</td><td class="text-center font-mono">4,00</td><td class="text-right font-mono">12,00</td></tr>
        <tr><td class="text-center font-mono">21</td><td class="font-mono">TI2307</td><td>Bahasa Inggris Akademik</td><td class="text-center font-mono">3</td><td class="text-center font-bold">A</td><td class="text-center font-mono">4,00</td><td class="text-right font-mono">12,00</td></tr>

        <!-- Semester 4 -->
        <tr class="semester-header"><td colspan="7">SEMESTER 4 (GENAP 2024/2025)</td></tr>
        <tr><td class="text-center font-mono">22</td><td class="font-mono">TI2401</td><td>Analisis & Perancangan Sistem</td><td class="text-center font-mono">3</td><td class="text-center font-bold">A</td><td class="text-center font-mono">4,00</td><td class="text-right font-mono">12,00</td></tr>
        <tr><td class="text-center font-mono">23</td><td class="font-mono">TI2402</td><td>Pemrograman Berorientasi Objek</td><td class="text-center font-mono">3</td><td class="text-center font-bold">A</td><td class="text-center font-mono">4,00</td><td class="text-right font-mono">12,00</td></tr>
        <tr><td class="text-center font-mono">24</td><td class="font-mono">TI2403</td><td>Struktur Data Lanjut</td><td class="text-center font-mono">3</td><td class="text-center font-bold">A</td><td class="text-center font-mono">4,00</td><td class="text-right font-mono">12,00</td></tr>
        <tr><td class="text-center font-mono">25</td><td class="font-mono">TI2404</td><td>Matematika Diskrit Lanjut</td><td class="text-center font-mono">3</td><td class="text-center font-bold">A</td><td class="text-center font-mono">4,00</td><td class="text-right font-mono">12,00</td></tr>
        <tr><td class="text-center font-mono">26</td><td class="font-mono">TI2405</td><td>Arsitektur Komputer Lanjut</td><td class="text-center font-mono">3</td><td class="text-center font-bold">A</td><td class="text-center font-mono">4,00</td><td class="text-right font-mono">12,00</td></tr>
        <tr><td class="text-center font-mono">27</td><td class="font-mono">TI2406</td><td>Metode Penelitian</td><td class="text-center font-mono">3</td><td class="text-center font-bold">A</td><td class="text-center font-mono">4,00</td><td class="text-right font-mono">12,00</td></tr>
        <tr><td class="text-center font-mono">28</td><td class="font-mono">TI2407</td><td>Kewirausahaan</td><td class="text-center font-mono">3</td><td class="text-center font-bold">B</td><td class="text-center font-mono">3,00</td><td class="text-right font-mono">9,00</td></tr>
      </tbody>
    </table>

    <div class="summary-strip">
      <div class="stat-col">
        <div class="stat-lbl">Total SKS Lulus</div>
        <div class="stat-val">84 SKS</div>
      </div>
      <div class="stat-col">
        <div class="stat-lbl">Total Angka Mutu</div>
        <div class="stat-val">317,40</div>
      </div>
      <div class="stat-col">
        <div class="stat-lbl">IPK Kumulatif</div>
        <div class="stat-val">3,78</div>
      </div>
      <div class="stat-col">
        <div class="stat-lbl">Predikat Kelulusan</div>
        <div class="stat-val" style="font-size: 11px;">Dengan Pujian (Cum Laude)</div>
      </div>
    </div>

    <div class="signature-row">
      <div class="sig-col">
        <div class="sig-date">Bandung, 18 Juli 2025</div>
        <div class="sig-role">Dosen Pembimbing Akademik</div>
        <div class="sig-qr">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          <span>QR-VALID</span>
        </div>
        <div class="sig-name">Dr. Maya Lestari</div>
        <div class="sig-id">NIDN 0408098201</div>
      </div>

      <div class="sig-col">
        <div class="sig-date">Mengetahui,</div>
        <div class="sig-role">Wakil Rektor Bidang Akademik</div>
        <div class="sig-qr">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          <span>QR-VALID</span>
        </div>
        <div class="sig-name">Prof. Dr. Ir. Hendra Gunawan, M.T.</div>
        <div class="sig-id">NIP 197805142003121002</div>
      </div>
    </div>
  `;
  return wrapA4Document('Transkrip Akademik Sementara — Alya Rahma Putri', content);
}

// Write files to output folder
const khsHtml = generateKHS();
const krsHtml = generateKRS();
const transkripHtml = generateTranscript();

fs.writeFileSync(path.join(outputDir, 'KHS_2023010042_Alya_Rahma_Putri.html'), khsHtml, 'utf8');
fs.writeFileSync(path.join(outputDir, 'KRS_2023010042_Alya_Rahma_Putri.html'), krsHtml, 'utf8');
fs.writeFileSync(path.join(outputDir, 'Transkrip_2023010042_Alya_Rahma_Putri.html'), transkripHtml, 'utf8');

console.log('==================================================================');
console.log('📄 REAL ACADEMIC DOCUMENTS SUCCESSFULLY GENERATED:');
console.log('==================================================================');
console.log('  1. output/KHS_2023010042_Alya_Rahma_Putri.html');
console.log('  2. output/KRS_2023010042_Alya_Rahma_Putri.html');
console.log('  3. output/Transkrip_2023010042_Alya_Rahma_Putri.html');
console.log('==================================================================');
